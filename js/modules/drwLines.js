/**
 * Created by xinye on 16/5/18.
 */

var AllData=require("./AllData");
var drwSw=require("./drwMain");

var Drwlines={
    defaultColor:AllData.statusColor[0].color,
    ns_svg: AllData.ns_svg,
    //输入主路的路径点,以及偏移量——输出两条路径的路径点信息
    doublePathInfo: function (mainPathData,offset) {

        /*计算主路径的偏离角度*/
        var p_a = [];
        var p0 = {}, p1 = {};
        //遍历mainPathData上所有的路径点
        for (var Path_id in mainPathData) {
            var point = mainPathData[Path_id].split(' ').join(',');
            var p = {};
            p.x = parseInt(point.split(",")[0]);
            p.y = parseInt(point.split(",")[1]);
            /*如果p1不存在,那就定义p为p1*/
            if (!p1) {
                p1 = p;
                return;
            }
            p1._a = Math.atan2(p.y - p1.y, p.x - p1.x);
            if (p0) {
                p1.angle = Math.atan2(Math.sin(p0._a) + Math.sin(p1._a), Math.cos(p0._a) + Math.cos(p1._a));
                p1.angle -= Math.PI / 2;
                var theta = Math.abs(p1._a - p0._a);
                if (theta > Math.PI) {
                    theta = 2 * Math.PI - theta;
                }
                p1.inclinedAngle = Math.PI - theta;
            } else {
                p1.angle = p1._a - Math.PI / 2;
            }
            p0 = p1;
            p1 = p;
            p_a.push(p0._a);
        }
        //p1.angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI / 2;
        p_a[0] = p_a[1];

        //编译Right,Left数组
        var info={};
        var LeftPath = [], RightPath=[];
        info.LeftPath=LeftPath;
        info.RightPath=RightPath;
        //遍历mainPathData上所有的路径点
        for(var Path_id in mainPathData){
            var point = mainPathData[Path_id].split(' ').join(',');
            var p = {};
            p.x = parseInt(point.split(",")[0]);
            p.y = parseInt(point.split(",")[1]);


            //计算偏移量
            var _p_a=parseInt(p_a[Path_id]*100000000);
            var Xoffset="", Yoffset="";
            if(_p_a==0 || _p_a==314159265 || _p_a==-157079632 || _p_a==157079632){
                //直角或者平角的情况
                Xoffset=parseInt(offset*Math.cos(Math.PI/2-p_a[Path_id]))/10;
                Yoffset=parseInt(offset*Math.sin(Math.PI/2+p_a[Path_id]))/10;
            }else{
                //其他角度的情况
                Xoffset=parseInt((offset+2)*Math.cos(Math.PI/2-p_a[Path_id]))/10;
                Yoffset=parseInt((offset+2)*Math.sin(Math.PI/2+p_a[Path_id]))/10;
            }

            //左偏移
            var LeftX=p.x+Xoffset;
            var LeftY=p.y-Yoffset;
            LeftPath.push(LeftX+" "+LeftY);
            //右偏移
            var RightX= p.x-Xoffset;
            var RightY=p.y+Yoffset;
            RightPath.push(RightX+" "+RightY);
        }
        return info;
    },
    drwDouble: function (parentNode,drwData) {
        //画双线
        var self=this;
        var dataset_line_arr=drwData.c;
        var station = drwData.st;
        var start = station[0].n,
            end = station[station.length - 1].n;
        var Left = {}, Right = {};
        //console.log(dataset_line_arr);
        //获取到两条路径信息，分路径信息
        Left.path = self.doublePathInfo(dataset_line_arr, 26).LeftPath;
        Right.path = self.doublePathInfo(dataset_line_arr, 26).RightPath;

        //获取左右两条线的颜色,若是地铁线颜色:current_drwData.cl;
        Left.color = self.defaultColor;
        Right.color = self.defaultColor;

        //确定两条线的终点信息
        Left.direction = end+"-to-"+start;
        Right.direction = start+"-to-"+end;

        //确定所属线段的line_id
        Left.reflineName = drwData.ln;
        Right.reflineName = drwData.ln;

        var lineId=drwData.ls;
        //区分机场线
        if(lineId=="110005"){
            self.drwlines(parentNode, Right, drwData);
        }else{
            self.drwlines(parentNode, Left, drwData);
            self.drwlines(parentNode, Right, drwData);
        }
    },
    //画单线:输入:挂载节点,路径的名称,地铁线的id/name数据,输出:单条地铁线
    drwlines: function (parentNode,pathName,LineId_Data) {
        var self=this;
        var onepath=pathName.path;
        var	direction=pathName.direction;
        var node_first = 'M' + onepath[0].split(' ').join(',');
        var path = node_first + 'L' + onepath.join('L');
        var line_path = document.createElementNS(this.ns_svg, 'path');
        //line_path.setAttribute("id", "line-"+ LineId_Data.ls+"-"+ direction);
        line_path.setAttribute("name", "line-"+ pathName.reflineName +"-"+ direction);
        var color={};
        //如果提供了强制的数据颜色,那就使用提供的颜色,否则就画定义好的颜色
        if(pathName.color){
            color=pathName.color;
        }else{
            color=Drwlines.defaultColor;/*如果感应器没有数据,就画默认颜色*/
            //color=LineId_Data.cl;
        }
        var loadRate="";
        if(pathName.loadRate){
            loadRate=pathName.loadRate
        }else{
            loadRate="No Data!"
        }
        line_path.setAttribute("stroke", "#" + color);
        line_path.setAttribute("d", path);
        line_path.setAttribute("loadRate", loadRate);
        parentNode.appendChild(line_path);
    }
};

module.exports=Drwlines;

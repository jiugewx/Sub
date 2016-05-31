/**
 * Created by xinye on 16/5/18.
 */

var AllData=require("./AllData");
var drwSw=require("./drwMain");

var Drwlines={
    defaultColor:AllData.statusColor[0].color,
    ns_svg: AllData.ns_svg,
    //输出角度
    Path2Angles:function(mainPathData){
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
        return p_a;
    },
    //输入主路的路径点,以及偏移量——输出两条路径的路径点信息
    doublePathInfo: function (mainPathData,offset) {
        var self=this;
        /*计算主路径的偏离角度*/
        var p_a=self.Path2Angles(mainPathData);
        //编译Right,Left数组
        var info={};
        var LeftPath = [], RightPath=[];
        //计算偏移量
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
                Xoffset=offset*Math.cos(Math.PI/2-p_a[Path_id]).toFixed(2)/10;
                Yoffset=offset*Math.sin(Math.PI/2+p_a[Path_id]).toFixed(2)/10;
            }else{
                //其他角度的情况
                Xoffset=(offset+2)*Math.cos(Math.PI/2-p_a[Path_id]).toFixed(2)/10;
                Yoffset=(offset+2)*Math.sin(Math.PI/2+p_a[Path_id]).toFixed(2)/10;
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

        info.LeftPath=LeftPath;
        info.RightPath=RightPath;
        info.Angles=p_a;
        info.LeftAngles=self.Path2Angles(info.LeftPath);
        info.RightAngles=self.Path2Angles(info.RightPath);
        //console.log(info.LeftAngles,info.Angles);

        info.LeftPathCtrls=self.findControlPoints(info.LeftPath,info.LeftAngles);
        info.RightPathCtrls=self.findControlPoints(info.RightPath,info.RightAngles);
        return info;
    },
    //划双线
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

        //获取控制点
        Left.pathCtrls=self.doublePathInfo(dataset_line_arr, 26).LeftPathCtrls;
        Right.pathCtrls=self.doublePathInfo(dataset_line_arr, 26).RightPathCtrls;

        //获取角度
        Left.Angles=self.doublePathInfo(dataset_line_arr, 26).Angles;
        Right.Angles=self.doublePathInfo(dataset_line_arr, 26).Angles;

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
            self.drwSingleLine(parentNode, Right, drwData);
        }else{
            self.drwSingleLine(parentNode, Left, drwData);
            self.drwSingleLine(parentNode, Right, drwData);
            self.Path2Strings(Left.path,Left.pathCtrls,Left.Angles);
            self.Path2Strings(Right.path,Right.pathCtrls,Right.Angles);
        }
    },
    //画单线:输入:挂载节点,路径的名称,地铁线的id/name数据,输出:单条地铁线
    drwSingleLine: function (parentNode,pathName,LineId_Data) {
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
    },
    findControlPoints:function (mainPathData,Angles){
        //增加一个控制点,化圆弧
        var p_ctrs=[];
        for(var Path_id2=1;Path_id2<mainPathData.length;Path_id2++){
            var point0 = mainPathData[Path_id2-1].split(' ').join(',');
            var point1 = mainPathData[Path_id2].split(' ').join(',');
            var p0 = {},p1={},p_ctr={};
            p0.x = parseInt(point0.split(",")[0]);
            p0.y = parseInt(point0.split(",")[1]);
            p1.x = parseInt(point1.split(",")[0]);
            p1.y = parseInt(point1.split(",")[1]);
            var a0=Angles[Path_id2-1],a1=Angles[Path_id2];
            if (a0 == a1) {
                p_ctr.x = (p0.x + p1.x) / 2;
                p_ctr.y = (p0.y + p1.y) / 2;
            } else {
                p_ctr.x = ((Math.tan(a0) * p0.x - Math.tan(a1) * p1.x + p1.y - p0.y) / (Math.tan(a0) - Math.tan(a1))).toFixed(3);
                p_ctr.y = (Math.tan(a0)*(p_ctr.x-p0.x)+p0.y).toFixed(3);
            }
            p_ctrs.push(p_ctr.x+" "+p_ctr.y);
        }
        return p_ctrs
    },
    Path2Strings:function(Path,PathCtrls,Angles){
        var Otherpaths=[];
        var first_LeftPoint= 'M' + Path[0].split(' ').join(',');
        for(var Path_id3 =1 ; Path_id3<Path.length;Path_id3++){
            var Otherpath="";
            if(Angles[Path_id3]!=Angles[Path_id3-1]){
                Otherpath ='Q' + PathCtrls[Path_id3-1].toString()+" "+Path[Path_id3].toString();
            }
            else{
                Otherpath ='L' +Path[Path_id3].toString();
            }
            Otherpaths.push(Otherpath);
        }
        Otherpaths.unshift(first_LeftPoint);
        var newpathString=Otherpaths.join(' ').toString();
        //console.log(newpath);
        return newpathString;
    }
};

module.exports=Drwlines;

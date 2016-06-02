/**
 * Created by xinye on 16/5/18.
 */

var AllData=require("./AllData");
var drwSw=require("./drwMain");

var Drwlines={
    defaultColor:AllData.statusColor[0].color,
    ns_svg: AllData.ns_svg,
    /*创建一个含有patharray和控制点Q的index信息的对象:pathInfo*/
    createPathInfo:function (path) {
        /*这里不会改变path的原有值*/
        var info={};
        var pathArray=[],indexQ=[];
        for (var s = 0; s < path.length; s++) {
            var _lp = path[s].split(' ');
            /*判断是否含有控制点Q*/
            if (_lp[0].toString().indexOf("Q") > -1) {
                _lp[0] = _lp[0].slice(1);
                indexQ[s] = s;
                pathArray[s] = Number(_lp[0]) + ' ' + Number(_lp[1]);
            } else {
                indexQ[s] = "";
                pathArray[s] = Number(_lp[0]) + ' ' + Number(_lp[1]);
            }
        }
        info.pathArray=pathArray;
        info.Qindex=indexQ;
        return info;
    },
    //输出角度
    Path2Angles:function(pathArray){
        /*计算主路径的偏离角度*/
        var p_a = [];
        var p0 = {}, p1 = {};
        //遍历mainPathData上所有的路径点
        for (var Path_id in pathArray) {
            var point = pathArray[Path_id].split(' ').join(',');
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
    Path2Strings:function(PathArrayhasQ){
        var newpathString=[];
        //console.log(PathArrayhasQ);
        var first_LeftPoint= 'M' + PathArrayhasQ[0].split(' ').join(',');
        for(var Path_id3 =1 ; Path_id3<PathArrayhasQ.length;Path_id3++){
            var pathhasQ=[];
            if(PathArrayhasQ[Path_id3-1].indexOf("Q")>-1 || PathArrayhasQ[Path_id3].indexOf("Q")>-1){
                pathhasQ=PathArrayhasQ[Path_id3];
            }else{
                pathhasQ="L"+PathArrayhasQ[Path_id3];
            }

            newpathString.push(pathhasQ);
        }
        newpathString.unshift(first_LeftPoint);
        var pathStrings=newpathString.toString();
        return pathStrings;
    },
    renewPath:function (pathInfo) {
    var pathArray=[];
    for(var i in pathInfo.pathArray){
        if(pathInfo.Qindex[i]!=""){
            pathArray[i]="Q"+pathInfo.pathArray[i];
        }else{
            pathArray[i]=pathInfo.pathArray[i];
        }
    }
//        console.log(pathArray);
    return pathArray;
},
    //
    doublePathInfo:function(pathInfo,offset){
        var self=this;
        /*计算主路径的偏离角度*/
        var pathArray=pathInfo.pathArray;
        var p_a=self.Path2Angles(pathArray);
        //编译Right,Left数组
        var info={};
        var LeftPath = [], RightPath=[];
        var offsets=[];
        //计算偏移量
        for(var Path_id in pathArray){
            //计算偏移量
            var _p_a=parseInt(p_a[Path_id]*100000000);
            var Xoffset="", Yoffset="";
            if(_p_a==0 || _p_a==314159265 || _p_a==-157079632 || _p_a==157079632){
                //直角或者平角的情况
                Xoffset=parseInt(offset*Math.cos(Math.PI/2-p_a[Path_id]))/10;
                Yoffset=parseInt(offset*Math.sin(Math.PI/2+p_a[Path_id]))/10;
            }else{
                //其他角度的情况
                Xoffset=parseInt((offset+5)*Math.cos(Math.PI/2-p_a[Path_id]))/10;
                Yoffset=parseInt((offset+5)*Math.sin(Math.PI/2+p_a[Path_id]))/10;
            }
            offsets.push(Xoffset+","+Yoffset);
        }
        /*重新编译offsets*/
        for(var i= 2;i<offsets.length;i++){
            var _x2=Number(offsets[i].split(",")[0]),_y2=Number(offsets[i].split(",")[1]);
            var _x0=Number(offsets[i-2].split(",")[0]),_y0=Number(offsets[i-2].split(",")[1]);
            var _x1=Number,_y1=Number;
            _x1=Math.abs(_x2)>Math.abs(_x0)?_x2:_x0;
            _y1=Math.abs(_y2)>Math.abs(_y0)?_y2:_y0;
            if(pathInfo.Qindex[i-1]!=""){
                offsets[i-1]=_x1+","+_y1;
            }
        }
        /*编译左右路径*/
        for(var index in pathArray){
            var point = pathArray[index].split(' ').join(',');
            var p = {};
            p.x = parseInt(point.split(",")[0]);
            p.y = parseInt(point.split(",")[1]);
            var Xoffset=Number(offsets[index].split(",")[0]);
            var Yoffset=Number(offsets[index].split(",")[1]);
            var LeftX="",LeftY="",RightX="",RightY="";
            //左偏移
            LeftX = p.x + Xoffset;
            LeftY = p.y - Yoffset;
            LeftPath.push(LeftX + " " + LeftY);
            //右偏移
            RightX = p.x - Xoffset;
            RightY = p.y + Yoffset;
            RightPath.push(RightX + " " + RightY);
        }
        /*编译左右两条路劲的info*/
        var Left={},Right={};
        Left.pathArray=LeftPath;
        Right.pathArray=RightPath;
        Left.Qindex=pathInfo.Qindex;
        Right.Qindex=pathInfo.Qindex;
        /*编译输出的info*/
        info.LeftPathhasQ=self.renewPath(Left);
        info.RigthPathhaQ=self.renewPath(Right);
        info.LeftPath=LeftPath;
        info.RightPath=RightPath;
        //赋值pathStrings
        info.LeftPathStrings=self.Path2Strings(info.LeftPathhasQ);
        info.RightPathStrings=self.Path2Strings(info.RigthPathhaQ);
        return info;
    },
    //输入主路的路径点,以及偏移量——输出两条路径的路径点信息
    //doublePathInfo0: function (mainPathData,offset) {
    //    var self=this;
    //    /*计算主路径的偏离角度*/
    //    var p_a=self.Path2Angles(mainPathData);
    //    //编译Right,Left数组
    //    var info={};
    //    var LeftPath = [], RightPath=[];
    //    //计算偏移量
    //    for(var Path_id in mainPathData){
    //        var point = mainPathData[Path_id].split(' ').join(',');
    //        var p = {};
    //        p.x = parseInt(point.split(",")[0]);
    //        p.y = parseInt(point.split(",")[1]);
    //        //计算偏移量
    //        var _p_a=parseInt(p_a[Path_id]*100000000);
    //        var Xoffset="", Yoffset="";
    //        if(_p_a==0 || _p_a==314159265 || _p_a==-157079632 || _p_a==157079632){
    //            //直角或者平角的情况
    //            Xoffset=parseInt(offset*Math.cos(Math.PI/2-p_a[Path_id]))/10;
    //            Yoffset=parseInt(offset*Math.sin(Math.PI/2+p_a[Path_id]))/10;
    //        }else{
    //            //其他角度的情况
    //            Xoffset=parseInt((offset+5)*Math.cos(Math.PI/2-p_a[Path_id]))/10;
    //            Yoffset=parseInt((offset+5)*Math.sin(Math.PI/2+p_a[Path_id]))/10;
    //        }
    //        //左偏移
    //        var LeftX=p.x+Xoffset;
    //        var LeftY=p.y-Yoffset;
    //        LeftPath.push(LeftX+" "+LeftY);
    //        //右偏移
    //        var RightX= p.x-Xoffset;
    //        var RightY=p.y+Yoffset;
    //        RightPath.push(RightX+" "+RightY);
    //    }
    //
    //    info.LeftPath=LeftPath;
    //    info.RightPath=RightPath;
    //    info.Angles=p_a;
    //    return info;
    //},
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
        var dataset_line_arr_Info=self.createPathInfo(dataset_line_arr);
        Left.path = self.doublePathInfo(dataset_line_arr_Info, 26).LeftPath;
        Right.path = self.doublePathInfo(dataset_line_arr_Info, 26).RightPath;
        Left.pathStrings = self.doublePathInfo(dataset_line_arr_Info, 26).LeftPathStrings;
        Right.pathStrings = self.doublePathInfo(dataset_line_arr_Info, 26).RightPathStrings;

        //获取到两条路径信息，分路径信息
        //Left.path = self.doublePathInfo(dataset_line_arr, 26).LeftPath;
        //Right.path = self.doublePathInfo(dataset_line_arr, 26).RightPath;

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
        }
    },
    //画单线:输入:挂载节点,路径的名称,地铁线的id/name数据,输出:单条地铁线
    drwSingleLine: function (parentNode,pathName,LineId_Data) {
        var self=this;
        var onepath=pathName.path;
        var	direction=pathName.direction;
        var node_first = 'M' + onepath[0].split(' ').join(',');
        //var path = node_first + 'L' + onepath.join('L');
        //console.log("path0",path);
        var path = pathName.pathStrings;
        //console.log("path2",path2);
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

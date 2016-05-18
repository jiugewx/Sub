/**
 * Created by xinye on 16/5/18.
 */




var Drw2lines={
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
            //计算偏离度
            var Xoffset=parseInt(offset*Math.cos(Math.PI/2-p_a[Path_id])),
                Yoffset=parseInt(offset*Math.sin(Math.PI/2+p_a[Path_id]));
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
        //获取到两条路径信息，分路径信息
        Left.path = self.doublePathInfo(dataset_line_arr, 3).LeftPath;
        Right.path = self.doublePathInfo(dataset_line_arr, 3).RightPath;

        //获取左右两条线的颜色,若是地铁线颜色:current_drwData.cl;
        Left.color = drwSw.defaultColor;
        Right.color = drwSw.defaultColor;

        //确定两条线的终点信息
        Left.direction = end+"-to-"+start;
        Right.direction = start+"-to-"+end;

        //确定所属线段的line_id
        Left.reflineName = drwData.ln;
        Right.reflineName = drwData.ln;

        var lineId=drwData.ls;
        //区分机场线
        if(lineId=="110005"){
            drwSw.drwlines(parentNode, Right, drwData);
        }else{
            drwSw.drwlines(parentNode, Left, drwData);
            drwSw.drwlines(parentNode, Right, drwData);
        }
    },
};

module.exports=Drw2lines;

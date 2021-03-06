/**
 * Created by xinye on 16/5/20.
 */

var AllData = require("./AllData");
var DrwTraf = require("./drwtraffic");
var drwSw = require("./drwMain");
var DrwLimit=require("./drwlimit");

var drwSelect = {
    ns_svg: AllData.ns_svg,
    drawSelectLine: function (drwData) {
        var self = this;
        var status = 'select';
        var svg_g = document.getElementById("svg-g");
        var subway_select_g = document.createElementNS(self.ns_svg, 'g');
        subway_select_g.setAttribute("id", "g-select");
        svg_g.appendChild(subway_select_g);
        drwSw.drwSwLines(drwData, status);
        drwSw.drwSwStations(drwData, status);
        drwSw.drwSwStationsName(drwData, status, 10, 20); //缩小为0.5，第二个参数为24
        drwSw.drwSwLinesName(drwData, status);
        DrwTraf.drwTrafficLinesDefer(drwData, status);
        DrwLimit.drwlimitStDefer(drwData, status);
    }
};

module.exports = drwSelect;
/**
 * Created by Wangxin on 2016/5/6.
 */

var React = require('react');

/*站点信息组建*/
var TipDetailLine = React.createClass({
    getInitialState: function () {
        return {

        }
    }, render: function () {
        return <div className="tip_detail_line">
            <div className="tip_detail_lineName">5号线</div>
            <div className="tip_detail_lineright">
                <span className="tip_detail_direction">天通苑北方向</span>
                <span className="tip_detail_btn tip_detail_end">末：23:50</span>
                <span className="tip_detail_btn tip_detail_start">首：05:50</span>
            </div>
            <div className="tip_detail_lineleft">
                <span className="tip_detail_direction">宋家庄方向</span>
                <span className="tip_detail_btn tip_detail_end">末：23:08</span>
                <span className="tip_detail_btn tip_detail_start">首：05:20</span>
            </div>
        </div>
    }
});

module.exports = TipDetailLine;
/**
 * Created by Wangxin on 2016/5/6.
 */

var React = require('react');

/*վ����Ϣ�齨*/
var TipDetailLine = React.createClass({
    getInitialState: function () {
        return {

        }
    }, render: function () {
        return <div className="tip_detail_line">
            <div className="tip_detail_lineName">5����</div>
            <div className="tip_detail_lineright">
                <span className="tip_detail_direction">��ͨԷ������</span>
                <span className="tip_detail_btn tip_detail_end">ĩ��23:50</span>
                <span className="tip_detail_btn tip_detail_start">�ף�05:50</span>
            </div>
            <div className="tip_detail_lineleft">
                <span className="tip_detail_direction">�μ�ׯ����</span>
                <span className="tip_detail_btn tip_detail_end">ĩ��23:08</span>
                <span className="tip_detail_btn tip_detail_start">�ף�05:20</span>
            </div>
        </div>
    }
});

module.exports = TipDetailLine;
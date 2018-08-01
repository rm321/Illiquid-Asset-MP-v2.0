import React from "react"
import LineChart from 'react-linechart'
import { Connect } from 'react-redux'
import { REAssetsCon, AssetRegisterCon, web3 } from "../../constants"

var timeF, label;
export default class HistoryChart extends React.Component {
    calculate(timeFormat) {
        var dataList = this.props.userReqtReducer.assetHistoryList;
        var data = [];
        var regdTs;
        if (timeFormat === 'Hours') {
            timeF = 60 * 60 * 1000,
                label = "Time Period(Hours)"

        }
        else if (timeFormat === 'Minutes') {
            timeF = 60 * 1000,
                label = "Time Period(Minutes)"
        }
        else {
            timeF = 24 * 60 * 60 * 1000,
                label = "Time Period(Days)"
        }

        if (((this.props.userReqtReducer.searchAstID).substring(0, 4)) == "REAL") {
            var temp = REAssetsCon.getREAssetsDetailsById(this.props.userReqtReducer.searchAstID);
            regdTs = temp[2];
        }
        else {
            regdTs = AssetRegisterCon.getAssetTimestamp(this.props.userReqtReducer.searchAstID);
        }
        var date1 = this.props.userReqtReducer.assetHistoryList[0].rawTimestamp;//regdTs.c[0];
        var date2 = (
            this.props.userReqtReducer.assetHistoryList[1] ?
                (this.props.userReqtReducer.assetHistoryList[1].rawTimestamp)
                :
                0
        )

        var currentPrice = 0;
        var Ts1 = 0;
        for (var i = 1; i < (dataList.length - this.props.buffer); i++) {
            var Ts = Math.floor((date2 - date1) / timeF) + Ts1;
            Ts1 = Ts;
            data.push({
                x: Ts,
                y: (this.props.userReqtReducer.assetHistoryList[i].amt) / 1000
            });
            if ((i + 1) <= (dataList.length - this.props.buffer)) {

                date1 = date2;
                date2 = this.props.userReqtReducer.assetHistoryList[i + 1].rawTimestamp;
            }
        }
        data.unshift({ x: 0, y: this.props.userReqtReducer.assetHistoryList[0].amt / 1000 });
        this.props.URSetValue({ id: 'TradedData', val: data });
    }
    componentWillMount() {
        this.calculate(this.props.userReqtReducer.timeFormat);
    }
    componentWillReceiveProps(nextProps) {
        (nextProps.userReqtReducer.timeFormat !== this.props.userReqtReducer.timeFormat) && (this.calculate(nextProps.userReqtReducer.timeFormat))
    }
    componentWillUnmount() {
        this.props.URSetValue({ id: 'TradedData', val: [] });
    }
    render() {
        let chartData = [
            {
                color: "steelblue",
                points: (this.props.userReqtReducer.TradedData).map(k => k)
            }
        ];
        return (
            <div className="col-md-12 no-padding">
                <LineChart
                    width={554}
                    hideXLabel={true}
                    height={264}
                    xLabel={label}
                    data={chartData}
                    yLabel={"Price(1k)"}
                    interpolate={"none"}
                />
            </div >

        );
    }
}

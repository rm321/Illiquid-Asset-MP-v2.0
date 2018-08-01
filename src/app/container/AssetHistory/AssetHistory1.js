import React from "react";
import './AssetHistory.css'
import { Link, withRouter } from 'react-router'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import classNames from 'classnames'
import { setTitle } from '../../actions/titleActions'
import { URUpdateInputValue, URSetTrue, URSetFalse, URSetValue } from '../../actions/userReqtActions'
import HistoryChart from '../../components/HistoryChart/HistoryChart'
import { Pagination } from 'react-bootstrap'
import 'font-awesome/css/font-awesome.css'
import { TxRegisterCon, web3 } from "../../constants"

let regeneratorRuntime = require("regenerator-runtime");

var assetTxDetails;
class AssetHistory extends React.Component {

    componentWillMount() {
        this.props.setTitle("Asset History");
    }
    componentWillUnmount() {
        this.props.URSetValue({ id: "searchAstID", val: "" });
        this.props.URSetValue({ id: 'assetHistoryList', val: [] });
        this.props.URSetFalse("isIDValid");
        this.props.URSetFalse("noTransactions");
    }

    onSearch() {
        this.props.URSetFalse("noTransactions");
        this.props.URSetTrue("isIDValid");
        debugger;
        if (this.props.userReqtReducer.searchAstID.length === 8) {
            var data = [];
            assetTxDetails = TxRegisterCon.getAssetHistoryByAssetId(this.props.userReqtReducer.searchAstID);
            this.props.URSetValue({ id: "searchTradeLen", val: assetTxDetails[0].length });

            if (assetTxDetails[0].length === 0) {
                this.props.URSetTrue("noTransactions");
            }
            else {
                for (var i = 0; i < assetTxDetails[0].length; i++) {
                    var ts1 = assetTxDetails[5][i].c[0];
                    var ts = (new Date(ts1)).toLocaleString();
                    data.push({
                        buyer: web3.toAscii(assetTxDetails[1][i]),
                        seller: web3.toAscii(assetTxDetails[2][i]),
                        qty: assetTxDetails[4][i].c[0],
                        amt: (assetTxDetails[3][i].c[0]) / (assetTxDetails[4][i].c[0]),
                        timestamp: ts,
                        rawTimestamp: assetTxDetails[5][i].c[0]
                    });
                }
                this.props.URSetValue({ id: 'assetHistoryList', val: data });
            }

        }
        else {
            this.props.URSetTrue('isWrngSrch');
            setTimeout(() => {
                this.props.URSetFalse('isWrngSrch');
            }, 1500);
        }
    }
    componentWillReceiveProps(nextProps) {
        ((nextProps.userReqtReducer.searchAstID.length === 8) && nextProps.userReqtReducer.searchAstID !== this.props.userReqtReducer.searchAstID) &&
        this.props.URSetFalse("isIDValid");        
    }
    render() {
        const per_page = 5;
        const pages = Math.ceil(this.props.userReqtReducer.searchTradeLen / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        var wrongSearch = classNames({ "wrngSearch": (this.props.userReqtReducer.isWrngSrch) });
        var wrongMsg = classNames({ "wrngMsg": !(this.props.userReqtReducer.isWrngSrch) });
        let self = this;
        let formats = this.props.timeFormat.map((type, index) => {
            return <option key={index}>{type}</option>
        });

        return (
            <section className="assetHistory-section h100 w100">

                <div className="row no-margin">

                    <div className="col-md-4"><h3>Please enter Asset ID to search:</h3></div>

                    <div className="col-md-4">
                        <input
                            className={wrongSearch}
                            id="search-Ast-ID"
                            name="searchAstID"
                            minLength="8"
                            maxLength="8"
                            onChange={this.props.URUpdateInputValue} />
                        <button
                            onClick={() => this.onSearch()}>
                            <i className="fa fa-search" />
                        </button>
                        <div className={wrongMsg} id="wrngMsg-div">
                            {
                                (this.props.userReqtReducer.searchAstID.length === 0) ?
                                    (
                                        <i className="fa fa-warning">Please Enter AssetID</i>
                                    )
                                    :
                                    (
                                        <i className="fa fa-warning">Not a valid AssetID</i>
                                    )
                            }

                        </div>
                    </div>
                    <div className="col-md-3 col-md-offset-1" id="frmt-dropdown">
                        <label htmlFor="time-fmt">Time format in: </label>
                        <select
                            name="timeFormat"
                            id="time-fmt"
                            value={this.props.userReqtReducer.timeFormat}
                            onChange={this.props.URUpdateInputValue}
                        >
                            {formats}
                        </select>
                    </div>
                </div>
                <hr />
                <div className="row no-margin">

                    {
                        (this.props.userReqtReducer.searchAstID && (this.props.userReqtReducer.searchAstID.length === 8) && (this.props.userReqtReducer.isIDValid)) ?
                            (

                                this.props.userReqtReducer.noTransactions ?
                                    (
                                        <h1>No transactions available on this asset</h1>
                                    )
                                    :
                                    (
                                        <div className="row no-margin assetHistoryBody">

                                            <div className="col-md-5 no-padding">
                                                <HistoryChart
                                                    userReqtReducer={this.props.userReqtReducer}
                                                    assetID={this.props.userReqtReducer.searchAstID}
                                                    URSetValue={this.props.URSetValue}
                                                    format={this.props.userReqtReducer.timeFormat}
                                                />
                                            </div>


                                            <div className="col-md-7" id="chartTable">
                                                <table className="table table-bordered table-hover table-responsive table-position">
                                                    <thead>
                                                        <tr>
                                                            <th>Trade Time</th>
                                                            <th>Seller ID</th>
                                                            <th>Buyer ID</th>
                                                            <th>Price per Unit</th>

                                                            {/*{
                                                        (this.props.userReqtReducer.assetType !== 'Real Estate') &&
                                                        <th>Traded Quantity</th>
                                                    }*/}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.props.userReqtReducer.assetHistoryList.map((details, i) => {
                                                                if (i >= start_offset && start_count < per_page) {
                                                                    start_count++;
                                                                    return (<tr value={self.selected} key={i}>
                                                                        <td >{details.timestamp}</td>
                                                                        <td >{details.seller}</td>
                                                                        <td >{details.buyer}</td>
                                                                        <td >{details.amt}</td>
                                                                        {/*{
                                                                    (this.props.userReqtReducer.assetType !== 'Real Estate') &&
                                                                    <td >{details.qty}</td>
                                                                }*/}
                                                                    </tr>
                                                                    );
                                                                }
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div>
                                                <Pagination className="assets-pagination pull-right" bsSize="medium" maxButtons={5} first last next prev boundaryLinks
                                                    items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                                            </div>

                                        </div>
                                    )


                            )
                            :
                            (
                                <h1>Details will appear here</h1>
                            )

                    }
                </div>
            </section>
        );
    }
    changePage(page) {
        this.props.router.push('/AssetHistory?page=' + page);
    }
};

const mapStateToProps = (state) => {
    return {
        title: state.title,
        logModRed: state.logModRed,
        userReqtReducer: state.userReqtReducer,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, URUpdateInputValue, URSetTrue, URSetFalse, URSetValue }, dispatch);
}
AssetHistory.defaultProps = {
    timeFormat: ['Minutes', 'Hours', 'Days']
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AssetHistory));
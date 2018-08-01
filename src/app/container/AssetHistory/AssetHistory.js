import React from "react";
import './AssetHistory.css'
import { Link, withRouter, browserHistory } from 'react-router'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import classNames from 'classnames'
import { setTitle } from '../../actions/titleActions'
import { URUpdateInputValue, URSetTrue, URSetFalse, URSetValue, URAlterBoolean } from '../../actions/userReqtActions'
import HistoryChart from '../../components/HistoryChart/HistoryChart'
import { Pagination, Button, Breadcrumb, BreadcrumbItem } from 'react-bootstrap'
import 'font-awesome/css/font-awesome.css'
import { TxRegisterCon, web3, REAssetsCon } from "../../constants"
import Maps from '../../components/Maps/Maps';

let regeneratorRuntime = require("regenerator-runtime");

var assetTxDetails;
// var DescAndName;
var originalLength;
var buffer;
class AssetHistory extends React.Component {

    componentWillMount() {
        this.props.setTitle("Asset Details");
        { this.onSearch() }
        // DescAndName = REAssetsCon.getREAssetDet(this.props.userReqtReducer.selectedAstDetails.securityID);
    }
    componentWillUnmount() {
        this.props.URSetValue({ id: "searchAstID", val: "" });
        this.props.URSetValue({ id: 'assetHistoryList', val: [] });
        this.props.URSetFalse("noTransactions");
    }
    assetDetailsContainer() {
        return (
            <div id='astDetContainerPane'>
                <label htmlFor="slctdAssetID">Asset ID</label><b>:</b>
                <span id="slctdAssetID">
                    {this.props.userReqtReducer.selectedAstDetails.securityID}
                </span>
                <br />

                <label htmlFor="slctdAssetName">Asset Name</label><b>:</b>
                <span id="slctdAssetName">
                    {/*{
                        this.props.userReqtReducer.selectedAstDetails.securityName ?
                            (*/}
                                {this.props.userReqtReducer.selectedAstDetails.securityName}
                            {/*)
                            :
                            (
                                web3.toAscii(DescAndName[0])
                            )
                    }*/}
                </span>
                <br />


                <label htmlFor="slctdAssetType">Asset Sub-type</label><b>:</b>
                <span id="slctdAssetType">
                    {this.props.userReqtReducer.selectedAstDetails.securityType}
                </span>
                <br />

                <label htmlFor="slctdDesc">Asset Description</label><b>:</b>
                <span id="slctdDesc">
                    {/*{
                        (this.props.userReqtReducer.selectedAstDetails.description) ?
                            (*/}
                                {this.props.userReqtReducer.selectedAstDetails.description}
                            {/*)
                            :
                            (
                                DescAndName[1]
                            )
                    }*/}
                </span>
                <br />


                <label htmlFor="slctdAddress">Address</label><b>:</b>
                <span id="slctdAddress">
                    {this.props.userReqtReducer.selectedAstDetails.address}
                </span>
                <br/>
                 <label htmlFor="slctdAddress">Acquisition Price</label><b>:</b>
                <span id="slctdAddress">
                    {this.props.userReqtReducer.selectedAstDetails.acqPrice.toLocaleString()}
                </span>
                <br/>
                 <label htmlFor="slctdAddress">Offer Price</label><b>:</b>
                <span id="slctdAddress">
                    {
                    this.props.userReqtReducer.selectedAstDetails.ofrPrice !== 0 ?
                    (
                        this.props.userReqtReducer.selectedAstDetails.ofrPrice.toLocaleString()
                        )
                        :
                        (
                           'Not Set'
                        )
                    }
                </span>
                <br/>
            </div>
        );
    }
    onSearch() {
        this.props.URSetFalse("noTransactions");
        var data = [];
        assetTxDetails = TxRegisterCon.getAssetHistoryByAssetId(this.props.userReqtReducer.searchAstID);
        this.props.URSetValue({ id: "searchTradeLen", val: assetTxDetails[0].length });
        originalLength = assetTxDetails[0].length;
        buffer = 5 - (assetTxDetails[0].length % 5);
        // if (assetTxDetails[0].length === 0) {
        //     this.props.URSetTrue("noTransactions");
        // }
        // else {
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
        for (var j = 0; j < buffer; j++) {
            data.push({});
        }
        this.props.URSetValue({ id: 'assetHistoryList', val: data });
        // }
    }
    render() {
        const per_page = 5;
        const pages = Math.ceil(this.props.userReqtReducer.searchTradeLen / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        var self = this;
        let latitude = Number(((this.props.userReqtReducer.selectedAstDetails.latitude).split(' N')[0]));
        let longitude = Number(((this.props.userReqtReducer.selectedAstDetails.longitude).split(' E')[0]));
        let formats = this.props.timeFormat.map((type, index) => {
            return <option key={index}>{type}</option>
        });

        return (
            <section className="assetHistory-section h100 w100">
                <div className="row no-margin">

                    {/*{
                        this.props.userReqtReducer.noTransactions ?
                            (
                                <div className="row no-margin">
                                    <h1>No transactions available on this asset</h1>
                                    <hr />
                                    <div className="align-center">
                                        <h1>Asset Details</h1>
                                        {this.assetDetailsContainer()}
                                    </div>
                                    <hr />
                                    <div className="row no-margin">
                                        <Maps
                                            lat={latitude}
                                            long={longitude}
                                            isMarkerShown
                                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6BydSicdSSEW3tFPlE1ecM1EgQyYgKBs&libraries=places"
                                            loadingElement={<div className="h100" />}
                                            containerElement={<div id="full-map-container" />}
                                            mapElement={<div className="h100" />}
                                        />
                                    </div>
                                    <div className="row no-margin">
                                        <button className="btn pull-right" onClick={() => this.props.router.goBack()}>Go back</button>
                                    </div>
                                </div>
                            )
                            :
                            (*/}
                    <div className="row no-margin assetHistoryBody">

                        <div className="row no-margin" id="history-container">

                            <div className="row no-margin margin10px">
                                <div className="col-md-6 asset-details-pane">
                                    {this.assetDetailsContainer()}
                                </div>
                                <div className="col-md-6">
                                    <Maps
                                        lat={latitude}
                                        long={longitude}
                                        isMarkerShown
                                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6BydSicdSSEW3tFPlE1ecM1EgQyYgKBs&libraries=places"
                                        loadingElement={<div className="h100" />}
                                        containerElement={<div id="map-container" />}
                                        mapElement={<div className="h100" />}
                                    />
                                </div>
                            </div>
                            <div className="row no-margin margin10px">

                                <div className="col-md-6 no-padding" id="chart-div">
                                    <div className="pull-right">
                                        <label htmlFor="time-fmt">Time format in: &nbsp;</label>
                                        <select
                                            name="timeFormat"
                                            id="time-fmt"
                                            value={this.props.userReqtReducer.timeFormat}
                                            onChange={this.props.URUpdateInputValue}>
                                            {formats}
                                        </select>
                                    </div>
                                    {
                                        (originalLength > 0 && this.props.userReqtReducer.assetHistoryList.length > 0) ?
                                            (
                                                <HistoryChart
                                                    userReqtReducer={this.props.userReqtReducer}
                                                    URSetValue={this.props.URSetValue}
                                                    buffer={buffer}
                                                />
                                            )
                                            :
                                            (
                                                <h1 className='col-md-10 col-md-offset-1' id='noHisMsg'>
                                                    <span>No transaction history</span>
                                                </h1>
                                            )
                                    }

                                </div>
                                <div className="col-md-6" id="asset-table-pane">
                                    <table className="table table-bordered table-hover table-responsive table-position">
                                        <thead>
                                            <tr>
                                                <th>Trade Time</th>
                                                <th>Seller ID</th>
                                                <th>Buyer ID</th>
                                                <th>Price Per Unit</th>

                                                {/*{
                                                        (this.props.userReqtReducer.assetType !== 'Real Estate') &&
                                                        <th>Traded Quantity</th>
                                                    }*/}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (originalLength !== 0) ?
                                                    (
                                                        this.props.userReqtReducer.assetHistoryList.map((details, i) => {
                                                            if (i >= start_offset && start_count < per_page) {
                                                                start_count++;
                                                                return (<tr value={self.selected} key={i}>
                                                                    <td className={classNames({ 'empty-row': i >= originalLength })}>
                                                                        {details.timestamp}
                                                                    </td>
                                                                    <td className={classNames({ 'empty-row': i >= originalLength })}>
                                                                        {details.seller}</td>
                                                                    <td className={classNames({ 'empty-row': i >= originalLength })}>
                                                                        {details.buyer}</td>
                                                                    <td className={classNames({ 'empty-row': i >= originalLength })}>
                                                                        {details.amt}</td>
                                                                    {/*{
                                                                    (this.props.userReqtReducer.assetType !== 'Real Estate') &&
                                                                    <td >{details.qty}</td>
                                                                }*/}
                                                                </tr>
                                                                );
                                                            }
                                                        })

                                                    )
                                                    :
                                                    (
                                                        this.props.userReqtReducer.assetHistoryList.reverse().map((details, i) => {
                                                            if (start_count < buffer) {
                                                                start_count++;
                                                                return (
                                                                    (i === 2) ?
                                                                        (
                                                                            <tr key={i}>
                                                                                <td className='noTxMsg'
                                                                                    colSpan='4'>
                                                                                    <h1 className='no-margin'>
                                                                                        No transactions available
                                                                                    </h1>
                                                                                </td>
                                                                            </tr>

                                                                        )
                                                                        :
                                                                        (
                                                                            <tr key={i}>
                                                                                <td
                                                                                    colSpan='4'
                                                                                    className='empty-row' />
                                                                            </tr>
                                                                        )
                                                                );
                                                            }
                                                        })

                                                    )
                                            }

                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan='4'>
                                                    <Pagination className="assets-pagination pull-right" bsSize="medium" maxButtons={3} first last next prev boundaryLinks
                                                        items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                                                </td>
                                            </tr>

                                        </tfoot>
                                    </table>
                                    <div>

                                        <button className="btn btn-sm pull-right" onClick={() => this.props.router.goBack()}>Go back</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/*)

                    }*/}
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
    return bindActionCreators({ setTitle, URUpdateInputValue, URSetTrue, URSetFalse, URSetValue, URAlterBoolean }, dispatch);
}
AssetHistory.defaultProps = {
    timeFormat: ['Minutes', 'Hours', 'Days']
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AssetHistory));
import React from "react"
import { setTitle } from "../../actions/titleActions"
import { mhUpdateInputValue, mhSelectedAssetData, mhSetTrue, mhSetFalse, mhSetValue } from "../../actions/mhActions"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './MyHoldings.css'
import { Link, withRouter, browserHistory } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import { UserCon, AssetRegisterCon, REAssetsCon, web3, AssetTokenCon } from '../../constants'
import MHConfirmationModal from '../../components/MHConfirmationModal/MHConfirmationModal'
import { URSetValue } from '../../actions/userReqtActions';

let regeneratorRuntime = require("regenerator-runtime");
var walletAddress;
var assetHoldingData;

class MyHoldings extends React.Component {
    constructor(props) {
        super();
        props.setTitle("My Holdings");
    }

    onVisibilityChange(event, assetID) {
        this.props.mhSetValue({ id: 'mrktPlcVisibility', val: event.target.checked });
        this.props.mhSetValue({ id: 'chngeVisAstID', val: assetID });
        this.props.mhSetTrue("openConfirmationModal");
    }
    componentWillMount() {
        walletAddress = UserCon.getWalletByUserID(this.props.logModRed.clientID);
        var data = [];
        var REAssetData = REAssetsCon.getREAssetIdsByAddress(walletAddress);
        for (var i = 0; i < REAssetData.length; i++) {
             var DescAndName = REAssetsCon.getREAssetDet(REAssetData[i]);
            // var desc = REAssetsCon.getREAssetDescription(REAssetData[i]);
            var assetDetailsData = REAssetsCon.getREAssetDetailsForHoldings(REAssetData[i]);
            if (REAssetsCon.checkREAssetsForHolding(REAssetData[i], walletAddress)) {
                if (assetDetailsData[4].c[0] !== 0) {
                    debugger;
                    data.push({
                        securityID: web3.toAscii(REAssetData[i]),
                        assetSubType: web3.toAscii(assetDetailsData[0]),
                        assetAddress: web3.toAscii(assetDetailsData[1]),
                        securityName: web3.toAscii(DescAndName[0]),
                        lat: web3.toAscii(assetDetailsData[2]),
                        long: web3.toAscii(assetDetailsData[3]),
                        description: DescAndName[1],
                        acqPrice: assetDetailsData[4].c[0],
                        ofrPrice: assetDetailsData[5].c[0],
                        visibility: assetDetailsData[6]
                    })
                }
            }
        }
        this.props.mhSetValue({ id: 'myHoldingsList', val: data });

    }
    handleAssetClick(details) {
            let params = {
                securityID: details.securityID,
                securityType: details.assetSubType,
                securityName: details.securityName,
                address:details.assetAddress,
                latitude: details.lat,
                longitude: details.long,
                ofrPrice: details.ofrPrice,
                acqPrice: details.acqPrice,
                description: details.description
            }
        this.props.URSetValue({ id: "searchAstID", val: details.securityID });
        this.props.URSetValue({ id: "selectedAstDetails", val: params });             
        browserHistory.push('/AssetHistory');
    }
    myHoldings() {
        const per_page = 5;
        const pages = Math.ceil(this.props.mhReducer.myHoldingsList.length / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let categoryOptions = this.props.categories.map((category, i) => {
            return <option key={i} >{category}</option>
        });
        let self = this;
        return (
            <div className="row no-margin">
                <div className="row no-margin assetType-div-style">
                    <div className="col-md-4 no-padding"><strong>Asset List</strong></div>
                    <div className="col-md-3 col-md-offset-5">
                        <label id="asset-type-label" htmlFor="mh-asset-type">Asset Type:&nbsp;</label>
                        <select
                            ref="category"
                            id="mh-asset-type"
                            name="mhAssetType"
                            value={this.props.mhReducer.mhAssetType}
                            onChange={(event) => this.props.mhUpdateInputValue(event, true, walletAddress)}>
                            {categoryOptions}
                        </select>
                    </div>
                </div>

                <div className="row no-margin">
                    <div className="col-md-12 no-padding">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Asset Name</th>
                                    {
                                        (this.props.mhReducer.mhAssetType === 'Real Estate') ?
                                            (
                                                [
                                                    <th key={1}>Asset Sub-type</th>,
                                                    <th key={5}>Asset Description</th>,
                                                    <th key={2}>Address</th>,
                                                    //<th key={3}>Latitude</th>,
                                                    //<th key={4}>Longitude</th>
                                                ]
                                            )
                                            :
                                            (
                                                [
                                                    <th key={1}>Asset Type</th>,
                                                    <th key={2}>Sub Type</th>,
                                                    <th key={3}>Quantity</th>,
                                                ]
                                            )
                                    }
                                    <th>Acquisition Price</th>
                                    <th>Offer Price</th>
                                    <th>Marketplace Visibility</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.mhReducer.myHoldingsList.map((details, i) => {
                                        if (i >= start_offset && start_count < per_page) {
                                            start_count++;
                                            return (<tr key={i}>

                                                <td>
                                                    <span
                                                        id='assetId-link'
                                                        onClick={() => this.handleAssetClick(details)}>
                                                        {details.securityID}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span>{details.securityName}</span>
                                                </td>
                                                {
                                                    (this.props.mhReducer.mhAssetType === 'Real Estate') ?
                                                        (
                                                            [
                                                                <td key={1}>{details.assetSubType}</td>,
                                                                <td key={5}>{details.description}</td>,
                                                                <td key={2}>{details.assetAddress}</td>,
                                                                //<td key={3}>{details.lat}</td>,
                                                                //<td key={4}>{details.long}</td>
                                                            ]
                                                        )
                                                        :
                                                        (
                                                            [
                                                                <td key={1}>{details.assetType}</td>,
                                                                <td key={2}>{details.assetSubType}</td>,
                                                                <td key={3}>{details.assetQty}</td>
                                                            ]
                                                        )
                                                }

                                                <td >{details.acqPrice.toLocaleString()}</td>
                                                <td >{(details.ofrPrice === 0) ? ('Not Set') : (details.ofrPrice.toLocaleString())}</td>
                                                <td >
                                                    <input type="checkbox"
                                                        name="mrktPlcVisibility"
                                                        checked={details.visibility}
                                                        onChange={(event) => this.onVisibilityChange(event, details.securityID)} />
                                                </td>
                                            </tr>
                                            );
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                        
                    </div>
                </div>

                <div className='row no-margin paginationPane'>
                    <div className="col-md-6 no-padding">
                        <strong>Note:&nbsp;</strong>
                        <span>Please click on Asset ID to view asset's history </span>
                    </div>
                    <div className="col-md-6 no-padding">
                        <Pagination className="no-margin assets-pagination pull-right" bsSize="medium" 
                        maxButtons={5} first last next prev boundaryLinks
                        items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                    </div>
                    
                </div>
            </div>
        );
    }
    render() {
        console.log(this.props);
        return (
            <section className="myHoldings-section h100 w100">


                {
                    (this.props.mhReducer.openConfirmationModal) ?
                        (
                            <div>
                                <MHConfirmationModal
                                    logModRed={this.props.logModRed}
                                    mhSetFalse={this.props.mhSetFalse}
                                    mhSetTrue={this.props.mhSetTrue}
                                    walletAddress={walletAddress}
                                    mhReducer={this.props.mhReducer}
                                    mhSetValue={this.props.mhSetValue}
                                    mhUpdateInputValue={this.props.mhUpdateInputValue}
                                />
                                {this.myHoldings()}
                            </div>
                        )
                        :
                        (
                            <div>
                                {this.myHoldings()}
                            </div>
                        )

                }
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/MyHoldings?page=' + page);
    }

}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        mhReducer: state.mhReducer,
        logModRed: state.logModRed,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, mhUpdateInputValue, mhSelectedAssetData, mhSetTrue, mhSetFalse, mhSetValue, URSetValue }, dispatch);
}
MyHoldings.defaultProps = {
    categories: ['Other Assets', 'Real Estate']
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyHoldings));
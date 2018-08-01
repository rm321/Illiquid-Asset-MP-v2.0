import React from "react";
import { setTitle } from "../../actions/titleActions";
import { updateInputValue, selectedAssetData, setTrue, setFalse, setValue } from "../../actions/mpActions"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import './MarketPlace.css'
import { Link, withRouter, browserHistory } from 'react-router'
import { Pagination, Button } from 'react-bootstrap';
import { push } from 'react-router-redux';
import REAssetModal from '../../components/REAssetModal/REAssetModal'
import BidConfirm from '../../components/BidConfirm/BidConfirm'
import MarketPlaceAssetReqt from '../../components/MarketPlaceAssetReqt/MarketPlaceAssetReqt'
import SellersList from '../../components/SellersList/SellersList'
import { UserCon, AssetRegisterCon, REAssetsCon, web3, AssetTokenCon } from '../../constants'
import classNames from 'classnames'
import regdAssets from '../AdminPages/RegdAssets/regdAssets';
import { URSetValue } from '../../actions/userReqtActions';

var walletAddress;
var assetData;
class MarketPlace extends React.Component {
    constructor(props) {
        super();
        props.setTitle("Marketplace");
    }

    componentWillMount() {
        var data = [];
        walletAddress = UserCon.getWalletByUserID(this.props.logModRed.clientID);
        assetData = REAssetsCon.getAllREAssetIDsForMarketPlace();
        for (var i = 0; i < assetData[0].length; i++) {
            var id = web3.toAscii(assetData[0][i]);
            var assetDetails = REAssetsCon.getREAssetDetailsForMarketPlace(id);
            if (REAssetsCon.checkREAssetsForMarketPlace(assetData[0][i])) {
                data.push({
                    sellerID: web3.toAscii(UserCon.getUserIDByAddress(assetData[1][i])),
                    securityID: web3.toAscii(assetData[0][i]),
                    address: web3.toAscii(assetDetails[1]),
                    securityType: web3.toAscii(assetDetails[0]),
                    securityName: web3.toAscii(assetData[2][i]),
                    latitude: web3.toAscii(assetDetails[2]),
                    longitude: web3.toAscii(assetDetails[3]),
                    description: assetDetails[6],
                    acqPrice: assetDetails[4].c[0],
                    ofrPrice: assetDetails[5].c[0]
                });
            }

        }
        this.props.setValue({ id: 'mpAssetList', val: data });
    }
    handleAssetClick(details) {
        this.props.URSetValue({ id: "searchAstID", val: details.securityID });
        this.props.URSetValue({ id: "selectedAstDetails", val: details });
        browserHistory.push('/AssetHistory');
    }
    onAssetSelected(details) {
        if (this.props.MrktPlcRed.assetType !== 'Real Estate') {
            this.props.selectedAssetData(details);
        }
        else {
            this.props.setTrue('openREAssetModal');
            this.props.setValue({ id: 'selectedData', val: details })
        }
    }


    marketPlace() {
        const per_page = 5; //(this.props.MrktPlcRed.assetType === "Real Estate") ? (4) : (5)
        let assetCount = this.props.MrktPlcRed.mpAssetList.length;
        // let noAssets = false;
        const pages = Math.ceil(assetCount / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let categoryOptions = this.props.MrktPlcRed.filterList.map((category, i) => {
            return <option key={i} >{category}</option>
        });
        let self = this;
        return (
            <div className="row no-margin">
                
                <div className="row no-margin assetType-div-style">
                    <div className="col-md-4 no-padding"><strong>Asset List</strong></div>
                    <div className="col-md-3 col-md-offset-5">
                        <label id="asset-type-label" htmlFor="asset-type">Asset Type:&nbsp;</label>
                        <select
                            ref="category"
                            id="asset-type"
                            name="assetType"
                            value={this.props.MrktPlcRed.assetType}
                            onChange={(event) => this.props.updateInputValue(event, true)}>
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
                                    <th>Asset Sub-type</th>
                                    {
                                        (this.props.MrktPlcRed.assetType === "Real Estate") ?
                                            (
                                                [
                                                    // <th key={1}>Seller ID</th>,
                                                    // <th key={3}>Latitude</th>,
                                                    // <th key={4}>Longitude</th>,
                                                    <th key={5}>Asset Description</th>,
                                                    <th key={2}>Address</th>,
                                                    <th key={6}>Acquisition Price</th>,
                                                    <th key={7}>Offer Price</th>
                                                ]
                                            )
                                            :
                                            (
                                                [
                                                    <th key={1}>Company Name</th>,
                                                    <th key={2}>Offer Price</th>,
                                                    (
                                                        (this.props.MrktPlcRed.assetType === "Commodity") ||
                                                        (this.props.MrktPlcRed.assetType === "Alternative")
                                                    ) && <th key={3}>Asset Description</th>
                                                ]
                                            )
                                    }
                                    <th>Bid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.props.MrktPlcRed.mpAssetList.map((details, i) => {
                                        if (i >= start_offset && start_count < per_page) {
                                            start_count++;
                                            var isSameOwner = (details.sellerID.substring(0, 8) === this.props.logModRed.clientID);
                                            return (
                                                <tr
                                                    className={classNames({ 'sameOwner': isSameOwner })}
                                                    key={i}>
                                                    <td>
                                                        <span
                                                            id='assetId-link'
                                                            onClick={() => this.handleAssetClick(details)}>
                                                            {details.securityID}</span>
                                                    </td>
                                                    <td >{details.securityName}</td>
                                                    <td >{details.securityType}</td>

                                                    {
                                                        (this.props.MrktPlcRed.assetType === "Real Estate") ?
                                                            (
                                                                [
                                                                    //<td key={1}>{details.sellerID}</td>,
                                                                    //<td key={3}>{details.latitude}</td>,
                                                                    //<td key={4}>{details.longitude}</td>,
                                                                    <td key={5} >{details.description}</td>,
                                                                    <td key={2}>{details.address}</td>,
                                                                    <td key={6}>{details.acqPrice.toLocaleString()}</td>,
                                                                    <td key={7}>{details.ofrPrice.toLocaleString()}</td>

                                                                ]
                                                            )
                                                            :
                                                            (
                                                                [
                                                                    <td key={1}>{details.companyName}</td>,
                                                                    <td key={2}>{details.min}{"-"}{details.max}</td>,
                                                                    (
                                                                        (this.props.MrktPlcRed.assetType === "Commodity") ||
                                                                        (this.props.MrktPlcRed.assetType === "Alternative")
                                                                    ) && <td key={3}>{details.description}</td>
                                                                ]
                                                            )
                                                    }
                                                    <td>
                                                        <button
                                                            className='btn btn-md'
                                                            disabled={isSameOwner}
                                                            title={(isSameOwner) ? "You can't bid on your own asset" : "Click to bid on this asset"}
                                                            onClick={() =>
                                                                (!isSameOwner) && this.onAssetSelected(details)}>
                                                            <i className="fa fa-gavel" />
                                                            Bid</button>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                    })
                                    )

                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                            (this.props.MrktPlcRed.mpAssetList.length > 0) &&       
                            <div className="row no-margin paginationPane">
                                    <div className="col-md-6 no-padding">
                                        <label htmlFor="note-msg">Note:</label>
                                        <span id="note-msg"> Please click on Asset ID to view asset's history </span>
                                    </div>

                                    <div className="col-md-6 no-padding">
                                        {/*{
                                    (noAssets === true) ?
                                        (
                                            <div className="noAssetmsg"><h1> No Assets Available </h1></div>
                                        ) :
                                        (*/}
                                        <Pagination className="no-margin pull-right" bsSize="medium" maxButtons={10} first last next prev boundaryLinks
                                            items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                                        {/*)
                                }*/}
                                        {/*<a onClick={() => this.props.setTrue("openAssetReqt")}>Asset Not listed?</a>*/}
                                    </div>
                            </div>
                        }

            </div>
        );
    }
    render() {
        return (
            <section className="marketPlace-section h100 w100" >
                {
                    (this.props.MrktPlcRed.openAssetReqt) ?
                        (
                            <div className="row no-margin">
                                <MarketPlaceAssetReqt
                                    setTitle={this.props.setTitle}
                                    setValue={this.props.setValue}
                                    setFalse={this.props.setFalse}
                                    onInputChange={this.props.updateInputValue}
                                    MrktPlcRed={this.props.MrktPlcRed}
                                    clientID={this.props.logModRed.clientID}
                                />
                                {this.marketPlace()}
                            </div>
                        )
                        :
                        (
                            (this.props.MrktPlcRed.OpenModal) ?
                                (
                                    <div className="row no-margin">
                                        <SellersList
                                            updateInputValue={this.props.updateInputValue}
                                            setTitle={this.props.setTitle}
                                            setValue={this.props.setValue}
                                            setTrue={this.props.setTrue}
                                            setFalse={this.props.setFalse}
                                            MrktPlcRed={this.props.MrktPlcRed}
                                            clientID={this.props.logModRed.clientID}
                                        />
                                    </div>

                                )
                                :
                                (
                                    (this.props.MrktPlcRed.openREAssetModal) ?
                                        (
                                            <div className="row no-margin">
                                                <REAssetModal
                                                    updateInputValue={this.props.updateInputValue}
                                                    setValue={this.props.setValue}
                                                    setTrue={this.props.setTrue}
                                                    setFalse={this.props.setFalse}
                                                    MrktPlcRed={this.props.MrktPlcRed}
                                                    clientID={this.props.logModRed.clientID} />
                                                {this.marketPlace()}
                                            </div>
                                        )
                                        :
                                        (
                                            <div>
                                                {this.marketPlace()}
                                            </div>
                                        )
                                )

                        )
                }
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/MarketPlace?page=' + page);
    }

}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        MrktPlcRed: state.MrktPlcRed,
        logModRed: state.logModRed,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, updateInputValue, selectedAssetData, setTrue, setFalse, setValue, URSetValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MarketPlace));

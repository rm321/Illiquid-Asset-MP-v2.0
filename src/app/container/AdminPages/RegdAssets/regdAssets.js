import React from "react";
import './regdAssets.css'
import { Link } from 'react-router'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import { setTitle } from "../../../actions/titleActions"
import { updateInputValue, setValue } from "../../../actions/adminActions"
import classNames from 'classnames'
import hashFnv32a from '../../../hashFnv32a'
import { web3, AssetRegisterCon, REAssetsCon, AssetTypesCon, UserCon, AssetTokenCon } from "../../../constants"
import { NotificationContainer, NotificationManager } from 'react-notifications'

import { browserHistory } from 'react-router'
import {Breadcrumb} from 'react-bootstrap';
var userIds = [];
let regeneratorRuntime = require("regenerator-runtime");
class regdAssets extends React.Component {
    componentWillMount() {
        this.props.setTitle("Register New Asset");
        var userIdsInBytes = UserCon.getUserIDs();
        for (var i = 0; i < userIdsInBytes.length; i++) {
            userIds[i] = web3.toAscii(userIdsInBytes[i])
        }
        this.props.setValue({ id: 'AstRegdClientID', val: userIds[0] });
    }
    onClose() {
        this.props.setValue({ id: 'AstRegdName', val: '' });
        this.props.setValue({ id: 'AstRegdType', val: '--Select Type--' });
        this.props.setValue({ id: 'AstRegdSubType', val: '--Select Type--' });
        this.props.setValue({ id: 'AdmnCustomAssetType', val: '' });
        this.props.setValue({ id: 'AdmnRegdLatitude', val: '' });
        this.props.setValue({ id: 'AdmnRegdLongitude', val: '' });
        this.props.setValue({ id: 'AdmnRegdAddress', val: '' });
        this.props.setValue({ id: 'AdmnRegdCmpnyName', val: '' });
        this.props.setTitle("Admin Home");
    }
    registerAsset() {
        const red = this.props.AdminReducer;
        var AName = this.props.AdminReducer.AstRegdName;
        var timestamp = Date.now();
        var hVar = AName.concat(timestamp);
        var randomNum = hashFnv32a(hVar, false);
        var strUp = AName.toUpperCase();
        var res = strUp.substring(0, 4);
        var res1 = randomNum.toString().substring(0, 4);
        var assetid = res.concat(res1);
        this.getWalletAddress(assetid, timestamp, res1);

    }

    async getWalletAddress(assetid, timestamp, res1) {
        var walletAddress = UserCon.getWalletByUserID(this.props.AdminReducer.AstRegdClientID);
        if (this.props.AdminReducer.AstRegdType == "Real Estate") {
            assetid = "REAL".concat(res1);
            this.addRealAsset(assetid, timestamp, walletAddress);
        }
        else {
            this.addAssetToAssetRegister(assetid, timestamp, walletAddress);
        }
    }

    async addRealAsset(assetid, timestamp, walletAddress) {
        var co = await REAssetsCon.addNewREAssetByAdmin(this.props.AdminReducer.AstRegdName,
            this.props.AdminReducer.AstRegdSubType, this.props.AdminReducer.AdmnRegdAddress,
            this.props.AdminReducer.AdmnRegdLatitude, this.props.AdminReducer.AdmnRegdLongitude, assetid,
            this.props.AdminReducer.AdmnCustomAssetType, timestamp, this.props.AdminReducer.AstRegdClientAqPrc, walletAddress,
            { from: web3.eth.accounts[0], gas: 2000000 });
        debugger;
        this.addAssetType(assetid, timestamp);
    }


    async addAssetToAssetRegister(assetid, timestamp, walletAddress) {
        var Confirm = await AssetRegisterCon.addNewAsset(this.props.AdminReducer.AstRegdName,
            this.props.AdminReducer.AstRegdType, this.props.AdminReducer.AstRegdSubType,
            assetid, this.props.AdminReducer.AdmnRegdCmpnyName, this.props.AdminReducer.AdmnCustomAssetType || "--N.A--", timestamp,
            { from: web3.eth.accounts[0], gas: 2000000 });
        this.addAssetToken(assetid, timestamp, walletAddress);
    }

    async addAssetToken(assetid, timestamp, walletAddress) {
        var c = await AssetTokenCon.setAssetToken(walletAddress, assetid, this.props.AdminReducer.AdmnRegdQty, this.props.AdminReducer.AstRegdClientAqPrc, 0,
            { from: web3.eth.accounts[0], gas: 2000000 });
        this.addAssetType(assetid, timestamp);
    }

    async addAssetType(assetid, timestamp) {
        var success = await AssetTypesCon.addNewAssetSubType(this.props.AdminReducer.AstRegdType,
            this.props.AdminReducer.AstRegdSubType, timestamp, assetid,
            { from: web3.eth.accounts[0], gas: 2000000 })

        if (success) {
            NotificationManager.success("Asset Registered Successfully", "Success!", 2000);
            setTimeout(() => {
                this.onClose();
                browserHistory.push('AdminHome');
            }, 2420);
        }
    }
    render() {
        var AdmncustomAssetType = classNames({ 'custom-div': this.props.AdminReducer.AstRegdSubType !== 'Custom/User-Defined' })
        let assetTypes = this.props.AdminReducer.assetTypeList.map((assets, i) => {
            return <option key={i}>{assets}</option>
        });
        let subAssetTypes = this.props.AdminReducer.subTypesList[this.props.AdminReducer.AstRegdType].subTypes.map((subAssets, i) => {
            return <option key={i}>{subAssets}</option>
        });
        let usersList = userIds.map((userID, index) => {
            return <option key={index}>{userID}</option>
        });
        return (
            <section className="regdAssets-section h100 w100">
                <div className="col-md-6 col-md-offset-3 regdAssets-box-style">
                    <div className="row no-margin">
                        <div><strong id="asset-heading">Please enter the Details</strong></div>
                        <br />
                        <div>
                            <label className="lbldiv" htmlFor="Admn-ast-regd-name">Asset Name</label>
                            <b>:</b>
                            <input className="input-div"
                                name="AstRegdName"
                                id="Admn-ast-regd-Name"
                                onChange={(event) => this.props.updateInputValue(event)}
                            />
                            <br />
                            <label className="lbldiv" htmlFor="Admn-ast-regd-ClientID">Client ID</label>
                            <b>:</b>
                            <select
                                id="Admn-ast-regd-ClientID"
                                name="AstRegdClientID"
                                value={this.props.AdminReducer.AstRegdClientID}
                                onChange={(event) => this.props.updateInputValue(event)}>{usersList}</select>
                            <br />
                            <label className="lbldiv" htmlFor="Admn-ast-regd-AqPrc">Client Aquisition Price</label>
                            <b>:</b>
                            <input className="input-div"
                                name="AstRegdClientAqPrc"
                                id="Admn-ast-regd-AqPrc"
                                onChange={(event) => this.props.updateInputValue(event)}
                            />
                            <br />
                            <label className="lbldiv" htmlFor="Admn-regd-ast-type">Asset type</label>
                            <b>:</b>
                            <select
                                id="Admn-regd-ast-type"
                                name="AstRegdType"
                                value={this.props.AdminReducer.AstRegdType}
                                onChange={(event) => this.props.updateInputValue(event)}>{assetTypes}</select>

                            <br />
                            <label className="lbldiv" htmlFor="Admn-regd-ast-subType">Sub-type</label>
                            <b>:</b>
                            <select
                                id="Admn-regd-ast-subType"
                                name="AstRegdSubType"
                                value={this.props.AdminReducer.AstRegdSubType}
                                onChange={(event) => this.props.updateInputValue(event)}>{subAssetTypes}</select>

                            <br />
                            <div className={AdmncustomAssetType}>
                                <label className="lbldiv" htmlFor="custom-asset-type">Asset Description</label>
                                <b>:</b>
                                <input className="input-div"
                                    id="Admn-custom-asset-type"
                                    name="AdmnCustomAssetType"
                                    onChange={(event) => this.props.updateInputValue(event)}>
                                </input>
                            </div>
                            {
                                (this.props.AdminReducer.AstRegdType === 'Real Estate') ?
                                    (
                                        <div>
                                            <label className="lbldiv" htmlFor="custom-asset-type">Asset Description</label>
                                            <b>:</b>
                                            <input className="input-div"
                                                id="Admn-custom-asset-type"
                                                name="AdmnCustomAssetType"
                                                onChange={(event) => this.props.updateInputValue(event)}>
                                            </input>
                                            <br />
                                            <label className="lbldiv" htmlFor="Admn-latitude">Latitude</label>
                                            <b>:</b>
                                            <input
                                                className="input-div"
                                                id="Admn-latitude"
                                                name="AdmnRegdLatitude"
                                                onChange={(event) => this.props.updateInputValue(event)} />
                                            <br />
                                            <label className="lbldiv" htmlFor="Admn-longitude">Longitude</label>
                                            <b>:</b>
                                            <input
                                                className="input-div"
                                                id="Admn-longitude"
                                                name="AdmnRegdLongitude"
                                                onChange={(event) => this.props.updateInputValue(event)} />
                                            <br />
                                            <label className="lbldiv" htmlFor="Admn-address">Address</label>
                                            <b>:</b>
                                            <input
                                                className="input-div"
                                                id="Admn-address"
                                                name="AdmnRegdAddress"
                                                onChange={(event) => this.props.updateInputValue(event)} />
                                        </div>
                                    )
                                    :
                                    (
                                        <div>
                                            <label className="lbldiv" htmlFor="Admn-ast-regd-cmpnyName">Company Name</label>
                                            <b>:</b>
                                            <input className="input-div"
                                                id="Admn-ast-regd-cmpnyName"
                                                name="AdmnRegdCmpnyName"
                                                onChange={(event) => this.props.updateInputValue(event)}
                                            />
                                            <br />
                                            <label className="lbldiv" htmlFor="Admn-ast-regd-qty">Quantity</label>
                                            <b>:</b>
                                            <input className="input-div"
                                                type="number"
                                                min="1"
                                                id="Admn-ast-regd-qty"
                                                name="AdmnRegdQty"
                                                onChange={(event) => this.props.updateInputValue(event)}
                                            />
                                            <br />
                                        </div>
                                    )
                            }


                        </div>
                        <br />
                        <button
                            disabled={
                                (this.props.AdminReducer.AstRegdType === 'Real Estate') &&
                                (!(this.props.AdminReducer.AdmnRegdLongitude &&
                                    this.props.AdminReducer.AdmnRegdLatitude &&
                                    this.props.AdminReducer.AdmnCustomAssetType &&
                                    this.props.AdminReducer.AstRegdSubType !== '--Select Type--' &&
                                    this.props.AdminReducer.AdmnRegdAddress &&
                                    this.props.AdminReducer.AstRegdClientAqPrc &&
                                    this.props.AdminReducer.AstRegdName
                                ))}
                            className="btn btn-primary col-md-offset-5"
                            onClick={() => this.registerAsset()}>Submit</button>
                        {/*<Link to="AdminHome">
                            <button className="btn col-md-offset-2"
                                onClick={() => this.onClose()}>Close</button>
                        </Link>*/}
                    </div>
                </div>
                <NotificationContainer />
            </section>
        )
    }

};


const mapStateToProps = (state) => {
    return {
        title: state.title,
        AdminReducer: state.AdminReducer
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, updateInputValue, setValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(regdAssets);
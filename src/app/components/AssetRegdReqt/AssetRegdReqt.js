import React from "react";
import './AssetRegdReqt.css'
import classNames from 'classnames'
import { REAssetsCon, UserCon, AssetRequestCon, web3 } from '../../constants'
import hashFnv32a from '../../hashFnv32a'
import { NotificationContainer, NotificationManager } from 'react-notifications'


let regeneratorRuntime = require("regenerator-runtime");
var walletAddress;
export default class AssetRegdReqt extends React.Component {
    componentWillMount() {
        walletAddress = UserCon.getWalletByUserID(this.props.clientID)
    }

    closeReqtPage() {
        this.props.setValue({ id: 'asstRegdReqtSecName', val: '' });
        this.props.setValue({ id: 'regdAssetType', val: '--Select Type--' });
        this.props.setValue({ id: 'regdAssetSubType', val: '--Select Type--' });
        this.props.setValue({ id: 'customAssetType', val: '' });
        this.props.setValue({ id: 'asstRegdReqtCmpName', val: '' });
        this.props.setValue({ id: 'latitude', val: '' });
        this.props.setValue({ id: 'longitude', val: '' });
        this.props.setValue({ id: 'regdAddress', val: '' });
        this.props.setFalse("openAssetReqt");
    }

    onAssetRequestSubmit() {
        var req = "REQT";
        var timestamp = Date.now();
        var randomNum = hashFnv32a(timestamp, false);
        var res1 = randomNum.toString().substring(0, 4);
        var requestid = req.concat(res1);

        if (this.props.SecMasRed.regdAssetType == "Real Estate") {
            requestid = "REAL".concat(hashFnv32a(timestamp, false));
            this.addREAssetRequest(requestid, timestamp);
        }
        else {
            this.addAssetToAssetRegister(requestid);
        }
    }

    async addREAssetRequest(requestid, timestamp) {
        var Confirm = await REAssetsCon.addNewREAssetRequest(walletAddress, this.props.SecMasRed.regdAssetSubType,
            this.props.SecMasRed.asstRegdReqtSecName, this.props.SecMasRed.regdAddress,
            this.props.SecMasRed.regdLatitude, this.props.SecMasRed.regdLongitude, requestid,
            this.props.SecMasRed.customAssetType, timestamp,
            { from: web3.eth.accounts[0], gas: 2000000 });

        if (confirm) {
            NotificationManager.success("Request Submitted Successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.setFalse("openAssetReqt")
            }, 2420);
        }
    }


    async addAssetToAssetRegister(requestid) {
        var Confirm = await AssetRequestCon.addNewAssetRequest(this.props.SecMasRed.regdAssetSubType, requestid,
            this.props.SecMasRed.asstRegdReqtSecName, this.props.SecMasRed.asstRegdReqtCmpName, walletAddress,
            this.props.SecMasRed.regdAssetType, this.props.SecMasRed.customAssetType || "--N.A--",
            { from: web3.eth.accounts[0], gas: 2000000 });

        if (confirm) {
            NotificationManager.success("Request Submitted Successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.setFalse("openAssetReqt")
            }, 2420);
        }

    }


    render() {
        var customAssetType = classNames({ 'custom-div': this.props.SecMasRed.regdAssetSubType !== 'Custom/User-Defined' })
        let AssetTypes = this.props.SecMasRed.assetTypeList.map((Types, i) => {
            return <option key={i} >{Types}</option>
        });
        let AssetSubTypes = this.props.SecMasRed.subTypesList[this.props.SecMasRed.regdAssetType].subTypes.map((subAssets, i) => {
            return <option key={i} >{subAssets}</option>
        });
        return (
            <section className="assetRegdReqt-section h100 w100">
                <div className="modal fade" id="assetRegdReqtModal">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Asset Registration Request</h4>
                            </div>
                            <div className="modal-body">
                                <div autoComplete="off">
                                    <div>
                                        <label className="lbldiv">Asset Name:</label>
                                        <input
                                            id="Asst-Regd-Reqt-SecName"
                                            name="asstRegdReqtSecName"
                                            onChange={(event) => this.props.onInputChange(event)} />
                                        <br />

                                        <label className="lbldiv" htmlFor="regd-asset-type">Asset Type :</label>
                                        <select className="lblselect"
                                            id="regd-asset-type"
                                            name="regdAssetType"
                                            value={this.props.SecMasRed.regdAssetType}
                                            onChange={(event) => this.props.onInputChange(event)}>
                                            {AssetTypes}
                                        </select>
                                        <br />

                                        <label className="lbldiv" htmlFor="regd-asset-subType">Sub-type :</label>
                                        <select className="lblselect"
                                            id="regd-asset-subType"
                                            name="regdAssetSubType"
                                            value={this.props.SecMasRed.regdAssetSubType}
                                            onChange={(event) => this.props.onInputChange(event)}>
                                            {AssetSubTypes}
                                        </select>
                                        <br />

                                        <div className={customAssetType}>
                                            <label className="lbldiv" htmlFor="custom-asset-type">Asset Description:</label>
                                            <input
                                                id="custom-asset-type"
                                                name="customAssetType"
                                                onChange={(event) => this.props.onInputChange(event)} />
                                        </div>
                                        {
                                            (this.props.SecMasRed.regdAssetType === 'Real Estate') ?
                                                (
                                                    <div>
                                                        <label className="lbldiv" htmlFor="custom-asset-type">Asset Description:</label>
                                                        <input
                                                            id="custom-asset-type"
                                                            name="customAssetType"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                        <br />
                                                        <label className="lbldiv" htmlFor="latitude">Latitude:</label>
                                                        <input
                                                            id="latitude"
                                                            name="regdLatitude"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                        <br />
                                                        <label className="lbldiv" htmlFor="longitude">Longitude:</label>
                                                        <input
                                                            id="longitude"
                                                            name="regdLongitude"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                        <br />
                                                        <label className="lbldiv" htmlFor="address">Address:</label>
                                                        <input
                                                            id="address"
                                                            name="regdAddress"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div>
                                                        <label className="lbldiv">Company Name:</label>
                                                        <input
                                                            id="Asst-Regd-Reqt-CmpName"
                                                            name="asstRegdReqtCmpName"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                    </div>
                                                )
                                        }



                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={() => this.onAssetRequestSubmit()}
                                    className="btn btn-primary modal-btn">Submit Request</button>
                                <button onClick={() => this.closeReqtPage()} className="btn modal-btn">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section >
        )
    };
}


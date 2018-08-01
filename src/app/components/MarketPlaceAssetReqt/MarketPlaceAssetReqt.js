import React from "react";
import './MarketPlaceAssetReqt.css'
import classNames from 'classnames'
import { NotificationContainer, NotificationManager } from 'react-notifications'


export default class MarketPlaceAssetReqt extends React.Component {
    closeReqtPage() {
        this.props.setValue({id:'mpAsstRegdReqtSecName',val:''});
        this.props.setValue({id:'mpRegdAssetType',val:'--Select Type--'});
        this.props.setValue({id:'mpRegdAssetSubType',val:'--Select Type--'});
        this.props.setValue({id:'mpCustomAssetType',val:''});
        this.props.setValue({id:'mpRegdLatitude',val:''});
        this.props.setValue({id:'mpRegdLongitude',val:''});
        this.props.setValue({id:'mpRegdAddress',val:''});
        this.props.setValue({id:'mpAsstRegdReqtCmpName',val:''});
        this.props.setValue({id:'mpAsstRegdReqtSecName',val:''});
        this.props.setFalse("openAssetReqt");
    }
    onSubmitReqt() {
        NotificationManager.success("Request submitted successfully to Admin","Success",2000);
        setTimeout(() => {
            this.closeReqtPage();
        }, 2100);
    }
    render() {
        var customAssetType = classNames({ 'custom-div': this.props.MrktPlcRed.mpRegdAssetSubType !== 'Custom/User-Defined' })
        let AssetTypes = this.props.MrktPlcRed.assetTypeList.map((Types, i) => {
            return <option key={i} >{Types}</option>
        });
        let AssetSubTypes = this.props.MrktPlcRed.subTypesList[this.props.MrktPlcRed.mpRegdAssetType].subTypes.map((subAssets, i) => {
            return <option key={i} >{subAssets}</option>
        });
        return (
            <section className="marketPlaceAssetReqt-section h100 w100">
                <div className="modal fade" id="marketPlaceAssetReqtModal">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Asset Registration Request</h4>
                            </div>
                            <div className="modal-body">
                                <div autoComplete="off">
                                    <div>
                                        <label className="lblmrktplc" htmlFor="mp-Asst-Regd-Reqt-SecName">Asset Name:</label>
                                        <input
                                            id="mp-Asst-Regd-Reqt-SecName"
                                            name="mpAsstRegdReqtSecName"
                                            onChange={(event) => this.props.onInputChange(event)} />
                                        <br />

                                        <label className="lblmrktplc" htmlFor="mp-regd-asset-type">Asset Type :</label>
                                        <select className="lblselect"
                                            id="mp-regd-asset-type"
                                            name="mpRegdAssetType"
                                            value={this.props.MrktPlcRed.regdAssetType}
                                            onChange={(event) => this.props.onInputChange(event)}>
                                            {AssetTypes}
                                        </select>
                                        <br />

                                        <label className="lblmrktplc" htmlFor="mp-regd-asset-subType">Sub-type :</label>
                                        <select className="lblselect"
                                            id="mp-regd-asset-subType"
                                            name="mpRegdAssetSubType"
                                            value={this.props.MrktPlcRed.regdAssetSubType}
                                            onChange={(event) => this.props.onInputChange(event)}>
                                            {AssetSubTypes}
                                        </select>
                                        <br />

                                        <div className={customAssetType}>
                                            <label className="lblmrktplc" htmlFor="mp-custom-asset-type">Asset Description:</label>
                                            <input
                                                id="mp-custom-asset-type"
                                                name="mpCustomAssetType"
                                                onChange={(event) => this.props.onInputChange(event)} />
                                        </div>
                                        {
                                            (this.props.MrktPlcRed.mpRegdAssetType === 'Real Estate') ?
                                                (
                                                    <div>
                                                        <label className="lblmrktplc" htmlFor="mp-latitude">Latitude:</label>
                                                        <input
                                                            id="mp-latitude"
                                                            name="mpRegdLatitude"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                        <br />
                                                        <label className="lblmrktplc" htmlFor="mp-longitude">Longitude:</label>
                                                        <input
                                                            id="mp-longitude"
                                                            name="mpRegdLongitude"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                        <br />
                                                        <label className="lblmrktplc" htmlFor="mp-address">Address:</label>
                                                        <input
                                                            id="mp-address"
                                                            name="mpRegdAddress"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div>
                                                        <label className="lblmrktplc" htmlFor="mp-Asst-Regd-Reqt-CmpName">Company Name:</label>
                                                        <input
                                                            id="mp-Asst-Regd-Reqt-CmpName"
                                                            name="mpAsstRegdReqtCmpName"
                                                            onChange={(event) => this.props.onInputChange(event)} />
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => this.onSubmitReqt()} className="btn btn-primary modal-btn">Submit Request</button>
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
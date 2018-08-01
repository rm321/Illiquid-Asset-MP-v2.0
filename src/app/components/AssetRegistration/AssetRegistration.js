import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './AssetRegistration.css'
import { REAssetsCon, UserCon, AssetTokenCon, web3 } from '../../constants'
import { NotificationContainer, NotificationManager } from 'react-notifications'


let regeneratorRuntime = require("regenerator-runtime");
var walletAddress;
export default class AssetRegistration extends React.Component {
    componentWillMount() {
        walletAddress = UserCon.getWalletByUserID(this.props.clientID);
    }

    onAssetRegdSubmit() {
        var timestamp = Date.now();
        if (this.props.SecMasRed.assetType === "Real Estate") {
            this.registerREAsset(walletAddress, timestamp);
        }
        else {
            this.registerOtherAssets(walletAddress, timestamp);
        }
    }

    async registerREAsset(walletAddress, timestamp) {
        var confirm = await REAssetsCon.addNewREAssetByBuyer(walletAddress, this.props.SecMasRed.regdAqPrice,
            this.props.SecMasRed.regdOfrPrice, this.props.SecMasRed.selectedData.id, timestamp, { from: web3.eth.accounts[0], gas: 2000000 });
        if (confirm) {
            NotificationManager.success("Asset Registered Successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.closeRegdPage
            }, 2420);
        }
    }

    async registerOtherAssets(walletAddress, timestamp) {
        var confirm = await AssetTokenCon.setAssetToken(walletAddress, this.props.SecMasRed.selectedData.id,
            this.props.SecMasRed.regdQty, this.props.SecMasRed.regdAqPrice, this.props.SecMasRed.regdOfrPrice, timestamp,
            { from: web3.eth.accounts[0], gas: 2000000 });
        if (confirm) {
            NotificationManager.success("Asset Registered Successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.closeRegdPage
            }, 2420);
        }
    }

    render() {
        return (
            <section className="assetRegistration-section h100 w100">
                <div className="modal fade" id="assetRegistration">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content ">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Asset Registration Details</h4>
                            </div>
                            <div className="modal-body">
                                <label className="lbldiv" >Asset ID:</label>
                                {this.props.SecMasRed.selectedData.id}
                                <br />
                                <label className="lbldiv">Sub Type:</label>
                                {this.props.SecMasRed.selectedData.subType}
                                <br />
                                <div>
                                    {
                                        this.props.SecMasRed.assetType !== 'Real Estate' &&
                                        <div>
                                            <label className="lbldiv">Company Name: </label>
                                            {this.props.SecMasRed.selectedData.cmpnyName}
                                            <br />

                                            <label className="lbldiv" id="qntylbl">Quantity: </label>
                                            <input
                                                type="number"
                                                id="regd-Qty"
                                                name="regdQty"
                                                onChange={(event) => this.props.onInputChange(event)}
                                            />
                                        </div>
                                    }

                                    <label className="lbldiv">Acquisition Price: </label>
                                    <input
                                        type="number"
                                        id="regd-Aq-Price"
                                        name="regdAqPrice"
                                        onChange={(event) => this.props.onInputChange(event)}
                                    />
                                    <br />

                                    <label className="lbldiv">Offer Price: </label>
                                    <input type="number"
                                        id="regd-Ofr-Price"
                                        name="regdOfrPrice"
                                        onChange={(event) => this.props.onInputChange(event)}
                                    />

                                    <br />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    disabled={
                                        (!(this.props.SecMasRed.regdAqPrice && this.props.SecMasRed.regdOfrPrice))
                                    }
                                    onClick={() => this.onAssetRegdSubmit()}
                                    className="btn btn-primary">Submit</button>
                                <button onClick={this.props.closeRegdPage} className="btn">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section >
        )
    }

};

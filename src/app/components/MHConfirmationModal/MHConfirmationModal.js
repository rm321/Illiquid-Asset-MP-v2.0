import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './MHConfirmationModal.css'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { AssetTokenCon, web3, REAssetsCon, BidRequestsCon, UserCon } from '../../constants'
import { browserHistory } from 'react-router'

var walletAddress;
let regeneratorRuntime = require("regenerator-runtime");
export default class MHConfirmationModal extends React.Component {
    componentWillMount() {
        walletAddress = UserCon.getWalletByUserID(this.props.logModRed.clientID);
    }
    changeVisibility() {
        var confirm;
        if (this.props.mhReducer.mrktPlcVisibility) {
            confirm = this.confirmVisibility();
            this.setOfferPrice();
            if (confirm) {
                NotificationManager.success("Asset enabled successfully in MarketPlace", "Success", 2000);
                setTimeout(() => {
                    this.props.mhSetFalse("openGetOfrPrcModal");
                    this.props.mhSetFalse("openConfirmationModal");
                    browserHistory.push('/MarketPlace');
                }, 2420);
            }
        }
        else {
            confirm = this.confirmVisibility();
            this.setOfferPrice();
            this.rejectBids();
            if (confirm) {
                NotificationManager.success("Asset disabled successfully from MarketPlace", "Success", 2000);
                setTimeout(() => {
                    this.props.mhSetFalse("openConfirmationModal");
                    browserHistory.push('/MarketPlace');
                }, 2420);
            }
        }
    }

    async resetLatestBids(){
        await BidRequestsCon.resetLatestBid(this.props.mhReducer.chngeVisAstID,{from: web3.eth.accounts[0]});
    }

    async rejectBids() {
        await BidRequestsCon.rejectBidsAtAssetVisibilityDisable(this.props.mhReducer.chngeVisAstID, this.props.logModRed.clientID, { from: web3.eth.accounts[0], gas: 2000000 });
        this.resetLatestBids();
    }

    async confirmVisibility() {
        return await REAssetsCon.setREAssetMPVisibility(this.props.mhReducer.chngeVisAstID, this.props.mhReducer.mrktPlcVisibility, { from: web3.eth.accounts[0], gas: 2000000 });
    }

    async setOfferPrice() {
        await REAssetsCon.updateOfferPrice(this.props.mhReducer.chngeVisAstID, this.props.mhReducer.newOfrPrc, { from: web3.eth.accounts[0], gas: 2000000 });
    }
        componentWillUnmount() {
        this.props.mhSetValue({ id: 'newOfrPrc', val: '' })
    }

    render() {
        return (
            <section className="MHConfirmationModal-section h100 w100">
                <div className="modal fade" id="MHConfirmationModal">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content ">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Confirmation</h4>
                            </div>
                            <div className="modal-body col-md-offset-2">
                                {
                                    (this.props.mhReducer.openGetOfrPrcModal && this.props.mhReducer.mrktPlcVisibility) ?
                                        (
                                            <div>
                                                <label htmlFor="new-Ofr-Prc">Offer Price:</label>
                                                <input
                                                    type="number"
                                                    id="new-Ofr-Prc"
                                                    name="newOfrPrc"
                                                    onChange={(event) => this.props.mhUpdateInputValue(event)}
                                                    value={this.props.mhReducer.newOfrPrc}
                                                />
                                            </div>
                                        )
                                        :
                                        (
                                            (this.props.mhReducer.mrktPlcVisibility) ?
                                                (
                                                    <h4>Are you sure to Make the asset available in Market Place ?</h4>
                                                )
                                                :
                                                (
                                                    <div>
                                                        <h4>Are you sure to revert asset from Market Place ?</h4>
                                                        <br />
                                                        <span>Note: - All bids on this asset will be rejected</span>
                                                    </div>
                                                )
                                        )
                                }

                            </div>
                            <div className="modal-footer">
                                {
                                    (this.props.mhReducer.openGetOfrPrcModal && this.props.mhReducer.mrktPlcVisibility) ?
                                        (
                                            <div>
                                                <button
                                                    onClick={
                                                        () => this.changeVisibility()
                                                    }
                                                    disabled={!(this.props.mhReducer.newOfrPrc)}
                                                    className="btn btn-primary modal-btn">Submit</button>
                                                <button
                                                    onClick={
                                                        () =>
                                                            [
                                                                this.props.mhSetFalse("openGetOfrPrcModal"),
                                                                this.props.mhSetFalse("openConfirmationModal"),
                                                                this.props.mhSetValue({ id: 'newOfrPrc', val: '' })
                                                            ]
                                                    }
                                                    className="btn modal-btn">Cancel</button>
                                            </div>
                                        )
                                        :
                                        (
                                            <div>
                                                <button
                                                    onClick={
                                                        () => {
                                                            (this.props.mhReducer.mrktPlcVisibility) ?
                                                                (
                                                                    this.props.mhSetTrue('openGetOfrPrcModal')
                                                                )
                                                                :
                                                                (
                                                                    this.changeVisibility()
                                                                )
                                                        }

                                                    }
                                                    className="btn btn-primary modal-btn">Yes</button>
                                                <button
                                                    onClick={() => this.props.mhSetFalse("openConfirmationModal")}
                                                    className="btn modal-btn">No</button>
                                            </div>
                                        )
                                }



                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section >
        )
    }

};

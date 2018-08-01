import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './REAssetModal.css'
import { BidRequestsCon, web3, UserCon, CTokenCon } from '../../constants'
import hashFnv32a from '../../hashFnv32a'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { browserHistory } from 'react-router'

let regeneratorRuntime = require("regenerator-runtime");
var buyerAddr;
var lastBid;
export default class REAssetModal extends React.Component {

    componentWillMount() {
        buyerAddr = UserCon.getWalletByUserID(this.props.clientID);
        lastBid = BidRequestsCon.getLatestBid(this.props.MrktPlcRed.selectedData.securityID);
    }

    submitBid() {
        if (this.props.MrktPlcRed.selectedData.ofrPrice < this.props.MrktPlcRed.REbidPrice) {
            this.checkCTBalance(buyerAddr);
        }
        else {
            alert("Place higher bid than offer price")
        }
    }

    async checkCTBalance(buyerAddr) {
        const status = CTokenCon.checkCTBalance(buyerAddr, this.props.MrktPlcRed.REbidPrice);
        if (status) {
            this.checkLatestBid(buyerAddr);
        }
        else {
            alert("Not enough balance");
        }
    }

    async checkLatestBid(buyerAddr) {
        var latestBid = BidRequestsCon.getLatestBid(this.props.MrktPlcRed.selectedData.securityID);
        if (latestBid < this.props.MrktPlcRed.REbidPrice) {
            this.addBid(buyerAddr);
        }
        else {
            alert("Submit higher bid");
        }
    }

    async addBid(buyerAddr) {
        var h1 = (this.props.MrktPlcRed.selectedData.securityID).concat(this.props.clientID);
        var h2 = h1.concat(Date.now());
        var h3 = hashFnv32a(h2, false);
        var h4 = h3.toString().substring(0, 5);
        var bidId = "BID".concat(h4);
        var ts = Date.now();
        var confirm = BidRequestsCon.addNewBid(this.props.MrktPlcRed.selectedData.securityID,
            this.props.MrktPlcRed.selectedData.sellerID,
            this.props.clientID,
            this.props.MrktPlcRed.REbidPrice,
            1,
            bidId, ts, { from: web3.eth.accounts[0], gas: 2000000 }
        );
        if (confirm) {
            NotificationManager.success("Bid Request submitted Successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.setFalse('openREAssetModal');
            }, 2420);
        }
    }


    onClickClose() {
        this.props.setFalse('openREAssetModal');
    }
    render() {
        return (
            <section className="REAssetModal-section h100 w100">
                <div className="modal fade" id="REMarketPlaceAsset">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content ">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Purchase Asset</h4>
                            </div>
                            <div className="modal-body col-md-offset-3">
                                <label htmlFor="RE-bid-price">Bid Price:</label>
                                <input
                                    type="number"
                                    id="RE-bid-price"
                                    name="REbidPrice"
                                    onChange={(event) => this.props.updateInputValue(event)} />
                                <br />
                                <label htmlFor="last-bid-price">Last Submitted Bid: </label>
                                <span
                                    placeholder="(per unit)"
                                    type="number"
                                    id="last-bid-price"
                                    name="lastBidPrice"
                                >{(lastBid.c[0] === 0) ? ('No bids available') : (lastBid.c[0])}</span>
                            </div>
                            <div className="modal-footer">
                                <button
                                    disabled={
                                        (!(this.props.MrktPlcRed.REbidPrice))
                                    }
                                    onClick={() => this.submitBid()}
                                    className="btn btn-primary">Submit</button>
                                <button onClick={() => this.onClickClose()} className="btn">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section >
        )
    }

};

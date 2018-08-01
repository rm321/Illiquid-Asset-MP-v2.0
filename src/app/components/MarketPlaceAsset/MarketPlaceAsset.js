import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './MarketPlaceAsset.css'
import { BidRequestsCon, CTokenCon, web3, UserCon } from '../../constants'
import hashFnv32a from '../../hashFnv32a'
import { NotificationContainer, NotificationManager } from 'react-notifications'
let regeneratorRuntime = require("regenerator-runtime");

var buyerAddr;

//need to get asset offer price from reducer and uncomment conditions in submit bid
export default class MarketPlaceAsset extends React.Component {
    onClickClose() {
        this.props.setFalse('openMrktModal');
        this.props.setTrue('OpenModal');
        this.props.setValue({ id: 'purchaseQuantity', val: 0 });
        this.props.setValue({ id: 'bidPrice', val: 0 });
    }
    componentWillMount() {
        buyerAddr = UserCon.getWalletByUserID(this.props.clientID);
    }
    submitBid() {
        if (this.props.MrktPlcRed.selectedData.ofrPrice < this.props.MrktPlcRed.bidPrice){
        this.checkCTBalance(buyerAddr);
        }
        else{
            alert("Place higher bid than offer price")
        }
    }

    async checkCTBalance(buyerAddr) {
        const status = CTokenCon.checkCTBalance(buyerAddr, this.props.MrktPlcRed.bidPrice);
        if (status) {
            this.checkLatestBid(buyerAddr);
        }
        else {
            alert("Not enough balance");
        }
    }

    async checkLatestBid(buyerAddr) {
        var latestBid = BidRequestsCon.getLatestBid(this.props.MrktPlcRed.selectedData.securityID);
        if (latestBid < this.props.MrktPlcRed.bidPrice) {
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
            this.props.MrktPlcRed.selectedSeller.sellerID,
            this.props.clientID,
            this.props.MrktPlcRed.bidPrice,
            this.props.MrktPlcRed.purchaseQuantity,
            bidId, buyerAddr, ts, { from: web3.eth.accounts[0], gas: 2000000 }
        );
        if (confirm) {
            NotificationManager.success("Bid Request submitted Successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.setFalse('openMrktModal');
                this.props.setTrue('OpenModal');
            }, 2420);
        }
    }

    render() {
        return (
            <section className="MarketPlaceAsset-section h100 w100">
                <div className="modal fade" id="MarketPlaceAsset">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content ">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Purchase Asset</h4>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="purchase-qty">Quantity:</label><input
                                    type="number"
                                    id="purchase-qty"
                                    name="purchaseQuantity"
                                    onChange={(event) => this.props.updateInputValue(event)}
                                />
                                <label htmlFor="bid-price">Bid Price:</label><input
                                    placeholder="(per unit)"
                                    type="number"
                                    id="bid-price"
                                    name="bidPrice"
                                    onChange={(event) => this.props.updateInputValue(event)}
                                />
                                <br /><br />
                                <label className="col-md-offset-4" htmlFor="Total-price">Total Price:</label><span
                                    id="Total-price"
                                    type="number"
                                >{this.props.MrktPlcRed.bidPrice * this.props.MrktPlcRed.purchaseQuantity}</span>
                            </div>
                            <div className="modal-footer">
                                <button
                                    disabled={
                                        (!(this.props.MrktPlcRed.purchaseQuantity && this.props.MrktPlcRed.bidPrice))
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

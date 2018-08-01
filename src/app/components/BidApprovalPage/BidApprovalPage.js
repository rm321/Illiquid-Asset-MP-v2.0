import React from "react";
import './BidApprovalPage.css'
import { LedgerCon, AssetRegisterCon, UserCon, CTokenCon, AssetRequestCon, REAssetsCon, BidRequestsCon, AssetTokenCon, TxRegisterCon, web3 } from '../../constants'
import 'font-awesome/css/font-awesome.css'
import hashFnv32a from "../../hashFnv32a"
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { browserHistory } from 'react-router'

let regeneratorRuntime = require("regenerator-runtime");
var walletAddressBuyer;
var walletAddressSeller;
var details;

export default class BidApprovalPage extends React.Component {
    componentWillMount() {
        // this.props.setTitle("My Requests");
        var bidIds = BidRequestsCon.getBidsByAssetIdAndSellerId(this.props.userReqtReducer.selectedBid.bidSecurityIDs,
            this.props.clientID);
        this.getAssetBids(bidIds);
    }
    componentWillUnmount() {
        this.props.URSetFalse('openBidApprovalPage');
    }
    async getAssetBids(bidIds) {
        var data = [];
        for (var i = 0; i < bidIds.length; i++) {
            var bidDetails = await BidRequestsCon.getBidsByBidId(bidIds[i]);
            if (BidRequestsCon.checkValidBidsOnSeller(bidIds[i])) {
                if (bidDetails[4].c[0]) {
                    debugger;
                    data.push({
                        bidID: web3.toAscii(bidIds[i]),
                        buyerID: web3.toAscii(bidDetails[2]),
                        bidQty: bidDetails[4].c[0],
                        bidAmount: bidDetails[3].c[0],
                        timestamp: bidDetails[5].c[0]
                    });
                }
            }
        }
        this.props.setValue({ id: "BidData", val: data });
    }
    onClickDecline(declineBidId) {
        var conf = BidRequestsCon.rejectBid(declineBidId, { from: web3.eth.accounts[0], gas: 2000000 });
        if (conf) {
            NotificationManager.success("Bid declined successfully", "Success!", 2000);
            setTimeout(() => {
                this.props.URSetFalse("openBidApprovalPage");
                this.props.URSetFalse("openViewReceiveReqts");
            }, 2420);
        }
    }
    onClickApprove(data) {
        details = data;
        var assetId = this.props.userReqtReducer.selectedBid.bidSecurityIDs;
        this.getBuyerWalletAddress(walletAddressBuyer, walletAddressSeller, assetId);
    }

    async getBuyerWalletAddress(walletAddressBuyer, walletAddressSeller, assetId) {
        walletAddressBuyer = await UserCon.getWalletByUserID(details.buyerID);
        this.getSellerWalletAddress(walletAddressBuyer, walletAddressSeller, assetId);
    }

    async getSellerWalletAddress(walletAddressBuyer, walletAddressSeller, assetId) {
        walletAddressSeller = await UserCon.getWalletByUserID(this.props.clientID);
        if (assetId.substring(0, 4) == "REAL") {
            this.tradeRealEstateAsset(walletAddressBuyer, walletAddressSeller, assetId);
        }
        else {
            this.tradeFromAssetToken(walletAddressBuyer, walletAddressSeller, assetId);
        }
    }

    async tradeRealEstateAsset(walletAddressBuyer, walletAddressSeller, assetId) {
        var ATx = await REAssetsCon.transferAssetsAfterSell(walletAddressSeller, walletAddressBuyer, assetId, details.bidAmount, { from: web3.eth.accounts[0], gas: 2000000 });
        this.startCurrencyTransaction(walletAddressBuyer, walletAddressSeller, ATx, assetId);
    }

    async tradeFromAssetToken(walletAddressBuyer, walletAddressSeller, assetId) {
        var ATx = await AssetTokenCon.ATtransfer(assetId, walletAddressSeller, walletAddressBuyer, details.bidQty, details.bidAmount, { from: web3.eth.accounts[0], gas: 2000000 });
        this.startCurrencyTransaction(walletAddressBuyer, walletAddressSeller, ATx, assetId);
    }

    async startCurrencyTransaction(walletAddressBuyer, walletAddressSeller, ATx, assetId) {
        var totalAmount = (details.bidAmount * details.bidQty);
        var setCurrencyTx = await CTokenCon.setCTokenBalance(walletAddressBuyer, totalAmount, { from: web3.eth.accounts[0], gas: 2000000 });
        this.tradeCurrencyToken(walletAddressBuyer, walletAddressSeller, ATx, assetId, totalAmount, setCurrencyTx);
    }

    async tradeCurrencyToken(walletAddressBuyer, walletAddressSeller, ATx, assetId, totalAmount, setCurrencyTx) {
        var CTx = await CTokenCon.CTtransferFrom(walletAddressBuyer, walletAddressSeller, totalAmount, { from: web3.eth.accounts[0], gas: 2000000 });
        this.approaveBid(walletAddressBuyer, walletAddressSeller, ATx, CTx, assetId, totalAmount, setCurrencyTx);
    }

    async addTransactionToTxRegister(walletAddressBuyer, walletAddressSeller, ATx, CTx, assetId, totalAmount, setCurrencyTx, bidApprovalTx) {
        var h1 = (this.props.clientID).concat(details.buyerID);
        var h2 = h1.concat(assetId);
        var ts = Date.now();
        var h3 = h2.concat(ts);
        var h4 = hashFnv32a(h3, false)
        var h5 = h4.toString().substring(0, 5);
        var receiptId = "REC".concat(h5);

        var regisTx = await TxRegisterCon.addTx(receiptId, ATx, CTx, bidApprovalTx, setCurrencyTx, this.props.clientID, details.buyerID, assetId, details.bidQty, totalAmount, ts, { from: web3.eth.accounts[0], gas: 2000000 });
        
        this.updateUserLedger(receiptId,totalAmount,ts);
        
    }

    async updateUserLedger(receiptId,totalAmount,ts){
        var t1 = LedgerCon.addLedgerUpdate(details.buyerID,this.props.clientID,receiptId,totalAmount,ts,{from: web3.eth.accounts[0], gas: 2000000 });
        if (t1) {
            NotificationManager.info("Asset transferred to Buyer successfully", "Asset Transaction", 2500);
            setTimeout(() => {
                NotificationManager.info("Currency debited to your account successfully", "Currency Transaction", 2500);
            }, 2600);
            setTimeout(() => {
                NotificationManager.success("Bid approved successfully", "Success!", 2500);
            }, 5200);
            setTimeout(() => {
                this.props.URSetFalse('openBidApprovalPage');
                this.props.URSetFalse("openViewReceiveReqts");
                browserHistory.push("/TradeLedger")
            }, 7500);
        }
    }

    async approaveBid(walletAddressBuyer, walletAddressSeller, ATx, CTx, assetId, totalAmount, setCurrencyTx) {
        var bidApprovalTx = await BidRequestsCon.approveBid(details.bidID, { from: web3.eth.accounts[0], gas: 2000000 });
        this.resetBid(assetId);
        this.addTransactionToTxRegister(walletAddressBuyer, walletAddressSeller, ATx, CTx, assetId, totalAmount, setCurrencyTx, bidApprovalTx);
    }

    async resetBid(assetId){
        var bidReset = await BidRequestsCon.resetLatestBid(assetId,{from:web3.eth.accounts[0]});
    }

    onClickBack() {
        this.props.URSetFalse('openBidApprovalPage');
        // this.props.setTitle("My Requests");
    }
    BidApprovalPage() {
        let self = this;
        return (
            <div className="row no-margin">

                <div className="row no-margin" id='bidListPane'>
                    <div className="col-md-4 no-padding">
                        <strong>Bid List for :{this.props.userReqtReducer.selectedBid.bidSecurityIDs}</strong>
                    </div>
                </div>

                <div className="row no-margin">
                    <div className="col-md-12 no-padding">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>BID ID</th>
                                    <th>Buyer ID</th>
                                    {/*<th>Bid Quantity</th>*/}
                                    <th>Bid Amount</th>
                                    <th>Timestamp</th>
                                    <th>Accept / Decline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.userReqtReducer.BidData.map((details, i) => {
                                        return (<tr value={self.selected} name="selected" key={i}>
                                            <td >{(details.bidID).toUpperCase()}</td>
                                            <td >{details.buyerID}</td>
                                            {/*<td >{details.bidQty}</td>*/}
                                            <td >{details.bidAmount.toLocaleString()}</td>
                                            <td >{(new Date(details.timestamp)).toLocaleString()}</td>
                                            <td >
                                                <button
                                                    onClick={() => this.onClickApprove(details)}
                                                    className="btn-xs btn-success">
                                                    <i className="fa fa-check" />
                                                    Accept
                                                    </button>
                                                <button
                                                    onClick={() => this.onClickDecline(details.bidID)}
                                                    className="btn-xs col-md-offset-1">
                                                    <i className="fa fa-remove" />
                                                    Reject
                                                    </button>
                                            </td>
                                        </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row no-margin footerPane">
                    <button onClick={() => this.onClickBack()} className="col-md-1 col-md-offset-11 btn">Back</button>
                </div>
            </div>
        );
    }
    render() {
        return (
            <section className="BidApprovalPage-section h100 w100">
                <div className="row no-margin">
                    {this.BidApprovalPage()}
                </div>
                <NotificationContainer />
            </section >
        )
    }
};






import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './TradeModal.css'
import { web3, TxRegisterCon } from '../../constants'
import { browserHistory } from 'react-router'

var BlockData;
var TradeData;
var t1;
var TxDetails;
var CurDetails;
export default class TradeModal extends React.Component {
    componentWillMount() {
        TradeData = (this.props.mhReducer.selectedTrade);
        var ts = TxRegisterCon.getTimestampByReceiptid(TradeData.receiptId);
        t1 = (new Date(ts.c[0]));
    }
    onClickTxID() {
        this.props.mhSetTrue('showTxReceipt');
        TxDetails = web3.eth.getTransactionReceipt(TradeData.assetTx);
    }
    onClickCurID() {
        this.props.mhSetTrue('showCurReceipt');
        CurDetails = web3.eth.getTransactionReceipt(TradeData.assetTx);
    }
    render() {

        return (
            <section className="TradeModal-section h100 w100">

                {
                    (this.props.mhReducer.showTxReceipt) ?
                        (
                            <div className="modal fade" id="tradeModal">
                                <div className="modal-dialog modal-lg modal-style">
                                    <div className="modal-content ">

                                        <div className="modal-header modal-heading">
                                            <h4 className="modal-title">Asset Transaction Details</h4>
                                        </div>
                                        <div className="modal-body">
                                            <label className="lbldiv">Block Number</label>
                                            <b>:</b>
                                            <span>{TxDetails.blockNumber}</span>
                                            <br />
                                            <label className="lbldiv">Cumulative Gas Used</label>
                                            <b>:</b>
                                            <span>{TxDetails.cumulativeGasUsed}</span>
                                            <br />
                                            <label className="lbldiv">Gas Used</label>
                                            <b>:</b>
                                            <span>{TxDetails.gasUsed}</span>
                                            <br />
                                            <label className="lbldiv">Transaction Root</label>
                                            <b>:</b>
                                            <span>{TxDetails.root}</span>
                                            <br />
                                            <label className="lbldiv">Block Hash</label>
                                            <b>:</b>
                                            <span>{TxDetails.blockHash}</span>
                                        </div>
                                        <div className="modal-footer">
                                            <button onClick={() => this.props.mhSetFalse('showTxReceipt')} className="btn" >Go back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        (

                            (this.props.mhReducer.showCurReceipt) ?
                                (
                                    <div className="modal fade" id="tradeModal">
                                        <div className="modal-dialog modal-lg modal-style">
                                            <div className="modal-content ">

                                                <div className="modal-header modal-heading">
                                                    <h4 className="modal-title">Currency Transaction Details</h4>
                                                </div>
                                                <div className="modal-body">
                                                    <label className="lbldiv">Block Number</label>
                                                    <b>:</b>
                                                    <span>{CurDetails.blockNumber}</span>
                                                    <br />
                                                    <label className="lbldiv">Cumulative Gas Used</label>
                                                    <b>:</b>
                                                    <span>{CurDetails.cumulativeGasUsed}</span>
                                                    <br />
                                                    <label className="lbldiv">Gas Used</label>
                                                    <b>:</b>
                                                    <span>{CurDetails.gasUsed}</span>
                                                    <br />
                                                    <label className="lbldiv">Transaction Root</label>
                                                    <b>:</b>
                                                    <span>{CurDetails.root}</span>
                                                    <br />
                                                    <label className="lbldiv">Block Hash</label>
                                                    <b>:</b>
                                                    <span>{CurDetails.blockHash}</span>
                                                </div>
                                                <div className="modal-footer">
                                                    <button className="btn" onClick={() => this.props.mhSetFalse('showCurReceipt')}>Go back</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className="modal fade" id="tradeModal">
                                        <div className="modal-dialog modal-lg modal-style">
                                            <div className="modal-content ">

                                                <div className="modal-header modal-heading">
                                                    <h4 className="modal-title">Transaction Details</h4>
                                                </div>
                                                <div className="modal-body">
                                                    <label className="lbldiv">Asset Transaction ID</label>
                                                    <b>:</b>
                                                    <a onClick={() => this.onClickTxID()}>{TradeData.assetTx}</a>
                                                    <br />
                                                    <label className="lbldiv">Currency Transaction ID</label>
                                                    <b>:</b>
                                                    <a onClick={() => this.onClickCurID()}>{TradeData.currencyTx}</a>
                                                    <br />
                                                    <label className="lbldiv">Seller ID</label>
                                                    <b>:</b>
                                                    {TradeData.sellerId}
                                                    <br />
                                                    <label className="lbldiv">Buyer ID</label>
                                                    <b>:</b>
                                                    {TradeData.buyerId}
                                                    <br />
                                                    <label className="lbldiv">Transaction Time</label>
                                                    <b>:</b>
                                                    {t1.toLocaleString()}
                                                </div>
                                                <div className="modal-footer">
                                                    <button className="btn" onClick={() => this.props.mhSetFalse("openSelectedTrade")}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                        )
                }
            </section >
        )
    }

};

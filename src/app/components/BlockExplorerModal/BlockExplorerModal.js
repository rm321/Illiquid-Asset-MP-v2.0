import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './BlockExplorerModal.css'
import { web3 } from '../../constants'
import { browserHistory } from 'react-router'

var BlockData;
export default class BlockExplorerModal extends React.Component {
    componentWillMount() {
        BlockData = web3.eth.getBlock(this.props.AdminReducer.selectedBlock.number);
    }
    TransactionDetails() {
        <div className="modal-content ">
            <div className="modal-header modal-heading">
                <h4 className="modal-title">Transactions Details</h4>
            </div>
            <div className="modal-body">
               
            </div>
            <div className="modal-footer">
                <button className="btn" onClick={() => this.props.setFalse("openBlockDetails")}>Close</button>
            </div>
        </div>
    }
    modalDetails() {
        return (
            <div className="modal-content ">
                <div className="modal-header modal-heading">
                    <h4 className="modal-title">Block Details</h4>
                </div>
                <div className="modal-body">
                    <label className="lbldiv" >Extra Data</label>
                    <b>:</b>
                    {BlockData.extraData}
                    <br />
                    <label className="lbldiv" >Gas Limit</label>
                    <b>:</b>
                    {BlockData.gasLimit}
                    <br />
                    <label className="lbldiv" >Gas Used</label>
                    <b>:</b>
                    {BlockData.gasUsed}
                    <br />
                    <label className="lbldiv" >Miner</label>
                    <b>:</b>
                    <strong>{"CIL-Blockchain-Node2-wallet-address: "}</strong>{BlockData.miner}
                    <br />
                    <label className="lbldiv" >Block Number</label>
                    <b>:</b>
                    {BlockData.number}
                    <br />
                    <label className="lbldiv" >Parent Hash</label>
                    <b>:</b>
                    {BlockData.parentHash}
                    <br />
                    <label className="lbldiv" >Size</label>
                    <b>:</b>
                    {BlockData.size}
                    <br />
                    <label className="lbldiv" >Difficulty</label>
                    <b>:</b>
                    {BlockData.difficulty.c[0]}
                    <br />
                    <label className="lbldiv" >Timestamp</label>
                    <b>:</b>
                    {BlockData.timestamp}
                    <br />
                    <label className="lbldiv" >Transactions Root</label>
                    <b>:</b>
                    {BlockData.transactionsRoot}
                    <br />
                    <label className="lbldiv" >Number of Transactions</label>
                    <b>:</b>
                    {BlockData.transactions.length}
                    <br />
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={() => this.props.onClickClose()}>Close</button>
                </div>
            </div>
        );
    }
    render() {
        return (
            <section className="blockExplorerModal-section h100 w100">
                <div className="modal fade" id="blockExplorerModal">
                    {
                        (this.props.AdminReducer.openBlockDetails) ?
                            (
                                <div className="modal-dialog modal-lg modal-style" >
                                    {this.TransactionDetails()}
                                </div>
                            )
                            :
                            (
                                <div className="modal-dialog modal-lg modal-style" >
                                    {this.modalDetails()}
                                </div>
                            )
                    }


                </div>
            </section >
        )
    }

};

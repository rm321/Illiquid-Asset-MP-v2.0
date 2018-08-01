import React from "react"
import { setTitle } from "../../actions/titleActions"
import { mhUpdateInputValue, mhSelectedAssetData, mhSetTrue, mhSetFalse, mhSetValue } from "../../actions/mhActions"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './TradeLedger.css'
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import TradeModal from '../../components/TradeModal/TradeModal'
import { AssetRegisterCon, UserCon, web3, TxRegisterCon, LedgerCon } from '../../constants';
import classNames from 'classnames';

var walletAddress;
var txDetails;
var txIds;
var ledgerDetails;
class TradeLedger extends React.Component {
    constructor(props) {
        super();
        props.setTitle("My Transactions");
    }
    onTradeSelected(data) {
        this.props.mhSetValue({ id: 'selectedTrade', val: data });
        this.props.mhSetTrue("openSelectedTrade");
    }
    componentWillMount() {
        debugger;
        walletAddress = UserCon.getWalletByUserID(this.props.logModRed.clientID);
        txIds = TxRegisterCon.getReceiptIdsByClientId(this.props.logModRed.clientID);
        ledgerDetails = LedgerCon.getLedgerPerUser(this.props.logModRed.clientID);
        var data = [];
        for (var i = 0; i < txIds.length; i++) {
            for (var j = 0; j < ledgerDetails[0].length; j++) {
                if (txIds[i] === ledgerDetails[0][j]) {
                    var ts = TxRegisterCon.getTimestampByReceiptid(ledgerDetails[0][j]);
                    var t1 = (new Date(ts.c[0]));
                    txDetails = TxRegisterCon.getReceiptByReceiptId(ledgerDetails[0][j]);
                    data.push({
                        assetTx: txDetails[0],
                        currencyTx: txDetails[1],
                        type: web3.toAscii(ledgerDetails[2][j]),
                        assetId: web3.toAscii(txDetails[4]),
                        tradedQty: txDetails[5].c[0],
                        tradedAmount: txDetails[6].c[0],
                        sellerId: web3.toAscii(txDetails[3]),
                        buyerId: web3.toAscii(txDetails[2]),
                        tradedTime: t1,
                        balance: ledgerDetails[4][j].c[0],
                        recpId: web3.toAscii(ledgerDetails[0][j])
                    })
                }
            }
        }
        // var astID = web3.toAscii(txDetails[4]);
        // var astType;
        // var buyRole = web3.toAscii(txDetails[3]);
        // var sellRole = web3.toAscii(txDetails[2]);
        // if (astID.substring(0, 4) == "REAL") {
        //     astType = "Real Estate";
        //     if ((buyRole.substring(0, 8)) === this.props.logModRed.clientID) {
        //         userRole = "Sell";
        //     }
        //     else if ((sellRole.substring(0, 8)) === this.props.logModRed.clientID) {
        //         userRole = "Buy";
        //     }
        // }
        // else {
        //     var tx = AssetRegisterCon.getAssetDetailsByAssetID(txDetails[4]);
        //     astType = web3.toAscii(tx[1]);
        //     {
        //         ((buyRole.substring(0, 8)) === this.props.logModRed.clientID) ?
        //             (
        //                 userRole = "Sell"
        //             )
        //             :
        //             (
        //                 userRole = "Buy"
        //             )
        //     }
        // }
        // for (var j = 0; j < ledgerData.length; j++) {
        //     if (txIds[i] == ledgerData[j][0]) {

        //     }
        // }
        // }
        this.props.mhSetValue({ id: 'tradeLedgerList', val: data });

    }
    tradeLedger() {
        debugger;
        const per_page = 10;
        const pages = Math.ceil(txIds.length / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let self = this;

        return (
            <div className="row no-margin">

                <div className="row no-margin balance-pane">
                    <div className="col-md-4 no-padding"><strong>Transactions</strong></div>

                    <div className="col-md-8">

                        <div className="col-md-4 col-md-offset-2">
                            <label htmlFor='initialBal'>Initial Balance:&nbsp;</label>
                            <span id='initialBal'>500,000</span>
                        </div>

                        <div className="col-md-4 col-md-offset-2">
                            <label htmlFor='availableBal'>Available Balance:&nbsp;</label>
                            <span id='availableBal'>
                                {
                                    (this.props.mhReducer.tradeLedgerList.length > 0) ?
                                        (
                                            this.props.mhReducer.tradeLedgerList[this.props.mhReducer.tradeLedgerList.length - 1].balance.toLocaleString()
                                        )
                                        : '500,000'
                                }
                            </span>
                        </div>
                    </div>

                </div>

                <div className="row no-margin">
                    <div className="col-md-12 no-padding">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Receipt ID</th>
                                    <th>Transaction Type</th>
                                    <th>Traded With</th>
                                    <th id='tdPrWdth'>Traded Price</th>
                                    <th>Traded Time</th>
                                    <th id='rnBalWdth'>Running Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.mhReducer.tradeLedgerList.map((details, i) => {
                                        if (i >= start_offset && start_count < per_page) {
                                            start_count++;
                                            return (<tr name="selectedTrade" onClick={() => self.onTradeSelected(details)} key={i}>
                                                <td >{details.assetId}</td>
                                                <td >{details.recpId}</td>
                                                <td >{details.type}</td>
                                                <td >
                                                    {
                                                        (details.type.substring(0, 5) === 'Debit') ?
                                                        (
                                                            details.sellerId
                                                        )
                                                        :
                                                        (
                                                            details.buyerId
                                                        )
                                                    }
                                                    </td>
                                                <td >{details.tradedAmount.toLocaleString()}</td>
                                                <td >{details.tradedTime.toLocaleString()}</td>
                                                <td>{details.balance.toLocaleString()}</td>
                                            </tr>
                                            );
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row no-margin paginationPane'>
                            <div className="col-md-4 no-padding">
                                <strong>Note: </strong><span>Please click on the Asset ID for transaction details</span>
                            </div>
                            <div className="col-md-4 col-md-offset-4 no-padding">
                                <Pagination className="assets-pagination pull-right no-margin" bsSize="medium"
                                    maxButtons={5} first last next prev boundaryLinks
                                    items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                            </div>

                        </div>
            </div>
        );
    }
    render() {
        return (
            <section className="tradeLedger-section h100 w100">
                {
                    (this.props.mhReducer.openSelectedTrade) ?
                        (
                            <div>
                                <TradeModal
                                    mhReducer={this.props.mhReducer}
                                    mhSetFalse={this.props.mhSetFalse}
                                    mhSetTrue={this.props.mhSetTrue}
                                />
                                {this.tradeLedger()}
                            </div>
                        )
                        :
                        (<div>
                            {this.tradeLedger()}
                        </div>
                        )
                }



            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/TradeLedger?page=' + page);
    }

}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        logModRed: state.logModRed,
        mhReducer: state.mhReducer,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, mhUpdateInputValue, mhSelectedAssetData, mhSetTrue, mhSetFalse, mhSetValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TradeLedger));
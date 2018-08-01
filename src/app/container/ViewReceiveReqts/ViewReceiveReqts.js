import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './ViewReceiveReqts.css'
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import { setTitle } from "../../actions/titleActions"
import { URUpdateInputValue, URSetTrue, URSetFalse, URSetValue } from '../../actions/userReqtActions'
import classNames from 'classnames'
import 'font-awesome/css/font-awesome.css'
import { BidRequestsCon, web3, REAssetsCon, UserCon } from '../../constants'
import BidApprovalPage from '../../components/BidApprovalPage/BidApprovalPage'

var walletAddress;
var assetOwnerAddress;
var bidData;
var noBids = false;
class ViewReceiveReqts extends React.Component {

    componentWillMount() {
        var data = [];
        var validBid = [];
        this.props.setTitle("My Requests");
        walletAddress = UserCon.getWalletByUserID(this.props.logModRed.clientID);
        bidData = BidRequestsCon.getBidsOnSeller(this.props.logModRed.clientID);
        for (var i = 0; i < bidData[0].length; i++) {
            var aid = web3.toAscii(bidData[1][i]);
            var noOfBids = BidRequestsCon.getValidBidCountsBySellerID(this.props.logModRed.clientID, bidData[1][i]);
            if (BidRequestsCon.checkValidBidsOnSeller(bidData[0][i])) {
                if (aid.substring(0, 4) === "REAL") {
                    debugger;
                    assetOwnerAddress = REAssetsCon.getREAssetOwner(aid);
                    console.log(assetOwnerAddress);
                }
                else if(!(aid.substring(0, 4) === "REAL")){
                    assetOwnerAddress = walletAddress;
                }

                // var noOfBids = BidRequestsCon.getValidBidCountsBySellerID(this.props.logModRed.clientID, bidData[1][i]);
                var bidID = bidData[0][i];

                var aID = web3.toAscii(bidData[1][i]);
                var check = validBid.indexOf(aID);
                if (assetOwnerAddress === walletAddress) {

                    if (check === -1) {
                        validBid.unshift(aID);
                        data.push({
                            bidSecurityIDs: aID,
                            bidsCount: noOfBids.c[0]
                        });
                    }
                }
            }
        }
        this.props.URSetValue({ id: 'BidRequests', val: data });
    }
    onBidSelected(details) {
        this.props.URSetValue({ id: 'selectedBid', val: details });
        this.props.URSetTrue('openBidApprovalPage');
    }
    goHome() {
        this.props.URSetFalse("openViewReceiveReqts");
        this.props.setTitle("User Requests");
    }

    ViewReceiveReqts() {
        const per_page = 10;
        let assetCount = this.props.userReqtReducer.BidRequests.length;
        const pages = Math.ceil(assetCount / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let self = this;

        return (
            <div className="row no-margin">
                <div className="row no-margin" id='receivedReqts-pane'>
                    <div className="col-md-4 no-padding"><strong>Received Requests</strong></div>
                </div>
                <div className="row no-margin">
                    <table className="table table-bordered table-hover table-responsive table-position">
                        <thead>
                            <tr>
                                <th>Asset ID</th>
                                <th>Number of Bids</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (noBids) ?
                                    (
                                        noBids = true
                                    )
                                    :
                                    (
                                        this.props.userReqtReducer.BidRequests.map((details, i) => {
                                            if (details.bidsCount !== 0) {
                                                if (i >= start_offset && start_count < per_page) {
                                                    start_count++;
                                                    return (
                                                        <tr value={self.selected} name="selectedBid" onClick={() => this.onBidSelected(details)} key={i}>
                                                            <td >{details.bidSecurityIDs}</td>
                                                            <td >{details.bidsCount}</td>
                                                        </tr>
                                                    );
                                                }
                                            }

                                        })
                                    )
                            }
                        </tbody>
                    </table>
                </div>

                <div className='row no-margin paginationPane'>
                        {/*{
                            (noBids) ?
                                (
                                    <div className="noBidsmsg"><h1> No Bids Available </h1></div>
                                )
                                :
                                (*/}
                                <div className="col-md-5 no-padding">
                                <strong>Note: </strong><span>Please click on the Asset ID to view the received bids</span>
                            </div>
                            <div className="col-md-4 col-md-offset-3 no-padding">
                                <Pagination className="assets-pagination pull-right no-margin" bsSize="medium" maxButtons={5} first last next prev boundaryLinks
                                        items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                            </div>
                                    
                                {/*)
                        }*/}
                        {/*<button className="btn" onClick={() => this.goHome()}>Go Back</button>*/}


                </div>
            </div >
        );
    }

    render() {
        return (
            <section className="receivedRequest-section h100 w100">
                <div>
                    {
                        (this.props.userReqtReducer.openBidApprovalPage) ?
                            (
                                <div>
                                    <BidApprovalPage
                                        URSetTrue={this.props.URSetTrue}
                                        setValue={this.props.URSetValue}
                                        clientID={this.props.logModRed.clientID}
                                        userReqtReducer={this.props.userReqtReducer}
                                        setTitle={this.props.setTitle}
                                        URSetFalse={this.props.URSetFalse} />
                                </div>
                            )
                            :
                            (
                                <div>
                                    {this.ViewReceiveReqts()}
                                </div>
                            )
                    }

                </div>
            </section >
        )
    }
    changePage(page) {
        this.props.router.push('/ViewReceiveReqts?page=' + page);
    }

}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        userReqtReducer: state.userReqtReducer,
        logModRed: state.logModRed,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, URUpdateInputValue, URSetTrue, URSetFalse, URSetValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewReceiveReqts));
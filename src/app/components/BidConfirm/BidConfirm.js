import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './BidConfirm.css'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { updateInputValue, selectedAssetData, setTrue, setFalse, setValue } from "../../actions/mpActions"
import { BidRequestsCon, web3 } from '../../constants'


export default class BidConfirm extends React.Component {
//need to get asset id and show latest bid in model
    componentDidMount() {
        this.props.setTitle("Bid Confirm");
        var latestBid = BidRequestsCon.getLatestBid(assetID);
    }

    onClickClose() {
        this.props.setFalse('openBidConfirm');
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
                                    <span>Latest Bid: </span>

                            </div>
                            <div className="modal-footer">
                                {/* <button

                                    onClick={() =>
                                        this.props.setTrue('openBidConfirm')}>
                                    Confirm</button> 
 */}
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

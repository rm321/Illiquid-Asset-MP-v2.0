import React from "react";
import './SellersList.css';
import { selectedAssetData } from "../../actions/mpActions"
import { UserCon, REAssetsCon, web3, AssetTokenCon } from '../../constants'
import MarketPlaceAsset from '../../components/MarketPlaceAsset/MarketPlaceAsset'

export default class SellersList extends React.Component {
    componentWillMount() {
        var data = [];
        this.props.setTitle("Sellers List");
        var sellerData = AssetTokenCon.getAssetHoldersAndDetails(this.props.MrktPlcRed.selectedData.securityID);
        for (var i = 0; i < sellerData[0].length; i++) {
            var user = UserCon.getUserDetailsByWallet(sellerData[0][i]);
            data.push({
                sellerID: web3.toAscii(user[2]),
                acquisitionPrice: sellerData[1][i].c[0],
                availableQuantity: sellerData[2][i].c[0],
                offerPrice: sellerData[3][i].c[0]
            });
            this.props.setValue({ id: 'sellersList', val: data });
        }
    }
    onSellerlist(details) {
        this.props.setValue({ id: "selectedSeller", val: details });
        this.props.setTrue('openMrktModal');
    }
    onClickBack() {
        this.props.setFalse('OpenModal');
        this.props.setTitle("Market Place");
        this.props.setValue({ id: 'sellersList', val: [] });
        this.props.setValue({ id: 'selectedData', val: {} });
    }
    sellersListPage() {
        let info = this.props.MrktPlcRed;
        let self = this;
        return (
            <div className="row no-margin">
                <div className="row no-margin">
                    <div className="col-md-12 details-div">
                        <div className="col-md-4 col-md-offset-2">
                            <label>Asset Type:</label>{info.assetType}
                            <br />

                            <label>Asset Name:</label>{info.selectedData.securityName}
                            <br />
                        </div>
                        <div className="col-md-4 col-md-offset-1">
                            <label>Asset ID:</label>{info.selectedData.securityID}
                            <br />

                            <label>Asset Type:</label>{info.selectedData.securityType}
                            <br />
                        </div>
                    </div>
                </div>
                <hr />

                <div className="row no-margin seller-heading-div">
                    <div className="col-md-4 no-padding">
                        <h3>Please select a seller from List:</h3>
                    </div>

                </div>

                <div className="row no-margin">
                    <div className="col-md-12 no-padding">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Seller ID</th>
                                    <th>Acquisition Price</th>
                                    <th>Offer Quantity</th>
                                    <th>Offer Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.MrktPlcRed.sellersList.map((details, i) => {
                                        if (details.offerPrice) {
                                            return (<tr value={self.selected} name="selected" onClick={() => self.onSellerlist(details)} key={i}>
                                                <td >{details.sellerID}</td>
                                                <td >{details.acquisitionPrice}</td>
                                                <td >{details.availableQuantity}</td>
                                                <td >{details.offerPrice}</td>
                                            </tr>
                                            );
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                        <button onClick={() => this.onClickBack()} className="btn">Back</button>

                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <section className="sellersList-section h100 w100">
                {
                    (this.props.MrktPlcRed.openMrktModal) ?
                        (
                            <div className="row no-margin">
                                <MarketPlaceAsset
                                    updateInputValue={this.props.updateInputValue}
                                    clientID={this.props.clientID}
                                    MrktPlcRed={this.props.MrktPlcRed}
                                    setFalse={this.props.setFalse}
                                    setValue={this.props.setValue}
                                    setTrue={this.props.setTrue} />
                                {this.sellersListPage()}
                            </div>

                        )
                        :
                        (
                            <div>
                                {this.sellersListPage()}
                            </div>
                        )
                }
            </section>
        )
    }
};






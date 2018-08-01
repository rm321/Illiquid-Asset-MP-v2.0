import React from "react";
import { setTitle } from "../../actions/titleActions"
import { updateInputValue, selectedAssetData, setTrue, setFalse, setValue } from "../../actions/smActions"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import './SecurityMaster.css'
import { Link, withRouter } from 'react-router'
import AssetRegdReqt from '../../components/AssetRegdReqt/AssetRegdReqt'
import AssetRegistration from '../../components/AssetRegistration/AssetRegistration'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import { UserCon, AssetRegisterCon, REAssetsCon, web3 } from '../../constants'

var walletAddress;
var assetData;
class SecurityMaster extends React.Component {
    constructor(props) {
        super();
        props.setTitle("Securities Master");
    }

    componentWillMount() {
        var data = [];
        walletAddress = UserCon.getWalletByUserID(this.props.logModRed.clientID);
        assetData = AssetRegisterCon.getAssetDetailsByType(this.props.SecMasRed.assetType);
        for (var i = 0; i < assetData[0].length; i++) {
            data.push({
                id: web3.toAscii(assetData[0][i]),
                secName: web3.toAscii(assetData[1][i]),
                subType: web3.toAscii(assetData[2][i]),
                cmpnyName: web3.toAscii(assetData[3][i]),
                desc: web3.toAscii(assetData[4][i])
            });
            this.props.setValue({ id: 'assetsList', val: data });
        }
    }

    securityMaster() {
        const per_page = 10;
        let assetCount = assetData[0].length;
        let noAssets = false;
        const pages = Math.ceil(assetCount / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let categoryOptions = this.props.SecMasRed.filterList.map((category, i) => {
            return <option key={i} >{category}</option>
        });
        let self = this;
        return (
            <div className="row no-margin">
                <div className="row no-margin">
                    <div className="col-md-4"><h3>Please select an Asset from List:</h3></div>
                    <div className="col-md-4 col-md-offset-4 assetType-div-style">
                        <label id="asset-type-label" htmlFor="asset-type">Asset Type :</label>
                        <select
                            ref="category"
                            id="asset-type"
                            name="assetType"
                            value={this.props.SecMasRed.assetType}
                            onChange={(event) => this.props.updateInputValue(event, true)}>
                            {categoryOptions}
                        </select>
                    </div>
                </div>
                <div className="row no-margin">
                    <div className="col-md-12 no-padding">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Asset Name</th>
                                    <th>Sub type</th>

                                    {
                                        (this.props.SecMasRed.assetType === "Real Estate") ?
                                            (
                                                [
                                                    <th key={1}>Address</th>,
                                                    <th key={2}>Latitude</th>,
                                                    <th key={3}>Longitude</th>,
                                                    <th key={4}>Asset Description</th>
                                                ]
                                            )
                                            :
                                            (
                                                [
                                                    <th key={1}>Company Name</th>,
                                                    (
                                                        (this.props.SecMasRed.assetType === "Commodity") ||
                                                        (this.props.SecMasRed.assetType === "Alternative")
                                                    ) && <th key={2}>Asset Description</th>
                                                ]
                                            )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    
                                        (
                                            this.props.SecMasRed.assetsList.map((details, i) => {
                                                if (i >= start_offset && start_count < per_page) {
                                                    start_count++;
                                                    return (
                                                        <tr value={self.selected} name="selected" onClick={() => self.props.selectedAssetData(details)} key={i}>
                                                            <td >{details.id}</td>
                                                            <td >{details.secName}</td>
                                                            <td >{details.subType}</td>
                                                            {

                                                                (
                                                                    (this.props.SecMasRed.assetType === "Real Estate") ?
                                                                        (
                                                                            [
                                                                                <td key={1}>{details.addr}</td>,
                                                                                <td key={2}>{details.lat}</td>,
                                                                                <td key={3}>{details.long}</td>,
                                                                                <td key={4}>{details.desc}</td>
                                                                            ]
                                                                        )
                                                                        :
                                                                        (
                                                                            [
                                                                                <td key={1}>{details.cmpnyName}</td>,

                                                                                (
                                                                                    (this.props.SecMasRed.assetType === "Commodity") ||
                                                                                    (this.props.SecMasRed.assetType === "Alternative")
                                                                                ) &&
                                                                                (
                                                                                    <td key={2}>{details.desc}</td>
                                                                                )
                                                                            ]
                                                                        )

                                                                )

                                                            }
                                                        </tr>
                                                    );
                                                }

                                            })
                                        )

                                }
                            </tbody>
                        </table>
                        <div>
                            {
                                (noAssets === true) ?
                                    (
                                        <div className="noAssetmsg"><h1> No Assets Available </h1></div>
                                    ) 
                                    :
                                    (
                                        <Pagination className="assets-pagination pull-right no-margin" bsSize="medium" maxButtons={10} first last next prev boundaryLinks
                                            items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                                    )
                            }
                            <a onClick={() => this.props.setTrue("openAssetReqt")}>Asset Not listed?</a>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    render() {
        return (
            <section className="securityMaster-section h100 w100">
                {
                    (this.props.SecMasRed.openAssetReqt) ?
                        (
                            <div className="row no-margin">
                                <AssetRegdReqt
                                    setTitle={this.props.setTitle}
                                    onInputChange={this.props.updateInputValue}
                                    setValue={this.props.setValue}
                                    setFalse={this.props.setFalse}
                                    SecMasRed={this.props.SecMasRed}
                                    clientID={this.props.logModRed.clientID}
                                />
                                {this.securityMaster()}
                            </div>
                        )
                        :
                        (
                            (this.props.SecMasRed.OpenModal) ?
                                (
                                    <div>
                                        <AssetRegistration
                                            SecMasRed={this.props.SecMasRed}
                                            closeRegdPage={() => this.props.setFalse("OpenModal")}
                                            onInputChange={this.props.updateInputValue}
                                            clientID={this.props.logModRed.clientID}
                                        />
                                        {this.securityMaster()}
                                    </div>

                                )
                                :
                                (<div>
                                    {this.securityMaster()}
                                </div>
                                )
                        )
                }
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/SecurityMaster?page=' + page);
    }

}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        SecMasRed: state.SecMasRed,
        logModRed: state.logModRed,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, updateInputValue, selectedAssetData, setTrue, setFalse, setValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SecurityMaster));
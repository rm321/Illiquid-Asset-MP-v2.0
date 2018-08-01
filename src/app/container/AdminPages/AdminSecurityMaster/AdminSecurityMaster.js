import React from "react";
import { setTitle } from "../../../actions/titleActions"
import { updateInputValue, selectedAssetData, setTrue, setFalse, setValue } from "../../../actions/adminActions"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import './AdminSecurityMaster.css'
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap';
import { push } from 'react-router-redux';
import { UserCon, AssetRegisterCon, REAssetsCon, web3 } from '../../../constants'

var assetData;
class AdminSecurityMaster extends React.Component {
    constructor(props) {
        super();
        props.setTitle("Securities Master");
    }
    componentWillMount() {
        var data = [];
        assetData = REAssetsCon.getAllREAssetDetails();
        for (var i = 0; i < assetData[0].length; i++) {
            if (assetData[1][i] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                if (REAssetsCon.getREAssetSMVisibility(assetData[0][i])) {
                    data.push({
                        id: web3.toAscii(assetData[0][i]),
                        addr: web3.toAscii(assetData[1][i]),
                        subType: web3.toAscii(assetData[2][i]),
                        secName: web3.toAscii(assetData[4][i]),
                        lat: web3.toAscii(assetData[5][i]),
                        long: web3.toAscii(assetData[6][i]),
                        desc: web3.toAscii(REAssetsCon.getREAssetDescription(assetData[0][i]))
                    });
                }
            }
        }
    }

    AdminsecurityMaster() {
        const per_page = 10;
        let assetCount = assetData[0].length;
        const pages = Math.ceil(assetCount / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let categoryOptions = this.props.AdminReducer.filterList.map((category, i) => {
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
                            name="ASMassetType"
                            value={this.props.AdminReducer.ASMassetType}
                            onChange={(event) => this.props.updateInputValue(event, true)}>
                            {categoryOptions}
                        </select>
                    </div>
                </div>

                <div className="row no-margin">
                    <div className="col-md-12">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Asset Name</th>
                                    <th>Sub type</th>

                                    {
                                        (this.props.AdminReducer.ASMassetType === "Real Estate") ?
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
                                                        (this.props.AdminReducer.ASMassetType === "Commodity") ||
                                                        (this.props.AdminReducer.ASMassetType === "Alternative")
                                                    ) && <th key={2}>Asset Description</th>
                                                ]
                                            )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (
                                        this.props.AdminReducer.assetsList.map((details, i) => {
                                            if (i >= start_offset && start_count < per_page) {
                                                start_count++;
                                                return (
                                                    <tr value={self.selected} key={i}>
                                                        <td >{details.id}</td>
                                                        <td >{details.secName}</td>
                                                        <td >{details.subType}</td>
                                                        {

                                                            (
                                                                (this.props.AdminReducer.ASMassetType === "Real Estate") ?
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
                                                                                (this.props.AdminReducer.ASMassetType === "Commodity") ||
                                                                                (this.props.AdminReducer.ASMassetType === "Alternative")
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
                            <Link to="AdminHome">
                                <button className="btn" onClick={() => this.props.setTitle("Admin Home")}>Go Home</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    render() {
        return (
            <section className="AdminsecurityMaster-section h100 w100">
                <div className="row no-margin">
                    {this.AdminsecurityMaster()}
                </div>
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/AdminSecurityMaster?page=' + page);
    }

}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        AdminReducer: state.AdminReducer,
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, updateInputValue, selectedAssetData, setTrue, setFalse, setValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminSecurityMaster));
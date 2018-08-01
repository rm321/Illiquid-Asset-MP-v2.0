import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './MyRequests.css'
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import { setTitle } from "../../../actions/titleActions"
import { updateInputValue, setTrue, setFalse, setValue } from '../../../actions/adminActions'
import classNames from 'classnames'
import 'font-awesome/css/font-awesome.css'

class MyRequests extends React.Component {
    componentWillMount() {
        this.props.setTitle("My Requests");
    }

    MyRequests() {
        const per_page = 10;
        let assetCount = 0;
        const pages = Math.ceil(this.props.AdminReducer.RequestsList.length / per_page);
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * per_page;
        let start_count = 0;
        let self = this;

        return (
            <div className="row no-margin">
                <div className="row no-margin">
                    <div className="col-md-4 col-md-offset-1"><h3>My Requests :-</h3></div>
                </div>
                <div className="row no-margin">
                    <div className="col-md-10 col-md-offset-1">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Asset Name</th>
                                    <th>Company Name</th>
                                    <th>Type</th>
                                    <th>SubType</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    (this.props.AdminReducer.RequestsList.map((details, i) => {
                                        if (i >= start_offset && start_count < per_page) {
                                            start_count++;
                                            return (
                                                <tr value={self.selected} key={i}>
                                                    <td >{details.RequestID}</td>
                                                    <td >{details.AssetName}</td>
                                                    <td >{details.CompanyName}</td>
                                                    <td >{details.Type}</td>
                                                    <td >{details.SubTypes}</td>
                                                    <td className={classNames({ 'greenColor': details.Status === "Approved" },
                                                        { 'redColor': details.Status === "Rejected" })}
                                                        >
                                                        {
                                                            (details.Status === 'Approved') ?
                                                                (
                                                                    <i className="fa fa-thumbs-o-up" />
                                                                )
                                                                :
                                                                (
                                                                    <i className="fa fa-thumbs-o-down" />
                                                                )
                                                        }
                                                        {details.Status}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })
                                    )
                                }
                            </tbody>
                        </table>
                        <div>
                            <Link to="AdminHome"><button className="btn" onClick={() => this.props.setTitle("Admin Home")}>Go Home</button></Link>
                            <Pagination className="assets-pagination pull-right no-margin" bsSize="medium" maxButtons={5} first last next prev boundaryLinks
                                items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    render() {
        return (
            <section className="securityMaster-section h100 w100">
                <div>
                    {this.MyRequests()}
                </div>
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/myRequests?page=' + page);
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
    return bindActionCreators({ setTitle, updateInputValue, setTrue, setFalse, setValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyRequests));
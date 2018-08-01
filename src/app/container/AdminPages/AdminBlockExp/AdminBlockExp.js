import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './AdminBlockExp.css'
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import { setTitle } from "../../../actions/titleActions"
import { updateInputValue, setTrue, setFalse, setValue, getBlockData, getBlockCount } from '../../../actions/adminActions'
import axios from 'axios'
import BlockExplorerModal from '../../../components/BlockExplorerModal/BlockExplorerModal'

let regeneratorRuntime = require("regenerator-runtime");

class AdminBlockExp extends React.Component {
    closeModal(self) {
        this.props.getBlockData(self.location.query.page);
        setTimeout(() => {
            this.props.setFalse('openBlockExpModal');
        }, 500);
    }
    componentWillMount() {
        this.props.setTitle("Block Explorer");
        this.getCount();
    }
    async getCount(){
        await this.props.getBlockCount();
        this.getData();
    }
    async getData(){
        await this.props.getBlockData(this.props.page);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.page && (this.props.page !== nextProps.page)) {
            this.props.getBlockData(nextProps.page);
        }
    }
    onClickBlock(data) {
        this.props.setTrue("openBlockExpModal");
        this.props.setValue({ id: "selectedBlock", val: data });
    }

    AdminBlockExp() {
        const per_page = 10;
        const pages = Math.ceil(this.props.AdminReducer.countOfBlocks / per_page);
        const current_page = this.props.page;
        let self = this;
        return (
            <div className="row no-margin">
                <div className="row no-margin">
                    <div className="col-md-4 col-md-offset-1" id='blcExp-heading'><strong>Block Explorer</strong></div>
                </div>
                <div className="row no-margin">
                    <div className="col-md-10 col-md-offset-1">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Block Number</th>
                                    <th>Block Hash</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.AdminReducer.AdminExplorerList && this.props.AdminReducer.AdminExplorerList.map((details, i) => {
                                        return (
                                            <tr value={self.selectedBlock} name="selectedBlock" onClick={() => self.onClickBlock(details)} key={i}>
                                                <td >{details.number}</td>
                                                <td >{details.hash}</td>
                                                <td >{(new Date(details.timestamp * 1000)).toLocaleString()}</td>
                                            </tr>

                                        );
                                    }
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row no-margin paginationPane'>
                      <div className="col-md-12 no-padding">
                        {/*<Link to="AdminHome"><button className="btn" onClick={() => this.props.setTitle("Admin Home")}>Go Home</button></Link>*/}
                        <Pagination className="pull-right no-margin" bsSize="medium" maxButtons={5} first last next prev boundaryLinks
                        items={pages} activePage={current_page} onSelect={this.changePage.bind(this)} />
                    </div>
                </div>
            </div >
        );
    }

    render() {
        return (
            <section className="administrator-section h100 w100">
                <div>
                    {
                        (this.props.AdminReducer.openBlockExpModal) ?
                            (
                                <div>
                                    <BlockExplorerModal
                                        setTrue={this.props.setTrue}
                                        setFalse={this.props.setFalse}
                                        onClickClose={() => this.closeModal(this.props)}
                                        AdminReducer={this.props.AdminReducer} />
                                </div>
                            )
                            :
                            (
                                <div>
                                    {this.AdminBlockExp()}
                                </div>
                            )
                    }

                </div>
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/adminExplorer?page=' + page);
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
    return bindActionCreators({ setTitle, updateInputValue, setTrue, setFalse, setValue, getBlockData, getBlockCount }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminBlockExp));
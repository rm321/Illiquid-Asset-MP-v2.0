import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './ClientMaster.css'
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { push } from 'react-router-redux'
import { setTitle } from "../../../actions/titleActions"
import { setValue, setTrue, setFalse } from "../../../actions/adminActions"
import axios from 'axios'
import { UserCon, web3 } from '../../../constants'
import EditUser from '../EditUser/EditUser'

class ClientMaster extends React.Component {

    componentWillMount() {
        var data = [];
        this.props.setTitle("User Master");
        debugger;
        var usersList = UserCon.getUsersDetails();

        for (var i = 0; i < usersList[0].length; i++) {
            data.push({
                fn: web3.toAscii(usersList[0][i]),
                ln: web3.toAscii(usersList[1][i]),
                uid: web3.toAscii(usersList[2][i]),
                dbAcc: usersList[3][i].c[0],
                mob: usersList[4][i].c[0],
                email: web3.toAscii(usersList[5][i])
            })
        }
        this.props.setValue({ id: 'usersList', val: data })

    }

    onClickEdit(details) {
        this.props.setTrue('openEditUser');
        this.props.setValue({ id: 'selectedUser', val: details })
    }

    clientMasterPage() {
        const per_page = 10;
        const pages = Math.ceil(UserCon.getUserIDs().length / per_page);
        const current_page = this.props.page;
        let self = this;
        return (
            <div className="row no-margin">
                
                <div className="row no-margin">
                    <div className="col-md-4" id='clientMaster-heading'><strong>User List</strong></div>
                </div>
                
                <div className="row no-margin">
                    <div className="col-md-12">
                        <table className="table table-bordered table-hover table-responsive table-position">
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Client ID</th>
                                    <th>DB Account No</th>
                                    <th>Mobile No</th>
                                    <th>Email ID</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.AdminReducer.usersList.reverse().map((details, i) => {
                                        {
                                            if (details.mob !== 0) {
                                                return (
                                                    <tr value={self.selected} key={i}>
                                                        <td >{details.fn}{' '}{details.ln}</td>
                                                        <td >{details.uid}</td>
                                                        <td >{details.dbAcc}</td>
                                                        <td >{details.mob}</td>
                                                        <td >{details.email}</td>
                                                        <td><button onClick={() => this.onClickEdit(details)}>Edit</button></td>
                                                    </tr>
                                                );
                                            }
                                        }

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
            <section className="clientMaster-section h100 w100">
                <div>
                    {
                        (this.props.AdminReducer.openEditUser) ?
                            (
                               <div>
                                    {this.clientMasterPage()}
                                    <EditUser 
                                        setFalse={this.props.setFalse} 
                                        selectedUser={this.props.AdminReducer.selectedUser}
                                    />
                                </div>
                            )
                            :
                            (
                                this.clientMasterPage()
                            )
                    }
                </div>
            </section>
        )
    }
    changePage(page) {
        this.props.router.push('/clientMaster?page=' + page);
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
    return bindActionCreators({ setTitle, setValue, setTrue, setFalse }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClientMaster));
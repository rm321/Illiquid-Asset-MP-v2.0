import React from "react";
import Modal from 'react-bootstrap/lib/Modal';
import './EditUser.css'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router'
import { Pagination } from 'react-bootstrap';
import { push } from 'react-router-redux';
import { UserCon,  web3 } from '../../../constants'
import {browserHistory } from 'react-router';

let regeneratorRuntime = require("regenerator-runtime");

var buyerAddr;
class EditUser extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        mobile: this.props.selectedUser.mob,
        email: this.props.selectedUser.email
    }
}
    componentWillMount() {
        buyerAddr = UserCon.getWalletByUserID(this.props.selectedUser.uid);
        console.log(buyerAddr);
    }
    saveChanges() {
        var confirm = UserCon.editUserDetails(buyerAddr,this.state.mobile,this.state.email,{from:web3.eth.accounts[0]});
        this.props.setFalse('openEditUser');        
        browserHistory.push('AdminHome');
    }

    changeInput(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    onClickClose() {
        this.props.setFalse('openEditUser');
    }

    render() {
        return (
            <section className="EditUserModal-section h100 w100">
                <div className="modal fade" id="userEditModal">
                    <div className="modal-dialog modal-md modal-style">
                        <div className="modal-content ">
                            <div className="modal-header modal-heading">
                                <h4 className="modal-title">Edit User details</h4>
                            </div>
                            <div className="modal-body col-md-offset-3">
                                <label htmlFor="mobile">Mobile number</label>
                                <b>:</b>
                                    <input 
                                        type="text"
                                        name="mobile"
                                        value={this.state.mobile}
                                        onChange={(event) => this.changeInput(event)}
                                    />
                                    <br />
                                <label htmlFor="email">Email</label>
                                <b>:</b>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={(event) => this.changeInput(event)}                                    
                                    />                                
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => this.saveChanges()} className="btn btn-primary">Save</button>
                                <button onClick={() => this.onClickClose()} className="btn">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section >
        );
    }

};
export default EditUser;
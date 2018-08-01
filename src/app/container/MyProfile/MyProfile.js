import React from "react";
import './MyProfile.css'
import { Link } from 'react-router'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import classNames from 'classnames'
import { setTitle } from '../../actions/titleActions'
import { setValue } from '../../actions/loginActions'
import { CTokenCon, UserCon, web3 } from "../../constants";
import { setTrue, setFalse } from '../../actions/myProfileActions';

var walletAddr;
let regeneratorRuntime = require("regenerator-runtime");
var userDetails;
var userID;
var CTBalance;
var y;
class MyProfile extends React.Component {
    componentWillMount() {
        this.props.setTitle("My Profile");
        this.fetchWalletAddr(this.props.logModRed.clientID);
    }
    async fetchWalletAddr(userID) {
        walletAddr = await UserCon.getWalletByUserID(userID);
        this.fetchUserDetails(walletAddr);
    }
    async fetchUserDetails(walletAddr) {
        userDetails = await UserCon.getUserDetailsByWallet(walletAddr);
        CTBalance = await CTokenCon.getCTBalance(walletAddr);
        var data = {
            fn: web3.toAscii(userDetails[0]),
            ln: web3.toAscii(userDetails[1]),
            uID: web3.toAscii(userDetails[2]),
            DBAccNo: userDetails[3].c[0],
            mobNo: userDetails[4].c[0],
            balance: (CTBalance.c[0]).toLocaleString(),
            email: web3.toAscii(userDetails[5])
        }
        this.props.setValue({ id: "userDetails", val: data });
        // this.getCurrencyBalance(walletAddr);
    }
    // async getCurrencyBalance(walletAddr){
    //     CTBalance = await CTokenCon.getCTBalance(walletAddr);
    //     console.log("Out",CTBalance);
    //     console.log("In",CTBalance.c[0]);
    //     y = CTBalance.c[0];
    // }
    profilePane() {
        return (
            <section>
                <div className="row no-margin">
                    <div className='col-md-6 col-md-offset-3 profileBox'>
                            <div className="profile-header no-padding">
                                <strong>Profile Details</strong>
                            </div>
                            <div className="myProfile-grid-style">

                                <label >User Name</label><b>:</b>
                            <span>{this.props.logModRed.userDetails.fn} {" "} {this.props.logModRed.userDetails.ln}</span>
                            <br />

                            <label >UID</label><b>:</b>
                            <span>{this.props.logModRed.userDetails.uID}</span>
                            <br />

                            <label >Mobile No</label><b>:</b>
                            <span>{this.props.logModRed.userDetails.mobNo}</span>
                            <br />

                            <label >Email ID</label><b>:</b>
                            <span>{this.props.logModRed.userDetails.email}</span>
                            <br />

                            <label >DB A/C No</label><b>:</b>
                            <span>{this.props.logModRed.userDetails.DBAccNo}</span>
                            <br />

                            <label >Your Balance</label><b>:</b>
                            <span>
                                <span id='tokens-link' title="Click to see Balance Details">
                                    <Link to='/TradeLedger'>{(this.props.logModRed.userDetails.balance)}</Link>
                                </span>{" Currency tokens"}
                            </span>
                            <br />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    render() {
        return (
            <section className="myProfile-section h100 w100">
                {this.profilePane()}
            </section>

        )
    }

};

const mapStateToProps = (state) => {
    return {
        title: state.title,
        logModRed: state.logModRed,
        profileReducer: state.profileReducer,
        mhReducer: state.mhReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, setValue, setTrue, setFalse }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
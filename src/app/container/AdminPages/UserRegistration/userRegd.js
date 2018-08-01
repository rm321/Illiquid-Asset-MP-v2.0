import React from "react";
import './userRegd.css'
import { Link } from 'react-router'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import { setTitle } from "../../../actions/titleActions"
import { updateInputValue } from "../../../actions/adminActions"
import { UserCon, CTokenCon, web3 } from '../../../constants'
import hashFnv32a from '../../../hashFnv32a'
import { NotificationContainer, NotificationManager } from 'react-notifications'

import { browserHistory } from 'react-router'

let regeneratorRuntime = require("regenerator-runtime");

var walletAddr = web3.eth.accounts[0];
//var userWallet = web3.eth.accounts[1];

class userRegd extends React.Component {
    componentDidMount() {
        this.props.setTitle("Register New User");
    }

    registerUser() {
        var name = this.props.AdminReducer.fstName.concat(this.props.AdminReducer.lstName);
        var pw = "12345";
        var mo = this.props.AdminReducer.AdmMobNo;
        var DBAc = 56987923145;
        var hVar = mo.concat(name);
        var randomNum = hashFnv32a(hVar, false);
        var str = this.props.AdminReducer.fstName;
        var strUp = str.toUpperCase();
        var res = strUp.substring(0, 4);
        var res1 = randomNum.toString().substring(0, 4);
        var userid = res.concat(res1);
        this.f1(pw, userid, walletAddr, DBAc);

    }
    async f1(pw, userid, walletAddr, DBAc) {
        var userWallet = await web3.personal.newAccount(pw, { from: walletAddr, gas: 2000000 });
        this.f3(pw, userid, walletAddr, userWallet, DBAc);
        console.log(userWallet);
    }

    async f2(pw, userid, walletAddr, userWallet, DBAc) {
        await web3.eth.sendTransaction({ from: walletAddr, to: userWallet, value: web3.toWei(50, "Ether") });
        this.f3(pw, userid, walletAddr, userWallet, DBAc);
    }

    async f3(pw, userid, walletAddr, userWallet, DBAc) {
        const Confirm = await UserCon.addNewUser(this.props.AdminReducer.fstName,
            this.props.AdminReducer.lstName, userWallet, userid, DBAc, pw,
            this.props.AdminReducer.AdmMobNo, this.props.AdminReducer.AdmEmail,{ from: walletAddr, gas: 2000000 });
        if (Confirm) {
            NotificationManager.success("User Registered Successfully", "Success!", 2000);
            this.f4(walletAddr,userWallet);
        }
    }

    async f4(walletAddr,userWallet) {
        const success = await CTokenCon.setCTokenBalance(userWallet, 500000, { from: walletAddr, gas: 2000000 });
        if (success) {
            NotificationManager.success("500k USD assigned to user successfully", "Success!", 2000);
            setTimeout(() => {
                browserHistory.push('/clientMaster');
            }, 2420);
        }
    }

    render() {
        return (
            <section className="userRegd-section h100 w100">
                <div className="col-md-6 col-md-offset-3 userRegd-box-style">

                    <div className="row no-margin">
                        <div className="col-md-10">
                            <strong>Please enter the Details</strong>
                        </div>
                    </div>
                    <br />

                    <div className="row no-margin">
                        <div className="col-md-10">

                            <div className="row no-margin">
                                <label className="lbldiv" htmlFor="Adm-Fst-Name">First Name</label>
                                <b>:</b>
                                <input className="userregd-input"
                                    name="fstName"
                                    id="Adm-Fst-Name"
                                    onChange={(event) => this.props.updateInputValue(event)}
                                />
                                <br />

                                <label className="lbldiv" htmlFor="Adm-Lst-Name">Last Name</label>
                                <b>:</b>
                                <input className="userregd-input"
                                    name="lstName"
                                    id="Adm-Lst-Name"
                                    onChange={(event) => this.props.updateInputValue(event)}
                                />
                               
                                <br />
                                
                                <label className="lbldiv" htmlFor="Adm-Regd-Mob">Mobile Number</label>
                                <b>:</b>
                                <input className="userregd-input"
                                    type="number"
                                    name="AdmMobNo"
                                    id="Adm-Regd-Mob"
                                    onChange={(event) => this.props.updateInputValue(event)}
                                />
                               
                                <br />


                                <label className="lbldiv" htmlFor="Adm-Regd-Email">Email address</label>
                                <b>:</b>
                                <input className="userregd-input"
                                    type="email"
                                    name="AdmEmail"
                                    id="Adm-Regd-Email"
                                    onChange={(event) => this.props.updateInputValue(event)}
                                />
                               
                                <br />
                            </div>

                            <div className="row no-margin">
                                <div className="col-md-offset-6">
                                    <button
                                        disabled={
                                            (!(this.props.AdminReducer.fstName &&
                                                this.props.AdminReducer.lstName &&
                                                this.props.AdminReducer.AdmMobNo &&
                                                this.props.AdminReducer.AdmEmail ))
                                        }
                                        className="btn btn-primary"
                                        onClick={() => this.registerUser()}>Register User</button>
                                    {/*<Link to="AdminHome"><button onClick={() => this.props.setTitle("Admin Home")} className="btn col-md-offset-1">Close</button></Link>*/}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section>
        )
    }

};


const mapStateToProps = (state) => {
    return {
        title: state.title,
        AdminReducer: state.AdminReducer
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, updateInputValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(userRegd);
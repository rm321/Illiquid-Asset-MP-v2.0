import React from "react";
import './Login.css'
import { browserHistory } from 'react-router'
import { UserCon, web3 } from '../../../constants'
import { NotificationContainer, NotificationManager } from 'react-notifications'

export default class Login extends React.Component {

    getRole() {
        var role = 'unidentified';
        var loginData = UserCon.getLogin(this.props.loginModalRed.clientID, this.props.loginModalRed.password)
        if (loginData[1] && loginData[2]) {

            // NotificationManager.success("Logged in as Admin", "Login Successful", 2000);

            // setTimeout(() => {
                this.props.setValue({ id: 'role', val: "Admin" });
                browserHistory.push('/clientMaster');
            // }, 2420);

        }
        else if (loginData[1]) {
            // NotificationManager.success("Logged in as User", "Login Successful", 2000);

            // setTimeout(() => {
                this.props.setValue({ id: 'role', val: "User" });
                browserHistory.push('/MyHoldings');
            // }, 2420);

        }
        else {
            NotificationManager.error("Please check Client ID & Password", "Login failed", 2000);
            setTimeout(() => {
                this.props.setValue({ id: "clientID", val: '' });
                this.props.setValue({ id: "password", val: '' });
                browserHistory.replace('/');
            }, 2100);
        }

    }

    loginPage() {
        return (
            <section className="login-section h100 w100">
                <div className="col-md-5 col-md-offset-1 infoBox">
                    <div className="infoBox-style" >
                        <h2> Simplified BlockChain platform to leap towards Easy trading</h2>
                    </div>
                    <div>
                        <h4>*  Swiftly turn your Illiquid assets to <b>Liquid assets</b></h4>
                        <h4>*  Deal without <b>3rd party</b> interpretation</h4>
                    </div>
                </div>
                <div className="col-md-4 col-md-offset-1 loginBox">
                    <div className="col-md-10 col-md-offset-1">

                        <div className="whole-div">
                            <div className="clientID-div">
                                <label htmlFor="clientID">Client ID:</label>
                                <input
                                    id="clientID"
                                    name="clientID"
                                    onChange={(event) => this.props.onInputChange(event)}
                                    value={this.props.loginModalRed.clientID}
                                    minLength="8"
                                    maxLength="8"
                                />
                                <hr />
                            </div>
                            <br />

                            <div className="pwd-div">
                                <label htmlFor="pwd">Password:</label>
                                <input
                                    type="Password"
                                    name="password"
                                    id="pwd"
                                    value={this.props.loginModalRed.password}
                                    onChange={(event) => this.props.onInputChange(event)}
                                />
                                <hr />
                            </div>
                            <br />

                            <button
                                disabled={!(this.props.loginModalRed.clientID && this.props.loginModalRed.password)}
                                className="btn btn-primary col-md-offset-3"
                                onClick={() => this.getRole()}>
                                Login
                                    </button>
                            <br />
                            <a className="col-md-offset-4 fgt-pwd-link" onClick={() => this.props.setTrue("openFgtPwd")}>Forgot Password?</a>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section>
        )
    }

    render() {

        return (
            <div>
                {this.loginPage()}
            </div>
        );
    }
}

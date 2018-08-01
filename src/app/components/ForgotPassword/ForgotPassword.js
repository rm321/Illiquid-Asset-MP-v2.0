import React from "react"
import './ForgotPassword.css'
import { Link } from 'react-router'
import { NotificationContainer, NotificationManager } from 'react-notifications'


export default class ForgotPassword extends React.Component {
    componentDidMount() {
        this.props.setTitle("Forgot Password")
    }
    closeFgtPwd() {
        this.props.goHome("openFgtPwd");
        this.props.setTitle("Welcome")
    }
    handleClick() {
        NotificationManager.success("Your Password is *******", "Password Retrieved!", 2000);
        setTimeout(() => {
            { this.closeFgtPwd() }
        }, 2420);
    }
    render() {
        return (
            <section className="forgotPassword-section h100 w100">
                <div className="col-md-4 col-md-offset-4 forgetPwdBox">
                    <div className="col-md-10 col-md-offset-1">
                        <div autoComplete="off">
                            <div>

                                <div>
                                    <label htmlFor="fgtClientID">Client ID:</label>
                                    <input
                                        maxLength="8"
                                        minLength="8"
                                        name="fgtClientID"
                                        id="fgtClientID"
                                        value={this.props.fgtClientID}
                                        onChange={(event) => this.props.onInputChange(event)}
                                    />
                                    <hr />
                                </div>
                                <br />

                                <div>
                                    <label htmlFor="MobileNumber">Mobile Number:</label>
                                    <input
                                        type="number"
                                        maxLength="10"
                                        minLength="10"
                                        name="MobileNumber"
                                        id="MobileNumber"
                                        value={this.props.MobileNumber}
                                        onChange={(event) => this.props.onInputChange(event)}
                                    />
                                    <hr />
                                </div>
                                <br />

                                <div>
                                    <label htmlFor="OTP">OTP:</label>
                                    <input
                                        disabled={!(this.props.loginModalRed.fgtClientID && this.props.loginModalRed.MobileNumber)}
                                        maxLength="5"
                                        minLength="5"
                                        name="OTP"
                                        id="OTP"
                                        value={this.props.OTP}
                                        onChange={(event) => this.props.onInputChange(event)}
                                    />
                                    <hr />
                                </div>
                                <br />

                                <div>
                                    <button
                                        onClick={() => this.handleClick()}
                                        disabled={!(this.props.loginModalRed.fgtClientID && this.props.loginModalRed.MobileNumber
                                            && this.props.loginModalRed.OTP
                                        )}
                                        className="btn btn-primary">
                                        Get Password
                                </button>
                                    <button
                                        onClick={() => this.closeFgtPwd()}
                                        className="btn col-md-offset-2">
                                        Go Home
                                </button>
                                </div>
                                <br />

                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </section>
        );
    }

}

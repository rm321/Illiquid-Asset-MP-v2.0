import React from "react"
import { LogoBox } from '../../components/Header/LogoBox/LogoBox'
import { TitleBox } from '../../components/Header/HeaderBox/TitleBox'
import { connect } from "react-redux"
import { setTitle } from "../../actions/titleActions"
import { updateInput, setFalse, setTrue, setValue } from "../../actions/loginActions"
import { bindActionCreators } from 'redux';
import './App.css'
import { browserHistory, Link } from 'react-router'
import Login from '../../components/Login/LoginBox/Login'
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword'

class App extends React.Component {
    componentWillMount() {
        this.props.setTitle("Welcome");
    }
    render() {
        return (
            <section className="App-Section h100 w100">
                <div className="container-fluid no-padding h100 w100">
                    <div className="row no-margin heading-box">
                        {/*<LogoBox />*/}
                        <TitleBox titleName={this.props.title.name} />
                    </div>
                    {
                        (this.props.logModRed.role === undefined) ?
                            (
                                <div>
                                    {
                                        !this.props.logModRed.openFgtPwd ?
                                            (

                                                <div className="row no-margin body-section">
                                                    <div className="col-md-12">
                                                        <Login
                                                            logModRed={this.props.logModRed}
                                                            setTrue={this.props.setTrue}
                                                            setValue={(temp) => this.props.setValue(temp)}
                                                            loginModalRed={this.props.logModRed}
                                                            onInputChange={(event) => this.props.updateInput(event)}
                                                            closeModal={this.props.setFalse}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                            :
                                            (
                                                <div>
                                                    <ForgotPassword
                                                        setTitle={this.props.setTitle}
                                                        goHome={this.props.setFalse}
                                                        onInputChange={(event) => this.props.updateInput(event)}
                                                        loginModalRed={this.props.logModRed}
                                                    />
                                                </div>
                                            )
                                    }
                                </div>
                            )
                            :
                            (
                                <div className="col-md-4 col-md-offset-4">
                                    <h1>You are already Logged in</h1>

                                    {
                                        (this.props.logModRed.role === 'User') ?
                                            (
                                                <h5 className="col-md-offset-3">
                                                    <Link to="/MyProfile">Click here</Link> to see your Profile
                                                    </h5>
                                            )
                                            :
                                            (
                                                <h5 className="col-md-offset-3">
                                                    <Link to="/AdminHome">Click here</Link> to go to AdminHome
                                                </h5>
                                            )
                                    }


                                </div>
                            )
                    }
                </div>
            </section>
        );
    }
}


const mapStateToProps = (state) => {
    return {

        title: state.title,
        logModRed: state.logModRed
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, updateInput, setFalse, setTrue, setValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from "react";
import { LogoBox } from '../../components/Header/LogoBox/LogoBox'
import { TitleBox } from '../../components/Header/HeaderBox/TitleBox'
import SecurityMaster from '../SecurityMaster/SecurityMaster'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import { setTitle } from '../../actions/titleActions'
import { setValue, setTrue, resetLoginData } from '../../actions/loginActions'
import { resetMPData } from '../../actions/mpActions'
import { resetSMData } from '../../actions/smActions'
import './Home.css'
import classNames from 'classnames'
import { browserHistory, Link } from 'react-router'

class Home extends React.Component {
    onLogOut() {
        this.props.resetLoginData();
        this.props.resetMPData();
        this.props.resetSMData();
        browserHistory.replace('/');
    }
    render() {
        var overlay = classNames({
            'bg': (
                this.props.SecMasRed.openAssetReqt ||
                this.props.SecMasRed.OpenModal ||
                this.props.MrktPlcRed.openAssetReqt ||
                this.props.MrktPlcRed.openMrktModal ||
                this.props.MrktPlcRed.openREAssetModal ||
                this.props.mhReducer.openSelectedTrade
            )
        })
        return (
            <section className="home-section h100 w100">
                <div className={overlay}></div>
                 {
                    (this.props.logModRed.role === ("User")) ?
                        ( 
                            <div className="container-fluid no-padding h100 w100">
                                <div className="row no-margin heading-box">
                                    {/*<LogoBox />*/}
                                    <TitleBox currentRole={this.props.logModRed.currentRole} titleName={this.props.title.name} />
                                </div>
                                <div className="row no-margin body-section">
                                    <div className="col-md-12 no-padding h100">
                                        <div className="col-md-2 no-padding h100">
                                            <NavigationBar
                                                logModRed={this.props.logModRed}
                                                logOut={() => this.onLogOut()}
                                                setTrue={this.props.setTrue}
                                                setValue={this.props.setValue} />
                                        </div>
                                        <div className="col-md-10 h100">
                                            {this.props.children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         )
                        :
                        (
                            <div className="col-md-4 col-md-offset-4">
                                <h1>Oops!!! Session Expired</h1>
                                <h5 className="col-md-offset-3"><Link to="/">Click here</Link> to Login again</h5>
                            </div>
                        )
                } 

            </section>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        title: state.title,
        logModRed: state.logModRed,
        SecMasRed: state.SecMasRed,
        MrktPlcRed: state.MrktPlcRed,
        mhReducer: state.mhReducer,
        userReqtReducer: state.userReqtReducer
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, setValue, setTrue, resetLoginData, resetMPData, resetSMData }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);

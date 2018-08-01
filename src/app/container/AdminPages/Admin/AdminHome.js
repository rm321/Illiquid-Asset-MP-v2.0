import React from "react";
import './AdminHome.css'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import { LogoBox } from '../../../components/Header/LogoBox/LogoBox'
import { TitleBox } from '../../../components/Header/HeaderBox/TitleBox'
import { setTitle } from '../../../actions/titleActions'
import { setValue } from '../../../actions/loginActions'
import { Link } from 'react-router';
import NavigationBar from '../AdminNavigation/NavigationBar';
import classNames from 'classnames';

class AdminHome extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Admin Home")
    }
    render() {
        var overlay = classNames({
            'bg': (
                this.props.AdminReducer.openBlockExpModal
            )
        })
        return (
            <section className="adminhome-section h100 w100">
                <div className={overlay}></div>
                <div className="container-fluid no-padding h100 w100">
                    {
                        this.props.logModRed.role === 'Admin' ?
                            (
                                <div className="h100">
                                    <div className="row no-margin heading-box">
                                        {/*<LogoBox />*/}
                                        <TitleBox titleName={this.props.title.name} />
                                    </div>
                                    
                                    <div className="row no-margin body-section">
                                        <div className="col-md-12 no-padding h100">
                                            <div className="col-md-2 no-padding h100">
                                                <NavigationBar setValue={this.props.setValue}/>
                                            </div>
                                            <div className="col-md-10 no-padding h100">
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
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        logModRed: state.logModRed,
        AdminReducer: state.AdminReducer
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, setValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);

import React from 'react'
import './NavigationBar.css'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

export default class NavigationBar extends React.Component {
    logoutUser() {
        this.props.setValue({ id: 'clientID', val: '' });
        this.props.setValue({ id: 'password', val: '' });
        this.props.setValue({ id: 'role', val: undefined });
        browserHistory.replace('/')
    }
    render() {
        return (
            <section className="navigationBar-section h100">
                <nav className="navbar navbar-default nav-bar-style">
                    <ul className="nav navbar-nav">
                        {/*<Link to="/adminList"><button className="btn btn-primary nav-btn">Admin Home</button></Link>*/}
                        <Link activeClassName="active" to="/userRegd">
                            <button className="btn btn-primary nav-btn">Register New User</button>
                        </Link>
                        <Link activeClassName="active" to="/registerAsset">
                            <button className="btn btn-primary nav-btn">Register New Asset</button>
                        </Link>
                        <Link activeClassName="active" to="/clientMaster">
                            <button className="btn btn-primary nav-btn">User Master</button>
                        </Link>
                        <Link activeClassName="active" to="/adminExplorer">
                            <button className="btn btn-primary nav-btn">Block Explorer</button>
                        </Link>
                        <button
                            onClick={() => this.logoutUser()}
                            className="btn btn-primary nav-btn">Logout</button>
                    </ul>
                </nav>

            </section>
        );
    }
}



         
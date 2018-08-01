import React from 'react'
import './NavigationBar.css'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

export default class NavigationBar extends React.Component {

    changeRole() {
        if (this.props.logModRed.currentRole === 'Buyer') {
            browserHistory.push('/MyHoldings');
            // this.props.setValue({ id: 'currentRole', val: 'Seller' });
        }
        else {
            browserHistory.push('/MarketPlace');
            // this.props.setValue({ id: 'currentRole', val: 'Buyer' });
        }
    }

    render() {
        const isBuyer = (this.props.logModRed.currentRole === 'Buyer');
        return (
            <section className="navigationBar-section h100">
                <nav className="navbar navbar-default nav-bar-style">
                    <ul className="nav navbar-nav">
                        {/*{
                            (isBuyer) ?
                                (*/}
                        <Link activeClassName="active" to="/MarketPlace"><button className="btn btn-primary nav-btn">Marketplace</button></Link>
                        {/*)
                                :
                                (

                        <Link to="/SecurityMaster" key={1}>
                            <button className="btn btn-primary nav-btn">Security Master</button>
                        </Link>*/}
                        {/*<Link to="#" key={2}>
                            <button disabled className="btn btn-primary nav-btn">Market Demands</button>
                        </Link>*/}
                        {/*                                    
                                )
                        }*/}
                        <Link activeClassName="active" to="/MyHoldings"><button className="btn btn-primary nav-btn">My Holdings</button></Link>
                        <Link activeClassName="active" to="/TradeLedger"><button className="btn btn-primary nav-btn">My Transactions</button></Link>
                        <Link activeClassName="active" to="/UserRequests"><button className="btn btn-primary nav-btn">My Requests</button></Link>
                        {/* <Link to="/AssetHistory"><button className="btn btn-primary nav-btn">Asset History</button></Link> */}
                        <Link activeClassName="active" to="/MyProfile"><button className="btn btn-primary nav-btn">My Profile</button></Link>
                        {/*<button
                            onClick={() => this.changeRole()}
                            className="btn btn-primary nav-btn">
                            {
                                (isBuyer) ?
                                    (
                                        "Change Role to Seller"
                                    )
                                    : (
                                        "Change Role to Buyer"
                                    )
                            }
                        </button>*/}
                        <button
                            onClick={() => this.props.logOut()}
                            className="btn btn-primary nav-btn">Logout</button>
                        <div id="loggedUser">Logged in as: {this.props.logModRed.clientID}</div>
                    </ul>
                </nav>

            </section>
        );
    }
}



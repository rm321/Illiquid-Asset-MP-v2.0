import React from "react";
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router, Route, browserHistory, IndexRoute } from "react-router"
import userRegd from './container/AdminPages/UserRegistration/userRegd'
import regdAssets from './container/AdminPages/RegdAssets/regdAssets'
import MyProfile from './container/MyProfile/MyProfile'
import Home from './container/Home/Home'
import AssetHistory from './container/AssetHistory/AssetHistory'
import AdminHome from './container/AdminPages/Admin/AdminHome'
import AdminBlockExp from './container/AdminPages/AdminBlockExp/AdminBlockExp'
import MyRequests from './container/AdminPages/MyRequests/MyRequests'
import ViewPendingReqts from './container/AdminPages/ViewPendingReqts/ViewPendingReqts'
import AdminList from './container/AdminPages/AdminList/AdminList'
import ClientMaster from './container/AdminPages/ClientMaster/ClientMaster'
import SecurityMaster from './container/SecurityMaster/SecurityMaster'
import MarketPlace from './container/MarketPlace/MarketPlace'
import MyHoldings from './container/MyHoldings/MyHoldings'
import TradeLedger from './container/TradeLedger/TradeLedger'
import UserRequests from './container/UserRequests/UserRequests'
import AdminSecurityMaster from './container/AdminPages/AdminSecurityMaster/AdminSecurityMaster'
import { createStore, combineReducers, applyMiddleware } from "redux";
import { logger } from "redux-logger";
import thunk from "redux-thunk"
import title from "./reducers/titleReducer"
import logModRed from "./reducers/loginReducer"
import SecMasRed from "./reducers/smReducer"
import MrktPlcRed from "./reducers/mpReducer"
import mhReducer from "./reducers/mhReducer"
import AdminReducer from "./reducers/adminReducer"
import userReqtReducer from "./reducers/userReqtReducer"
import profileReducer from './reducers/myProfileReducer'
import promise from "redux-promise-middleware"
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux'
import App from "./container/App/App"
import './index.css'
import 'react-notifications/lib/notifications.css';

let middleWare = applyMiddleware(routerMiddleware(browserHistory), logger, thunk, promise())
const store = createStore(
    combineReducers({ title, logModRed, SecMasRed, MrktPlcRed, routing: routerReducer, AdminReducer, mhReducer, userReqtReducer, profileReducer }),
    {},
    middleWare
)
const history = syncHistoryWithStore(browserHistory, store)


ReactDOM.render((
    <Provider store={store}>

        <Router history={history}>
            <Route path="/" component={App} />
            <Route path="App" component={App} />

            <Route path="AdminHome" component={AdminHome} >
                <IndexRoute component={AdminBlockExp} />
                {/*<Route path="/adminList" component={AdminList} />*/}
                <Route path="/userRegd" component={userRegd} />
                <Route path="/registerAsset" component={regdAssets} />
                <Route path="/adminExplorer" component={AdminBlockExp} />
                <Route path="/myRequests" component={MyRequests} />
                <Route path="/viewPendingReqts" component={ViewPendingReqts} />
                <Route path="/clientMaster" component={ClientMaster} />
                <Route path="/AdminSecurityMaster" component={AdminSecurityMaster} />
            </Route>

            <Route path="Home" component={Home} >
                <Route path="/MarketPlace" component={MarketPlace} />
                <Route path="/SecurityMaster" component={SecurityMaster} />
                <Route path="/MyHoldings" component={MyHoldings} />
                <Route path="/MyProfile" component={MyProfile} />
                <Route path="/TradeLedger" component={TradeLedger} />
                <Route path="/UserRequests" component={UserRequests} />
                <Route path="/AssetHistory" component={AssetHistory} />
            </Route>
        </Router>
    </Provider>
), window.document.getElementById('app'));

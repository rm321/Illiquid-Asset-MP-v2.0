import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import './UserRequests.css'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { setTitle } from "../../actions/titleActions"
import { URUpdateInputValue, URSetTrue, URSetFalse, URSetValue } from '../../actions/userReqtActions'
import classNames from 'classnames'
import 'font-awesome/css/font-awesome.css'
import ViewReceiveReqts from '../ViewReceiveReqts/ViewReceiveReqts'

class UserRequests extends React.Component {
    componentWillMount() {
        this.props.setTitle("User Requests");
    }

    render() {
        return (
            <section className="UserRequests-section h100 w100">
                {/*{
                    (this.props.userReqtReducer.openViewReceiveReqts) ?
                        (*/}
                            <ViewReceiveReqts />
                        {/*)
                        :
                        (
                            <div className="row no-margin">
                                <div className="col-md-6 col-md-offset-3 userRequests-box-style">

                                    <div className="row no-margin">
                                        <h3 className="col-md-offset-1">Select an option:</h3>
                                    </div>

                                    <br />

                                    <div className="row no-margin">

                                        <button disabled className="btn col-md-6 col-md-offset-3">
                                            View Raised Requests
                                            </button>

                                        <br /><br /><br />

                                        <button disabled className="btn col-md-6 col-md-offset-3">
                                            View Approved/Rejected History
                                            </button>

                                        <br /><br /><br />

                                        <button
                                            onClick={() => this.props.URSetTrue("openViewReceiveReqts")}
                                            className="btn col-md-6 col-md-offset-3">
                                            View Received Requests
                                            </button>
                                    </div>
                                    <br />
                                </div>
                            </div>
                        )
                }*/}
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        title: state.title,
        userReqtReducer: state.userReqtReducer
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle, URUpdateInputValue, URSetTrue, URSetFalse, URSetValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRequests);
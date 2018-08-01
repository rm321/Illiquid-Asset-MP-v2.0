import React from "react";
import './AdminList.css'
import { Link } from 'react-router'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import { setTitle } from '../../../actions/titleActions'
import { browserHistory } from 'react-router'
import { UserCon } from '../../../constants'

class AdminList extends React.Component {
    componentWillMount() {
        this.props.setTitle("Admin Home");
    }
    render() {
        return (
            <section className="AdminList-section h100 w100">

                <div className="row no-margin">
                    <div className="col-md-10 col-md-offset-1 admin-box-style">
                        <div className="row no-margin">
                            <h1>Welcome, Administrator !!!</h1>
                            <h5>What would you like to do today?</h5>
                        </div>
                        <div className="row details-row">
                            <div className="col-md-2">
                            </div>
                            <div className="col-md-4">
                                <label>Total Users</label>
                                <output>{UserCon.getUserIDs().length}</output>
                            </div>
                            <div className="col-md-4 col-md-offset-1">
                                <label>Total Assets</label>
                                <output>500</output>
                            </div>
                            <div className="col-md-2">
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        )
    }

};
const mapStateToProps = (state) => {
    return {
        title: state.title
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTitle }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminList);

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../store/actions/user";

const Logout = (props) => {
  useEffect(() => {
    props.logout();
  });

  return <Redirect to="/" />;
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    payload: state.user.payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logoutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

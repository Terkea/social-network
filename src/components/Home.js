import React from "react";

import { connect } from "react-redux";
import { Row, Col } from "antd";
import MyProfile from "./MyProfile";

const Home = (props) => {
  return (
    <Row align="center">
      <Col span={14} style={{ backgroundColor: "red" }}>
        <p>test</p>
      </Col>
      <Col style={{ marginLeft: "20px" }} span={6}>
        <MyProfile />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    payload: state.user.payload,
  };
};

export default connect(mapStateToProps, null)(Home);

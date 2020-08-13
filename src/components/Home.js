import React from "react";

import { Row, Col } from "antd";
import MyProfile from "./MyProfile";
import Post from "./Post";

const Home = (props) => {
  return (
    <Row align="center">
      <Col align="center" span={14}>
        <Post />
      </Col>
      <Col style={{ marginLeft: "20px" }} span={6}>
        <MyProfile />
      </Col>
    </Row>
  );
};

export default Home;

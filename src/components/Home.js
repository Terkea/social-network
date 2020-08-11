import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import * as actions from "../store/actions/posts";

import { Row, Col } from "antd";
import MyProfile from "./MyProfile";
import Post from "./Post";

const Home = (props) => {
  // const [posts, setPosts] = useState([]);
  // const { fetchPosts } = props;

  useEffect(() => {
    props.fetchPosts();
  }, []);

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

const mapStateToProps = (state) => {
  return {
    loading: state.posts.loading,
    error: state.posts.error,
    posts: state.posts.payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: () => dispatch(actions.fetchPosts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

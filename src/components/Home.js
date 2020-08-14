import React from "react";

import { Row, Col } from "antd";
import MyProfile from "./MyProfile";
import Post from "./Post";

import {
  isEmpty,
  useFirestoreConnect,
  firestoreConnect,
  isLoaded,
} from "react-redux-firebase";
import { useSelector, connect } from "react-redux";
import { compose } from "redux";

const Home = (props) => {
  const auth = useSelector((state) => state.firebase.auth);

  useFirestoreConnect([
    { collection: "posts" }, // or 'todos'
  ]);
  const posts = useSelector((state) => state.firestore.ordered.posts);

  return (
    <>
      {isEmpty(auth) ? (
        <Row align="center">
          <Col align="center" span={14}>
            {isLoaded(posts) ? (
              posts.map((post) => {
                return <Post data={post} />;
              })
            ) : (
              <p>loading...</p>
            )}
          </Col>
        </Row>
      ) : (
        <Row align="center">
          <Col align="center" span={14}>
            <p>TODO: create post</p>
            {isLoaded(posts) ? (
              posts.map((post) => {
                return <Post data={post} key={post.id} />;
              })
            ) : (
              <p>loading...</p>
            )}
          </Col>
          <Col style={{ marginLeft: "20px" }} span={6}>
            <MyProfile />
          </Col>
        </Row>
      )}
    </>
  );
};
export default Home;

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
          <Col align="center" md={14} xs={24}>
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
          <Col md={6} xs={24}>
            <MyProfile />
          </Col>
          <Col align="center" md={14} xs={24}>
            <p>TODO: create post</p>
            {isLoaded(posts) ? (
              posts.map((post) => {
                return <Post data={post} key={post.id} />;
              })
            ) : (
              <p>loading...</p>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};
export default Home;

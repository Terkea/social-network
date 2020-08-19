import React from "react";

import { Row, Col, Skeleton } from "antd";
import MyProfile from "./MyProfile";
import Post from "./Post";

import { isEmpty, useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";
import CreatePost from "./CreatePost";

const Home = (props) => {
  const auth = useSelector((state) => state.firebase.auth);

  useFirestoreConnect([{ collection: "posts" }]);
  const posts = useSelector((state) => state.firestore.ordered.posts);

  return (
    <>
      {isEmpty(auth) ? (
        <Row align="center">
          <Col align="center" md={14} xs={24}>
            {isLoaded(posts) ? (
              posts.map((post) => {
                return <Post data={post} key={post.id} />;
              })
            ) : (
              <Skeleton avatar paragraph={{ rows: 4 }} />
            )}
          </Col>
        </Row>
      ) : (
        <Row align="center">
          <Col md={6} xs={24}>
            <MyProfile />
          </Col>
          <Col align="center" md={14} xs={24}>
            <CreatePost />
            {isLoaded(posts) ? (
              posts.map((post) => {
                return <Post data={post} key={post.id} />;
              })
            ) : (
              // SKELETON POSTS
              <Skeleton avatar paragraph={{ rows: 4 }} />
            )}
          </Col>
        </Row>
      )}
    </>
  );
};
export default Home;

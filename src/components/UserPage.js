import React from "react";

import { Row, Col } from "antd";
import Post from "./Post";

import {
  isEmpty,
  useFirestoreConnect,
  isLoaded,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";

const UserPage = (props) => {
  const auth = useSelector((state) => state.firebase.auth);
  const { userId } = props.match.params;

  useFirestoreConnect([
    {
      collection: "posts",
      where: [["userId", "==", userId]],
    },
  ]);
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
              <p>loading...</p>
            )}
          </Col>
        </Row>
      ) : (
        <Row align="center">
          <Col md={6} xs={24}>
            <UserProfile userId={userId} />
          </Col>
          <Col align="center" md={14} xs={24}>
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
export default UserPage;

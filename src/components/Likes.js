import React from "react";
import Modal from "antd/lib/modal/Modal";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
const Likes = (props) => {
  const firestore = useFirestore();
  const { Text, Title } = Typography;
  const likes = useSelector((state) => state.firestore.data.likes);
  useFirestoreConnect([
    {
      collection: "likes",
      where: [["postId", "==", props.postId]],
      stoareAs: "likes",
    },
  ]);
  return (
    <ul style={{ listStyle: "none" }}>
      {isLoaded(likes) && !isEmpty(likes) ? (
        Object.entries(likes).map((comment) => {
          return (
            <li
              style={{ paddingTop: "12px" }}
              // [0] -> doc id
              key={comment[0]}
              // [1] -> doc data
            >
              <Avatar
                style={{ display: "inline-block" }}
                size={40}
                src={comment[1].photoURL}
              />
              <Title
                style={{ display: "inline-block", marginLeft: "10px" }}
                level={4}
              >
                {comment[1].userName}
              </Title>
            </li>
          );
        })
      ) : (
        <p>No one likes this</p>
      )}
    </ul>
  );
};

export default Likes;

import React from "react";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { useHistory } from "react-router-dom";
const Likes = (props) => {
  const history = useHistory();
  const { Title } = Typography;
  const likes = useSelector((state) => state.firestore.data.likes);

  useFirestoreConnect([
    {
      collection: "likes",
      where: [["postId", "==", props.postId]],
      stoareAs: "likes",
    },
  ]);
  return (
    <ul style={styles.list}>
      {isLoaded(likes) && !isEmpty(likes) ? (
        Object.entries(likes).map((comment) => {
          return (
            <li
              onClick={() => history.push(`/u/${comment[1].userId}`)}
              style={styles.element}
              // [0] -> doc id
              key={comment[0]}
              // [1] -> doc data
            >
              <Avatar
                style={styles.avatar}
                size={40}
                src={comment[1].photoURL}
              />
              <Title style={styles.username} level={4}>
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

const styles = {
  list: { listStyle: "none" },
  element: { paddingTop: "12px" },
  avatar: { display: "inline-block" },
  username: { display: "inline-block", marginLeft: "10px" },
};

export default Likes;

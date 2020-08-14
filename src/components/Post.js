import React, { useState } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Divider,
  Input,
  Tooltip,
  Button,
} from "antd";
import {
  HeartFilled,
  HeartOutlined,
  CommentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useFirestoreConnect,
  isLoaded,
  isEmpty,
  useFirebase,
  useFirestore,
} from "react-redux-firebase";
import { useSelector } from "react-redux";

const { Text, Paragraph } = Typography;

const Post = (props) => {
  // const [like, setLike] = useState(false);
  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  const checkLike = useSelector((state) => state.firestore.data.checkLike);

  // console.log(checkLike);

  useFirestoreConnect([
    {
      collection: "likes",
      where: [
        ["postId", "==", props.data.id],
        ["userId", "==", auth.uid],
      ],
      storeAs: `checkLike`,
    },
  ]);

  // check if the post is liked or not
  // act accordingly
  // TODO add notification to the post owner
  const likePost = () => {
    if (isLoaded(checkLike) && isEmpty(checkLike)) {
      firestore
        .collection("likes")
        .add({ postId: props.data.id, userId: auth.uid })
        .then(() => {
          firestore
            .collection("posts")
            .doc(props.data.id)
            .update({ likeCount: props.data.likeCount + 1 });
        });
    }

    if (isLoaded(checkLike) && !isEmpty(checkLike)) {
      firestore
        .collection("likes")
        .doc(Object.keys(checkLike)[0])
        .delete()
        .then(() => {
          firestore
            .collection("posts")
            .doc(props.data.id)
            .update({ likeCount: props.data.likeCount - 1 });
        });
    }
  };

  return (
    <Card
      hoverable
      style={{ width: 614, marginTop: "20px" }}
      cover={
        <img
          alt="example"
          src={props.data.imageURL}
          onClick={() => console.log(props.data.id)}
        />
      }
    >
      <Row align="middle">
        <Avatar size={40} src={props.data.profilePicture} />
        <Text strong>&nbsp;&nbsp;{props.data.userName}</Text>
        <Text>
          &nbsp;&nbsp; {dayjs(props.data.timestamp).format("MMM YYYY")}
        </Text>
      </Row>
      <Row>
        <Paragraph style={{ marginTop: "20px", textAlign: "left" }}>
          {props.data.description}
        </Paragraph>
      </Row>
      <Row align="middle">
        <Button style={{ border: "none" }} onClick={likePost}>
          {!isEmpty(checkLike) ? (
            <HeartFilled style={{ fontSize: "25px" }} />
          ) : (
            <HeartOutlined style={{ fontSize: "25px" }} />
          )}
        </Button>
        <Text>{props.data.likeCount} likes</Text>
        <CommentOutlined style={{ fontSize: "25px", marginLeft: "20px" }} />
        <Text>&nbsp;{props.data.commentCount} comments</Text>
      </Row>
      <Divider />
      <Row>
        <Input
          bordered={false}
          // onPressEnter={console.log("click")}
          placeholder="Add a comment…"
          suffix={
            <Button>
              <SendOutlined />
            </Button>
          }
        />
      </Row>
    </Card>
  );
};

export default Post;

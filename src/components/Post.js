import React, { useState } from "react";
import { Card, Avatar, Row, Typography, Input, Button, Form } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  CommentOutlined,
  SendOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useFirestoreConnect,
  isLoaded,
  isEmpty,
  useFirestore,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import Likes from "./Likes";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";

const { Text, Paragraph } = Typography;

const Post = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const checkLike = useSelector((state) => state.firestore.data.checkLike);
  const [likesVisibility, setLikesVisibility] = useState(false);
  useFirestoreConnect([
    {
      collection: "likes",
      where: [
        ["postId", "==", props.data.id],
        ["userId", "==", auth.uid || null],
      ],
      storeAs: `checkLike`,
    },
  ]);

  // check if the post is liked or not
  // act accordingly
  // TODO add notification to the post owner
  const likePost = () => {
    if (!isEmpty(auth) && isLoaded(auth)) {
      if (isLoaded(checkLike) && isEmpty(checkLike)) {
        firestore
          .collection("likes")
          .add({
            postId: props.data.id,
            userId: auth.uid,
            userName: profile.username,
            photoURL: profile.photoURL,
          })
          .then(() => {
            firestore
              .collection("posts")
              .doc(props.data.id)
              .update({ likeCount: props.data.likeCount + 1 });
          })
          .then(() => {
            if (props.data.userId !== auth.uid) {
              // CHECK FOR OWN POST
              firestore.collection("notifications").add({
                photoURL: profile.photoURL || null,
                username: profile.username,
                type: "liked",
                createdAt: firestore.FieldValue.serverTimestamp(),
                postId: props.data.id,
                recipientId: props.data.userId,
                seen: false,
              });
            }
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
    }
  };

  const onChange = (str) => {
    firestore
      .collection("posts")
      .doc(props.data.id)
      .update({ description: str });
  };

  const deletePost = () => {
    firestore.collection("posts").doc(props.data.id).delete();
  };

  const onFinishComment = (values) => {
    firestore
      .collection("comments")
      .add({
        comment: values.comment,
        createdAt: new Date().toISOString(),
        postId: props.data.id,
        userImage: profile.photoURL,
        userId: auth.uid,
        userName: profile.username,
      })
      .then(() => {
        form.resetFields();
        firestore
          .collection("posts")
          .doc(props.data.id)
          .update({ commentCount: props.data.commentCount + 1 })
          .then(() => {
            if (props.data.userId !== auth.uid) {
              // CHECK FOR OWN POST
              firestore.collection("notifications").add({
                photoURL: profile.photoURL || null,
                username: profile.username,
                type: "commented",
                timestamp: new Date().toISOString(),
                postId: props.data.id,
                recipientId: props.data.userId,
                seen: false,
              });
            }
          });
      });
  };

  return (
    <Card
      hoverable
      style={styles.card}
      cover={
        <img
          alt="example"
          onClick={() => history.push(`/p/${props.data.id}`)}
          src={props.data.imageURL}
        />
      }
    >
      {/* LIKES MODAL */}
      <Modal
        onCancel={() => {
          setLikesVisibility(false);
        }}
        footer={null}
        title="Likes"
        visible={likesVisibility}
      >
        <Likes postId={props.data.id} />
      </Modal>

      {/* USER DATA */}
      <Row
        align="middle"
        onClick={() => history.push(`/u/${props.data.userId}`)}
      >
        <Avatar size={40} src={props.data.profilePicture} />
        <Text strong>&nbsp;&nbsp;{props.data.userName}</Text>
        <Text type="secondary">
          &nbsp; <Moment fromNow>{props.data.timestamp}</Moment>
        </Text>
        {props.data.userId === auth.uid ? (
          <Button style={styles.deleteButton} onClick={deletePost}>
            <DeleteOutlined />
          </Button>
        ) : null}
      </Row>

      <Row>
        {props.data.userId === auth.uid ? (
          <Paragraph
            editable={{ onChange: onChange }}
            style={styles.description}
          >
            {props.data.description}
          </Paragraph>
        ) : (
          <Paragraph style={styles.description}>
            {props.data.description}
          </Paragraph>
        )}
      </Row>

      <Row align="middle" style={styles.statisticsRow}>
        {/* STATISTICS */}
        <Button style={styles.statsButton} onClick={likePost}>
          {!isEmpty(checkLike) ? (
            <HeartFilled style={styles.likeButton} />
          ) : (
            <HeartOutlined style={styles.likeButton} />
          )}
        </Button>
        <Text onClick={() => setLikesVisibility(true)}>
          {props.data.likeCount} Likes
        </Text>
        <Button
          style={styles.statsButton}
          onClick={() => history.push(`/p/${props.data.id}`)}
        >
          <CommentOutlined style={styles.commentButton} />
        </Button>
        <Text onClick={() => history.push(`/p/${props.data.id}`)}>
          {props.data.commentCount} Comments
        </Text>
      </Row>

      {/* WRITE COMMENT */}
      {isLoaded(auth) && !isEmpty(auth) ? (
        <Row>
          <Form
            form={form}
            style={styles.commentInput}
            name="basic"
            onFinish={onFinishComment}
          >
            <Form.Item name="comment" rules={[{ required: false }]}>
              <Input
                bordered={false}
                placeholder="Add a comment…"
                suffix={
                  <Button onClick={() => form.submit()}>
                    <SendOutlined />
                  </Button>
                }
              />
            </Form.Item>
          </Form>
        </Row>
      ) : null}
    </Card>
  );
};

const styles = {
  card: { maxWidth: 614, marginTop: "20px" },
  statsButton: { border: "none", padding: "0 0 0 0", marginRight: "10px" },
  commentButton: { fontSize: "25px", marginLeft: "20px" },
  likeButton: { fontSize: "25px" },
  commentInput: { width: "100%", marginTop: "20px" },
  statisticsRow: { marginTop: "10px" },
  deleteButton: { border: "none" },
  description: {
    marginTop: "10px",
    textAlign: "left",
    width: "100%",
    marginBottom: "10px",
  },
};

export default Post;

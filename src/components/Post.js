import React, { useState } from "react";
import {
  Card,
  Avatar,
  Row,
  Typography,
  Divider,
  Input,
  Button,
  Form,
} from "antd";
import {
  HeartFilled,
  HeartOutlined,
  CommentOutlined,
  SendOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
          .update({ commentCount: props.data.commentCount + 1 });
      });
  };

  return (
    <Card
      hoverable
      style={{ maxWidth: 614, marginTop: "20px" }}
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
      <Row align="middle">
        <Avatar size={40} src={props.data.profilePicture} />
        <Text strong>&nbsp;&nbsp;{props.data.userName}</Text>
        <Text>
          &nbsp;&nbsp; {dayjs(props.data.timestamp).format("MMM YYYY")}
        </Text>
        {props.data.userId === auth.uid ? (
          <Button style={{ border: "none" }} onClick={deletePost}>
            <DeleteOutlined />
          </Button>
        ) : null}
      </Row>
      <Row>
        {props.data.userId === auth.uid ? (
          <Paragraph
            editable={{ onChange: onChange }}
            style={{
              marginTop: "20px",
              textAlign: "left",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            {props.data.description}
          </Paragraph>
        ) : (
          <Paragraph
            style={{
              marginTop: "20px",
              textAlign: "left",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            {props.data.description}
          </Paragraph>
        )}
      </Row>
      <Row align="middle">
        <Button style={{ border: "none" }} onClick={likePost}>
          {!isEmpty(checkLike) ? (
            <HeartFilled style={{ fontSize: "25px" }} />
          ) : (
            <HeartOutlined style={{ fontSize: "25px" }} />
          )}
        </Button>
        <Text onClick={() => setLikesVisibility(true)}>
          {props.data.likeCount} Likes
        </Text>
        <CommentOutlined style={{ fontSize: "25px", marginLeft: "20px" }} />
        <Text>&nbsp;{props.data.commentCount} Comments</Text>
      </Row>
      {isLoaded(auth) && !isEmpty(auth) ? <Divider /> : null}
      {isLoaded(auth) && !isEmpty(auth) ? (
        <Row>
          <Form
            form={form}
            style={{ width: "100%" }}
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

export default Post;

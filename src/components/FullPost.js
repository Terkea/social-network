import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Row,
  Typography,
  Divider,
  Input,
  Button,
  Form,
  Col,
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
import Comment from "./Comment";
import { useSelector } from "react-redux";

const { Title, Text, Paragraph } = Typography;

const Post = (props) => {
  const [form] = Form.useForm();
  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const checkLike = useSelector((state) => state.firestore.data.checkLike);
  const [pictureWidth, setPictureWidth] = useState();
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

  useEffect(() => {
    let img = new Image();
    img.onload = () => {
      setPictureWidth(img.height);
    };
    img.src = props.data.imageURL;
    console.log(pictureWidth);
  }, [props.data.imageURL, pictureWidth]);

  //   console.log(pictureHeight);

  // check if the post is liked or not
  // act accordingly
  // TODO add notification to the post owner
  const likePost = () => {
    if (!isEmpty(auth) && isLoaded(auth)) {
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
    }
  };

  const onChange = (str) => {
    console.log(str);
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
      bodyStyle={{ border: "none", padding: 0 }}
      hoverable
      bordered={false}
      style={{ marginTop: "20px" }}
    >
      <Row>
        {/* LEFT SIDE */}
        <Col md={16} xs={24}>
          <img
            alt="Sex"
            // src="https://firebasestorage.googleapis.com/v0/b/changemymind-ce330.appspot.com/o/no-img.jpg?alt=media"
            src={props.data.imageURL}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </Col>
        {/* RIGHT SIDE */}
        <Col md={8} xs={24}>
          {/* POST DATA */}
          <Row style={{ alignItems: "flex-end", marginLeft: "10px" }}>
            <Avatar size={40} src={props.data.profilePicture} />
            <Title level={4} strong style={{ marginLeft: "10px" }}>
              {props.data.userName}
            </Title>
            <Title level={4} type="secondary" style={{ marginLeft: "10px" }}>
              {dayjs(props.data.timestamp).format("MMM YYYY")}
            </Title>
            {props.data.userId === auth.uid ? (
              <Button style={{ border: "none" }} onClick={deletePost}>
                <DeleteOutlined />
              </Button>
            ) : (
              "Follow"
            )}
          </Row>
          {/* DESCRIPTION */}
          <Row style={{ marginLeft: "10px" }}>
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
          {/* <Divider /> */}

          {/* COMMENTS */}

          <Row
            style={{
              height: `${280}px`,
              overflowY: "scroll",
              scrollbarWidth: "none",
              marginLeft: "10px",
            }}
          >
            <Comment
              style={{ paddingTop: "12px" }}
              data={{
                timestamp: "2020-08-14T06:05:44.498Z",
                comment:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of L",
                userName: "Oops",
                userImage:
                  "https://firebasestorage.googleapis.com/v0/b/social-network-32715.appspot.com/o/avatar%2F648f71-d4b7-d433-7fed-3b51a2804ce.jpg?alt=media",
              }}
            />
          </Row>
          <Divider />

          {/* STATISTICS */}
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

          {/* ADD COMMENT */}
          <Divider />
          {isLoaded(auth) && !isEmpty(auth) ? (
            <Row>
              <Form
                form={form}
                style={{ width: "95%" }}
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
        </Col>
      </Row>
    </Card>
  );
};

export default Post;

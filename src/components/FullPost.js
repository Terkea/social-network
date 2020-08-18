import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  List,
  Skeleton,
  Tooltip,
} from "antd";
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
import Comment from "./Comment";
import { useSelector } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import Likes from "./Likes";
import Moment from "react-moment";
const { Title, Text, Paragraph } = Typography;

const Post = (props) => {
  const { postId } = props.match.params;
  const [form] = Form.useForm();
  const firestore = useFirestore();
  // GRAB THE USER AND HIS PROFILE
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const checkLike = useSelector((state) => state.firestore.data.checkLike);
  // STRUCTURE: OBJECT COMPOSED OF COMMENT OBJECTS
  const comments = useSelector((state) => state.firestore.data.comments);
  // GRAB THE POST BY THE PROPS.POSTID VALUE
  const currentPost = useSelector(
    ({ firestore: { data } }) => data.posts && data.posts[postId]
  );

  // MODALS HOOK
  const [likesVisibility, setLikesVisibility] = useState(false);
  const [profileModalVisibility, setProfileModalVisibility] = useState(true);
  useFirestoreConnect([
    {
      collection: "likes",
      where: [
        ["postId", "==", postId],
        ["userId", "==", auth.uid || null],
      ],
      storeAs: `checkLike`,
    },
    {
      collection: "posts",
      doc: postId,
    },
    {
      collection: "comments",
      where: [["postId", "==", postId]],
      stoareAs: "comments",
      // queryParams: ["orderByChild=createdAt"],
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
            postId: postId,
            userId: auth.uid,
            userName: profile.username,
            photoURL: profile.photoURL,
          })
          .then(() => {
            firestore
              .collection("posts")
              .doc(postId)
              .update({ likeCount: currentPost.likeCount + 1 });
          })
          .then(() => {
            if (currentPost.userId !== auth.uid) {
              // CHECK FOR OWN POST
              firestore.collection("notifications").add({
                photoURL: profile.photoURL || null,
                username: profile.username,
                type: "liked",
                createdAt: firestore.FieldValue.serverTimestamp(),
                postId: postId,
                recipientId: currentPost.userId,
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
              .doc(postId)
              .update({ likeCount: currentPost.likeCount - 1 });
          });
      }
    }
  };

  const onChange = (str) => {
    firestore.collection("posts").doc(postId).update({ description: str });
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
        postId: postId,
        userImage: profile.photoURL,
        userId: auth.uid,
        userName: profile.username,
      })
      .then(() => {
        form.resetFields();
        firestore
          .collection("posts")
          .doc(postId)
          .update({ commentCount: currentPost.commentCount + 1 });
      })
      .then(() => {
        if (currentPost.userId !== auth.uid) {
          // CHECK FOR OWN POST
          firestore.collection("notifications").add({
            photoURL: profile.photoURL || null,
            username: profile.username,
            type: "commented",
            createdAt: firestore.FieldValue.serverTimestamp(),
            postId: postId,
            recipientId: currentPost.userId,
            seen: false,
          });
        }
      });
  };

  return (
    <Modal
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        setProfileModalVisibility(false);
        props.history.goBack();
      }}
      width={900}
      closable={false}
      footer={null}
      visible={profileModalVisibility}
    >
      <Card
        bodyStyle={{ border: "none", padding: 0, maxHeight: "600px" }}
        hoverable
        bordered={false}
        style={{ marginTop: "20px" }}
      >
        {isLoaded(currentPost) && !isEmpty(currentPost) ? (
          <Row>
            {/* LIKES MODAL */}
            <Modal
              onCancel={() => {
                setLikesVisibility(false);
              }}
              footer={null}
              title="Likes"
              visible={likesVisibility}
            >
              <Likes postId={postId} />
            </Modal>
            {/* LEFT SIDE */}
            <Col md={16} xs={24}>
              <img
                alt={currentPost.description}
                src={currentPost.imageURL}
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
              <Row
                align="middle"
                justify="start"
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                <Avatar size={40} src={currentPost.profilePicture} />
                <Text strong>&nbsp;&nbsp;{currentPost.userName}</Text>
                <Text type="secondary">
                  &nbsp; <Moment fromNow>{currentPost.timestamp}</Moment>
                </Text>

                {currentPost.userId === auth.uid ? (
                  <Button style={{ border: "none" }} onClick={deletePost}>
                    <DeleteOutlined />
                  </Button>
                ) : null}
              </Row>

              {/* DESCRIPTION */}

              {currentPost.userId === auth.uid ? (
                <Paragraph
                  id="descriptionDiv"
                  editable={{ onChange: onChange }}
                  style={{
                    marginTop: "10px",
                    textAlign: "left",
                    marginLeft: "10px",
                    width: "90%",
                  }}
                >
                  {currentPost.description}
                </Paragraph>
              ) : (
                <Paragraph
                  id="descriptionDiv"
                  style={{
                    marginTop: "10px",
                    textAlign: "left",
                    marginLeft: "10px",
                    width: "90%",
                  }}
                >
                  {currentPost.description}
                </Paragraph>
              )}

              <Divider style={{ margin: "0 0 0 0" }} />

              {/* COMMENTS */}

              {!isEmpty(comments) ? (
                <Row
                  style={{
                    height: `${
                      400 -
                        document.getElementById("descriptionDiv")
                          .clientHeight || 0
                    }px`,
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    marginLeft: "10px",
                  }}
                >
                  {isLoaded(comments) && !isEmpty(comments)
                    ? Object.entries(comments).map((comment) => {
                        return (
                          <Comment
                            style={{ paddingTop: "12px" }}
                            // [0] -> doc id
                            key={comment[0]}
                            id={comment[0]}
                            commentCount={currentPost.commentCount}
                            // [1] -> doc data
                            data={comment[1]}
                          />
                        );
                      })
                    : null}
                </Row>
              ) : (
                <div style={{ height: "270px" }}></div>
              )}
              <Divider style={{ margin: "10px 10px 10px 10px" }} />

              {/* STATISTICS */}
              <Row align="middle">
                <Button style={{ border: "none" }} onClick={likePost}>
                  {!isEmpty(checkLike) ? (
                    <HeartFilled style={{ fontSize: "25px" }} />
                  ) : (
                    <HeartOutlined style={{ fontSize: "25px" }} />
                  )}
                </Button>
                <Text onClick={() => setLikesVisibility(true)}>
                  {currentPost.likeCount} Likes
                </Text>
                <Button style={{ border: "none" }}>
                  <CommentOutlined
                    style={{ fontSize: "25px", marginLeft: "20px" }}
                  />
                </Button>
                <Text>{currentPost.commentCount} Comments</Text>
              </Row>

              {/* ADD COMMENT */}
              {/* <Divider /> */}
              {isLoaded(auth) && !isEmpty(auth) ? (
                <Row style={{ marginTop: "8px" }}>
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
        ) : (
          <Row justify="center">
            <Skeleton.Image style={{ width: 600 }} />
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </Row>
        )}
      </Card>
    </Modal>
  );
};

export default Post;

import React, { useState, useEffect, useRef } from "react";
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
  Skeleton,
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
const { Text, Paragraph } = Typography;

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

  // THE SIZE OF THE COMMENTS ROW DEPENDS ON THE HEIGHT OF THE DESCRIPTION
  // TO FIT RIGHT IN AND SCALE DYNAMICALLY BASED ON THE HEIGHT OF THE DESCRIPTION
  // WE HAVE TO GET THE DIV HEIGHT VALUE
  const ref = useRef();
  const [height, setHeight] = useState(0);
  useEffect(() => {
    try {
      setHeight(ref.current.clientHeight);
    } catch {}
  });

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
        bodyStyle={styles.cardBody}
        hoverable
        bordered={false}
        style={styles.card}
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
                style={styles.postImage}
              />
            </Col>
            {/* RIGHT SIDE */}
            <Col md={8} xs={24}>
              {/* POST DATA */}
              <Row align="middle" justify="start" style={styles.postData}>
                <Avatar size={40} src={currentPost.profilePicture} />
                <Text strong>&nbsp;&nbsp;{currentPost.userName}</Text>
                <Text type="secondary">
                  &nbsp; <Moment fromNow>{currentPost.timestamp}</Moment>
                </Text>

                {currentPost.userId === auth.uid ? (
                  <Button style={styles.borderlessButton} onClick={deletePost}>
                    <DeleteOutlined />
                  </Button>
                ) : null}
              </Row>

              {/* DESCRIPTION */}

              <Row ref={ref}>
                {currentPost.userId === auth.uid ? (
                  <Paragraph
                    editable={{ onChange: onChange }}
                    style={styles.description}
                  >
                    {currentPost.description}
                  </Paragraph>
                ) : (
                  <Paragraph style={styles.description}>
                    {currentPost.description}
                  </Paragraph>
                )}
              </Row>
              <Divider style={styles.dividerBelowDescription} />

              {/* COMMENTS */}
              {!isEmpty(comments) ? (
                <Row
                  style={{
                    height: `${390 - height}px`,
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    marginLeft: "10px",
                  }}
                >
                  {isLoaded(comments) && !isEmpty(comments)
                    ? Object.entries(comments).map((comment) => {
                        return (
                          <Comment
                            style={styles.comment}
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
                <div style={styles.placeholderComments}></div>
              )}

              <Divider style={styles.dividerBelowComments} />

              {/* STATISTICS */}
              <Row align="middle">
                <Button style={styles.borderlessButton} onClick={likePost}>
                  {!isEmpty(checkLike) ? (
                    <HeartFilled style={styles.likeButton} />
                  ) : (
                    <HeartOutlined style={styles.likeButton} />
                  )}
                </Button>
                <Text onClick={() => setLikesVisibility(true)}>
                  {currentPost.likeCount} Likes
                </Text>
                <Button style={styles.borderlessButton}>
                  <CommentOutlined style={styles.commentsButton} />
                </Button>
                <Text>{currentPost.commentCount} Comments</Text>
              </Row>

              {/* ADD COMMENT */}
              {isLoaded(auth) && !isEmpty(auth) ? (
                <Row style={styles.inputRow}>
                  <Form
                    form={form}
                    style={styles.inputForm}
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

const styles = {
  cardBody: { border: "none", padding: 0, maxHeight: "600px" },
  card: { marginTop: "20px" },
  postImage: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  postData: { marginTop: "10px", marginLeft: "10px" },
  borderlessButton: { border: "none" },
  description: {
    marginTop: "10px",
    textAlign: "left",
    marginLeft: "10px",
    width: "90%",
  },
  dividerBelowDescription: { margin: "0 0 0 0" },
  dividerBelowComments: { margin: "10px 10px 10px 10px" },
  comment: { paddingTop: "12px" },
  placeholderComments: { height: "270px" },
  likeButton: { fontSize: "25px" },
  commentsButton: { fontSize: "25px", marginLeft: "20px" },
  inputRow: { marginTop: "8px" },
  inputForm: { width: "95%" },
};

export default Post;

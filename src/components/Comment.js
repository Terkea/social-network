import React from "react";
import { Row, Col, Avatar, Space, Typography, Button } from "antd";
import { useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { useFirestore, isLoaded, isEmpty } from "react-redux-firebase";
import Moment from "react-moment";
const Comment = (props) => {
  const { Text } = Typography;
  const auth = useSelector((state) => state.firebase.auth);
  const firestore = useFirestore();

  const deleteComment = () => {
    firestore
      .collection("comments")
      .doc(props.id)
      .delete()
      .then(() => {
        firestore
          .collection("posts")
          .doc(props.data.postId)
          .update({ commentCount: props.commentCount - 1 });
      });
  };

  return (
    <>
      {!isEmpty(props.data) ? (
        <Row style={{ marginTop: "12px", width: "100%" }}>
          <Col span={5}>
            <Avatar size={40} src={props.data.userImage} />
          </Col>
          <Col span={19}>
            <Text>
              <Text strong>{props.data.userName}</Text> {props.data.comment}
            </Text>
            <Text type="secondary">
              {"  "}
              <Moment fromNow>{props.data.createdAt}</Moment>
            </Text>
            {props.data.userId === auth.uid ? (
              <Button style={{ border: "none" }} onClick={deleteComment}>
                <DeleteOutlined />
              </Button>
            ) : null}
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default Comment;

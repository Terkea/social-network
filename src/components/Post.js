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

const { Text, Paragraph } = Typography;

const Post = (props) => {
  const [like, setLike] = useState(false);
  console.log(props);
  return (
    <Card
      hoverable
      style={{ width: 614, marginTop: "20px" }}
      cover={<img alt="example" src={props.data.imageURL} />}
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
        <Button style={{ border: "none" }} onClick={() => setLike(!like)}>
          {like ? (
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
          onPressEnter={console.log("click")}
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

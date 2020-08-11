import React from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Divider,
  Input,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  HeartOutlined,
  CommentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const Post = (props) => {
  return (
    <Card
      style={{ width: 614 }}
      cover={
        <img
          alt="example"
          src="https://www.ox.ac.uk/sites/files/oxford/styles/ow_medium_feature/public/field/field_image_main/forest.jpg?itok=X7dckG0T"
        />
      }
    >
      <Row align="middle">
        <Avatar
          size={40}
          src="https://firebasestorage.googleapis.com/v0/b/social-network-32715.appspot.com/o/avatar%2F7a8a684-c177-bbde-5a74-5510b3f218.jpg?alt=media&token=c2b8f899-8dd7-4c3b-a870-4413852acaf2"
        />
        <Text strong>&nbsp;&nbsp; Georgica</Text>
        <Text>&nbsp;&nbsp; 1 hour ago</Text>
      </Row>
      <Row>
        <Paragraph style={{ marginTop: "20px", textAlign: "left" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book...
        </Paragraph>
      </Row>
      <Row align="middle">
        <HeartOutlined style={{ fontSize: "25px" }} />
        <Text>&nbsp; 20 likes</Text>
        <CommentOutlined style={{ fontSize: "25px", marginLeft: "20px" }} />
        <Text>&nbsp; 6 comments</Text>
      </Row>
      <Divider />
      <Row>
        <Input placeholder="Add a comment…" suffix={<SendOutlined />} />
      </Row>
    </Card>
  );
};

export default Post;

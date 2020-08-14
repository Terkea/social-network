import React from "react";
import { Row, Col, Avatar, Space, Typography } from "antd";

const Comment = (props) => {
  const { Text } = Typography;
  return (
    <>
      <Col span={4}>
        <Avatar size={40} src={props.data.userImage} />
      </Col>
      <Col span={15}>
        <Space direction="vertical">
          <Text>
            <Text strong>{props.data.userName}</Text> {props.data.comment}
          </Text>
          <Text type="secondary">{props.data.timestamp}</Text>
        </Space>
      </Col>
    </>
  );
};

export default Comment;

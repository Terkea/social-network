import React, { useState } from "react";
import {
  Input,
  Form,
  Row,
  Col,
  Typography,
  Avatar,
  Modal,
  Card,
  Tooltip,
  Button,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  EditOutlined,
  AimOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import FullPost from "./FullPost";
const Test = () => {
  const [form] = Form.useForm();
  const [profileModalVisibility, setProfileModalVisibility] = useState(true);

  const onOkModalProfile = () => {
    form.submit();
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Modal
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        setProfileModalVisibility(false);
      }}
      width={900}
      closable={false}
      footer={null}
      visible={profileModalVisibility}
    >
      <FullPost postId={"YfQRYe7EPScpdjIAJXky"} />
    </Modal>
  );
};

export default Test;

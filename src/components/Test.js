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
import gothAss from "./b59d3081238ebbd0f7eaa3cc4a2c8922.jpg";
const Test = () => {
  const [form] = Form.useForm();
  const [profileModalVisibility, setProfileModalVisibility] = useState(true);

  const onOkModalProfile = () => {
    form.submit();
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const data = {
    commentCount: 9,
    description: "muie",
    id: "YfQRYe7EPScpdjIAJXky",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/social-network-32715.appspot.com/o/avatar%2Fb47d2dd-d45f-0ace-5685-372bc1407dd.jpg?alt=media&token=485f18f4-377c-4e50-9e92-55af8a670554",
    likeCount: 7,
    profilePicture:
      "https://firebasestorage.googleapis.com/v0/b/social-network-32715.appspot.com/o/avatar%2Fa303c26-46c6-4154-0247-5f6fb7774fe.jpg?alt=media&token=ad547c20-c237-413f-9a55-86cdaf53235a",
    timestamp: new Date(),
    userId: "IEq5EJezrpgezp7JzsDWMKrYuhV2",
    userName: "Georgica",
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
      data={data}
      visible={profileModalVisibility}
    >
      <FullPost data={data} />
    </Modal>
  );
};

export default Test;

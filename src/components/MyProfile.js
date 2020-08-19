import React, { useEffect, useState } from "react";

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

// import ChangePassword from "./CustomModal";
import { runNotifications } from "../helpers/Notification";
import UploadProfilePicture from "./UploadProfilePicture";
import { connect, useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const MyProfile = (props) => {
  const firebase = useFirebase();
  const profile = useSelector((state) => state.firebase.profile);
  const auth = useSelector((state) => state.firebase.auth);
  const history = useHistory();
  // ANTD FORM INPUT TRICKERY
  // https://stackoverflow.com/a/61244400/8193864
  // https://stackoverflow.com/a/62855456/8193864

  const [form] = Form.useForm();
  const [profileModalVisibility, setProfileModalVisibility] = useState(false);

  useEffect(() => {
    // Set up the default values for the inputs
    form.setFieldsValue({
      newEmail: profile.email,
      displayName: profile.username,
      bio: profile.bio,
      website: profile.website,
      location: profile.location,
    });

    if (props.authError) {
      runNotifications(props.authError.message, "ERROR");
    }
  }, [
    form,
    profile.bio,
    profile.email,
    profile.username,
    profile.location,
    profile.website,
    profile.createdAt,
    profile.photoURL,
    props.authError,
  ]);

  const onFinish = (values) => {
    firebase
      .updateProfile({
        username: values.displayName,
        bio: values.bio,
        location: values.location,
        website: values.website,
      })
      .then(() => {
        runNotifications("Profile updated", "SUCCESS");
        setProfileModalVisibility(false);
      })
      .catch((e) => {
        runNotifications(e.message, "ERROR");
      });
  };

  const onOkModalProfile = () => {
    form.submit();
  };

  const resetPassword = () => {
    firebase.resetPassword(profile.email).then(() => {
      runNotifications(
        `Please check ${profile.email} for a link to reset your password.`,
        "SUCCESS"
      );
    });
  };

  const logoutOnClick = (e) => {
    e.preventDefault();
    firebase.logout();
  };

  return (
    <Row>
      <Modal
        forceRender
        title="Update profile"
        visible={profileModalVisibility}
        onOk={onOkModalProfile}
        onCancel={() => {
          setProfileModalVisibility(false);
        }}
      >
        <Form
          name="profile"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Display name"
            name="displayName"
            rules={[
              {
                required: true,
                message: "Please input your display name!",
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[
              {
                required: false,
                message: "Please input your website!",
              },
            ]}
          >
            <Input prefix={<LinkOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[
              {
                required: false,
                message: "Please input your location!",
              },
            ]}
          >
            <Input prefix={<AimOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            label="Bio"
            name="bio"
            rules={[
              {
                required: false,
                message: "Please input your bio!",
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
        </Form>
      </Modal>

      <Card
        style={{ width: "100%" }}
        hoverable
        actions={[
          <Tooltip title="Log out">
            <LogoutOutlined onClick={logoutOnClick} key="logout" />
          </Tooltip>,
          <Tooltip
            onClick={() => {
              setProfileModalVisibility(true);
            }}
            title="Edit profile"
          >
            <EditOutlined key="edit" />
          </Tooltip>,
          <Tooltip onClick={resetPassword} title="Update password">
            <LockOutlined key="ellipsis" />
          </Tooltip>,
        ]}
      >
        <Col span={24}>
          <Row align="center">
            <Avatar
              align="middle"
              src={profile.photoURL}
              onClick={() => history.push(`/u/${auth.uid}`)}
              size={256}
              icon={<UserOutlined />}
            />
          </Row>
          <Row style={styles.UploadProfilePictureRow} align="center">
            <UploadProfilePicture />
          </Row>
          <Title style={styles.title} align="center" level={4}></Title>
          <Row>
            <Col span={24}>
              <Title strong align="center" level={4}>
                {profile.username === "" ? "unknown" : profile.username}
              </Title>
              {profile.bio ? (
                <Paragraph align="center" level={4}>
                  {profile.bio}
                </Paragraph>
              ) : (
                <Paragraph align="center" level={4}>
                  Apparently, this user prefers to keep an air of mystery about
                  them.
                </Paragraph>
              )}
              {profile.location ? (
                <Paragraph align="center" level={4}>
                  <AimOutlined />
                  &nbsp;{profile.location}
                </Paragraph>
              ) : null}
              {profile.website ? (
                <Paragraph align="center" level={4}>
                  <LinkOutlined />
                  &nbsp;{profile.website}
                </Paragraph>
              ) : null}

              {auth.createdAt ? (
                <Paragraph align="center" level={4}>
                  <CalendarOutlined />
                  &nbsp; Joined <Moment fromNow>{profile.createdAt}</Moment>
                </Paragraph>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Card>
    </Row>
  );
};

const enhance = connect(
  // Map redux state to component props
  ({ firebase: { authError } }) => ({
    authError,
  })
);

const styles = {
  UploadProfilePictureRow: { marginTop: "20px" },
  title: {
    marginBottom: "30px",
    marginTop: "30px",
    maxHeight: "20px",
  },
};

export default enhance(MyProfile);

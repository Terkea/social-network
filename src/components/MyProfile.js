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

import { useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/user";

import dayjs from "dayjs";

// import ChangePassword from "./CustomModal";
import { runNotifications } from "../helpers/Notification";
import UploadProfilePicture from "./UploadProfilePicture";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MyProfile = (props) => {
  // ANTD FORM INPUT TRICKERY
  // https://stackoverflow.com/a/61244400/8193864
  // https://stackoverflow.com/a/62855456/8193864

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [currentEmail, setCurrentEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentDisplayName, setCurrentDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [passwordModalVisibility, setPasswordModalVisibility] = useState(false);
  const [profileModalVisibility, setProfileModalVisibility] = useState(false);

  const styles = {
    logo: {
      fontSize: "100px",
      width: "100%",
      marginBottom: "30px",
    },
    mainRow: {
      height: "50vh",
      paddingTop: "30px",
    },
  };

  const history = useHistory();
  useEffect(() => {
    // Check if the user is authenticated
    if (props.isAuthenticated) {
      history.push("/");
    }

    // Assign the values with hooks since without it'd crash cuz the app is initialized with a null payload
    try {
      setCurrentEmail(props.payload.user.providerData[0].email);
      setAvatar(props.payload.user.providerData[0].photoURL);
      setCurrentDisplayName(props.payload.user.providerData[0].displayName);
      setBio(props.payload.userProfile.data.bio);
      setLocation(props.payload.userProfile.data.location);
      setWebsite(props.payload.userProfile.data.website);
      setRegistrationDate(
        dayjs(props.payload.userProfile.data.createdAt).format("MMM YYYY")
      );

      // console.log(props.payload.userProfile.bio);

      // Set up the default values for the inputs
      form.setFieldsValue({
        newEmail: currentEmail,
        displayName: currentDisplayName,
        bio: bio,
        website: website,
        location: location,
      });
    } catch (error) {}
  }, [
    currentDisplayName,
    currentEmail,
    form,
    form2,
    history,
    props.isAuthenticated,
    props.payload,
    bio,
    location,
    website,
    registrationDate,
  ]);

  const onFinish = (values) => {
    props.updateUserProfile(
      {
        displayName: values.displayName,
        newEmail: values.newEmail || currentEmail,
        oldEmail: props.payload.user.email,
        password: values.current_password,
        photoURL: values.photoURL,
        bio: values.bio,
        website: values.website,
        location: values.location,
        docId: props.payload.userProfile.docId,
      },
      runNotifications
    );
    setProfileModalVisibility(false);
  };

  const onOkModalPassword = () => {
    form2.submit();
  };

  const onOkModalProfile = () => {
    form.submit();
  };

  const onFinishModalPassword = (values) => {
    props.updateUserPassword(
      {
        email: props.payload.user.email,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      runNotifications
    );
    setPasswordModalVisibility(false);
  };

  const logoutOnClick = (e) => {
    e.preventDefault();
    history.push("/logout");
  };

  return (
    <Row>
      <Modal
        title="Change password"
        visible={passwordModalVisibility}
        onOk={onOkModalPassword}
        onCancel={() => {
          setPasswordModalVisibility(false);
        }}
      >
        <LockOutlined style={styles.logo} />
        <Text type="secondary">
          If you only use words from a dictionary or a purely numeric password,
          a hacker only has to try a limited list of possibilities.
        </Text>
        <Form
          style={{ marginTop: "20px" }}
          name="password"
          initialValues={{ remember: true }}
          onFinish={onFinishModalPassword}
          form={form2}
        >
          <Form.Item
            name="currentPassword"
            label="Current password"
            rules={[
              {
                required: true,
                message: "Please input your Current password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
            />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input the new password!" },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
            />
          </Form.Item>
          <Form.Item
            name="newPasswordConfirm"
            label="New password confirm"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
            />
          </Form.Item>
        </Form>
      </Modal>

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
            label="E-mail address"
            name="newEmail"
            rules={[{ required: false, message: "Please input your E-mail!" }]}
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
            <Input prefix={<LinkOutlined className="site-form-item-icon" />} />
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
          <Form.Item
            label="Current password"
            name="current_password"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
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
          <Tooltip
            onClick={() => {
              setPasswordModalVisibility(true);
            }}
            title="Update password"
          >
            <LockOutlined key="ellipsis" />
          </Tooltip>,
        ]}
      >
        <Col span={24}>
          <Row align="center">
            <Avatar
              align="middle"
              src={avatar}
              size={256}
              icon={<UserOutlined />}
            />
          </Row>
          <Row style={{ marginTop: "20px" }} align="center">
            <UploadProfilePicture />
          </Row>
          <Title
            style={{
              marginBottom: "30px",
              marginTop: "30px",
              maxHeight: "20px",
            }}
            align="center"
            level={4}
          ></Title>
          <Row>
            <Col span={24}>
              <Title strong align="center" level={4}>
                {currentDisplayName === "" ? "unknown" : currentDisplayName}
              </Title>
              {location === "" ? null : (
                <Paragraph align="center" level={4}>
                  {bio}
                </Paragraph>
              )}

              {location === "" ? null : (
                <Paragraph align="center" level={4}>
                  <AimOutlined />
                  &nbsp;{location}
                </Paragraph>
              )}

              {website === "" ? null : (
                <Paragraph align="center" level={4}>
                  <LinkOutlined />
                  &nbsp;<Link to="">{website}</Link>
                </Paragraph>
              )}

              {registrationDate === "" ? null : (
                <Paragraph align="center" level={4}>
                  <CalendarOutlined />
                  &nbsp; Joined {registrationDate}
                </Paragraph>
              )}
            </Col>
          </Row>
        </Col>
      </Card>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    payload: state.user.payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (data, callback) =>
      dispatch(actions.updateProfile(data, callback)),
    updateUserPassword: (data, callback) =>
      dispatch(actions.updatePassword(data, callback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

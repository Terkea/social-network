import React, { useEffect, useState } from "react";
import { withRouter, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/user";

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  AutoComplete,
  Modal,
} from "antd";
import { LockOutlined, RocketOutlined, MailOutlined } from "@ant-design/icons";

import SvgBackground from "../containers/SvgBackground";
import { runNotifications } from "../helpers/Notification";

const { Title, Text } = Typography;

const styles = {
  heightForTheRow: {
    minHeight: "100%",
    background: "rgba(220, 220, 220, 0.2)",
  },
  logo: {
    fontSize: "100px",
    width: "100%",
    marginBottom: "30px",
  },
  loginButton: {
    width: "100%",
  },
};

const Login = (props) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  // Check if the user is authenticated
  useEffect(() => {
    if (props.isAuthenticated) {
      history.push("/");
    }
  });

  // E-mail autocomplete
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = (value) => {
    if (!value || value.search("@") !== -1) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com"].map(
          (domain) => `${value}${domain}`
        )
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  const onOkModal = () => {
    form.submit();
  };

  const onFinishModals = (values) => {
    // console.log(values);
    props.forgottenPassword(values.forgottenEmail, runNotifications);
    setModalVisibility(false);
  };

  const onFinish = (values) => {
    props.signInUser(values.email, values.password, runNotifications);
  };

  return (
    <SvgBackground>
      <Modal
        title="Change password"
        visible={modalVisibility}
        onOk={onOkModal}
        onCancel={() => {
          setModalVisibility(false);
          console.log("Something is fucked");
        }}
      >
        <LockOutlined style={styles.logo} />
        <Text type="secondary">
          Enter your email and we'll send you a link to get back into your
          account.
        </Text>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinishModals}
          form={form}
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            name="forgottenEmail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <AutoComplete options={websiteOptions} onChange={onWebsiteChange}>
              <Input
                placeholder="Email address"
                prefix={<MailOutlined className="site-form-item-icon" />}
              />
            </AutoComplete>
          </Form.Item>
        </Form>
      </Modal>

      <Row
        type="flex"
        justify="center"
        align="middle"
        style={styles.heightForTheRow}
      >
        <Col sm={14} md={14} lg={6}>
          <RocketOutlined style={styles.logo} />
          <Title align="middle">Login</Title>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <AutoComplete options={websiteOptions} onChange={onWebsiteChange}>
                <Input
                  placeholder="Email"
                  prefix={<MailOutlined className="site-form-item-icon" />}
                />
              </AutoComplete>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Link
                to="#"
                style={{ marginLeft: "30px" }}
                onClick={() => {
                  setModalVisibility(true);
                }}
              >
                Forgot password?
              </Link>
            </Form.Item>
          </Form>

          {/* error handling */}
          {/* {props.error ? <Text type="danger">{props.error}</Text> : null} */}
        </Col>
      </Row>
    </SvgBackground>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    payload: state.user.payload,
    isAuthenticated: state.user.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  //
  return {
    signInUser: (email, password, callback) =>
      dispatch(actions.signInUser(email, password, callback)),
    forgottenPassword: (email, callback) =>
      dispatch(actions.forgottenPassword(email, callback)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

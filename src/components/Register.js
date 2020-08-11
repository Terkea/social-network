import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import * as actions from "../store/actions/user";

import { Row, Col, Form, Input, Button, Typography, AutoComplete } from "antd";
import { LockOutlined, RocketOutlined, MailOutlined } from "@ant-design/icons";

import SvgBackground from "../containers/SvgBackground";
import { runNotifications } from "../helpers/Notification";

const { Title } = Typography;

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
  registerButton: {
    width: "100%",
  },
};

const Register = (props) => {
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
  const onFinish = (values) => {
    props.registerUser(values.email, values.password, runNotifications);
  };

  return (
    <SvgBackground>
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={styles.heightForTheRow}
      >
        <Col sm={14} md={14} lg={6}>
          <RocketOutlined style={styles.logo} />
          <Title align="middle">Register</Title>
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

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={styles.registerButton}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
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
    registerUser: (email, password, callback) =>
      dispatch(actions.registerUser(email, password, callback)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Register)
);

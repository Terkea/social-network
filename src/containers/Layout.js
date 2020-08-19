import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Badge, notification, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";
import {
  isEmpty,
  useFirestoreConnect,
  isLoaded,
  useFirestore,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { HomeOutlined, BellOutlined } from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import Moment from "react-moment";

const { Header, Content, Footer } = Layout;

const CustomLayout = (props) => {
  const { Text } = Typography;
  const history = useHistory();
  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  const [counter, setCounter] = useState(0);
  const notifications = useSelector(
    (state) => state.firestore.data.notifications
  );

  // MODALS HOOK
  useFirestoreConnect([
    {
      collection: "notifications",
      where: [
        ["recipientId", "==", auth.uid || null],
        ["seen", "==", false],
      ],
      limit: 10,
      // queryParams: ["orderByChild=createdAt"],
      stoareAs: "notifications",
    },
  ]);

  // var counter = 0;

  useEffect(() => {
    var i = 0;
    if (isLoaded(notifications) && !isEmpty(notifications)) {
      Object.entries(notifications).forEach((notification) => {
        if (notification[1].seen === false) {
          i += 1;
        }
      });
    }
    setCounter(i);
  }, [notifications]);

  const readNotifications = () => {
    if (isLoaded(notifications) && !isEmpty(notifications)) {
      Object.entries(notifications).forEach((notification) => {
        firestore
          .collection("notifications")
          .doc(notification[0])
          .update({ seen: true });
      });
    }
  };

  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["/"]}>
          <Menu.Item
            key="/"
            icon={<HomeOutlined style={{ marginLeft: "10px" }} />}
          >
            <Link to="/" />
          </Menu.Item>

          {!isEmpty(auth) ? (
            <Menu.Item
              key="notifications"
              icon={
                <Badge count={counter}>
                  <BellOutlined style={{ marginLeft: "10px" }} />
                </Badge>
              }
            >
              <Dropdown
                onClick={readNotifications}
                overlay={
                  <Menu>
                    {isLoaded(notifications) && !isEmpty(notifications) ? (
                      Object.entries(notifications).map((notification) => {
                        return (
                          <Menu.Item
                            key={notification[0]}
                            onClick={() => {
                              readNotifications();
                              history.push(`/p/${notification[1].postId}`);
                            }}
                          >
                            <Avatar
                              style={{ display: "inline-block" }}
                              size={20}
                              src={notification[1].photoURL || null}
                            />

                            <Text
                              style={{
                                display: "inline-block",
                                marginLeft: "10px",
                              }}
                            >
                              {notification[1].username}
                            </Text>
                            <Text> {notification[1].type} your post. </Text>
                            <Text type="secondary">
                              <Moment fromNow>
                                {notification[1].timestamp}
                              </Moment>
                            </Text>
                            {notification[1].seen === false ? (
                              <Text type="danger"> NEW!</Text>
                            ) : null}
                          </Menu.Item>
                        );
                      })
                    ) : (
                      <Menu.Item key={notification[0]}>
                        <Text>No Notifications</Text>
                      </Menu.Item>
                    )}
                  </Menu>
                }
                placement="bottomRight"
              >
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                />
              </Dropdown>
            </Menu.Item>
          ) : null}

          {/* PUBLIC ROUTES */}

          {!isEmpty(auth) ? null : (
            <Menu.Item key="/login">
              <Link to="/login/">Login</Link>
            </Menu.Item>
          )}

          {!isEmpty(auth) ? null : (
            <Menu.Item key="/register">
              <Link to="/register">Register</Link>
            </Menu.Item>
          )}

          {/* AUTH ROUTES */}
        </Menu>
      </Header>
      <Content style={{ padding: "0 10px", minHeight: "86vh" }}>
        <div style={{ padding: 24 }}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>IDK YET</Footer>
    </Layout>
  );
};

export default CustomLayout;

import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useFirebase, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";

const { Header, Content, Footer } = Layout;

const CustomLayout = (props) => {
  const auth = useSelector((state) => state.firebase.auth);
  const firebase = useFirebase();

  return (
    <Layout className="layout">
      <Header>
        {/* <div className="logo" /> */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["/"]}>
          <Menu.Item key="/">
            <Link to="/">Home</Link>
          </Menu.Item>

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
      <Content style={{ padding: "0 10px", height: "86vh" }}>
        <div style={{ padding: 24 }}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>IDK YET</Footer>
    </Layout>
  );
};

export default CustomLayout;

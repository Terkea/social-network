import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const CustomLayout = (props) => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["/"]}>
          <Menu.Item key="/">
            <Link to="/">Home</Link>
          </Menu.Item>

          {/* PUBLIC ROUTES */}

          {props.isAuthenticated === true ? null : (
            <Menu.Item key="/login">
              <Link to="/login/">Login</Link>
            </Menu.Item>
          )}

          {props.isAuthenticated === true ? null : (
            <Menu.Item key="/register">
              <Link to="/register">Register</Link>
            </Menu.Item>
          )}

          {/* AUTH ROUTES */}
          {/* {props.isAuthenticated === true ? (
            <Menu.Item key="/logout">
              <Link to="/logout">Logout</Link>
            </Menu.Item>
          ) : null} */}
        </Menu>
      </Header>
      <Content style={{ padding: "0 10px", minHeight: "86vh" }}>
        <div style={{ padding: 24 }}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center", backgroundColor: "#CCC" }}>
        IDK YET
      </Footer>
    </Layout>
  );
};

export default CustomLayout;

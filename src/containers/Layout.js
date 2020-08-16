import React from "react";
import { Layout, Menu, message, Dropdown, Badge } from "antd";
import { Link } from "react-router-dom";
import { isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { HomeOutlined, BellOutlined, DownOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;

const CustomLayout = (props) => {
  const auth = useSelector((state) => state.firebase.auth);

  const menu = (
    <Menu>
      <Menu.Item key="1">Clicking me will not close the menu.</Menu.Item>
      <Menu.Item key="2">Clicking me will not close the menu also.</Menu.Item>
      <Menu.Item key="3">Clicking me will close the menu.</Menu.Item>
    </Menu>
  );

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

          <Menu.Item
            key="123"
            icon={
              <Badge count={1}>
                <BellOutlined style={{ marginLeft: "10px" }} />
              </Badge>
            }
          >
            <Dropdown overlay={menu} placement="bottomRight">
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              ></a>
            </Dropdown>
          </Menu.Item>

          {/* <Dropdown overlay={menu}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              Hover me <DownOutlined />
            </a>
          </Dropdown> */}

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

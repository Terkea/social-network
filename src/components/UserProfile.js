import React from "react";

import { Row, Col, Typography, Avatar, Card } from "antd";
import {
  UserOutlined,
  AimOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

// import ChangePassword from "./CustomModal";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import Moment from "react-moment";

const { Title, Paragraph } = Typography;

const UserProfile = (props) => {
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector(
    ({ firestore: { data } }) => data.users && data.users[props.userId]
  );
  useFirestoreConnect([
    {
      collection: "users",
      doc: props.userId,
    },
  ]);

  return (
    <>
      {isLoaded(profile) && !isEmpty(profile) ? (
        <Row>
          <Card style={{ width: "100%" }} hoverable>
            <Col span={24}>
              <Row align="center">
                <Avatar
                  align="middle"
                  src={profile.photoURL}
                  size={256}
                  icon={<UserOutlined />}
                />
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
                    {profile.username === "" ? "unknown" : profile.username}
                  </Title>
                  {profile.bio ? (
                    <Paragraph align="center" level={4}>
                      {profile.bio}
                    </Paragraph>
                  ) : (
                    <Paragraph align="center" level={4}>
                      Apparently, this user prefers to keep an air of mystery
                      about them.
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
      ) : null}
    </>
  );
};

export default UserProfile;

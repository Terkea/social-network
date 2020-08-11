import React, { useState } from "react";
import { Upload, Typography } from "antd";
import ImgCrop from "antd-img-crop";

import { runNotifications } from "../helpers/Notification";

import uuid from "react-uuid";
import { storage } from "../firebase";

import { connect } from "react-redux";
import * as actions from "../store/actions/user";
import { Link } from "react-router-dom";

const { Title } = Typography;
const UploadProfilePicture = (props) => {
  const [fileList, updateFileList] = useState([]);

  const customUpload = ({ onError, onSuccess, file }) => {
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = storage.ref();
    const imageName = uuid(); //a unique name for the image
    const imgFile = storageRef.child(`avatar/${imageName}.jpg`);
    try {
      const image = imgFile.put(file, metadata);
      onSuccess(null, image);
      props.updateProfilePicture(`${imageName}.jpg`, runNotifications);
    } catch (e) {
      onError(e);
    }
  };

  const options = {
    fileList,
    showUploadList: false,
    onChange: (info) => {
      updateFileList(info.fileList.filter((file) => !!file.status));
    },
  };

  return (
    <ImgCrop rotate>
      <Upload customRequest={customUpload} {...options}>
        <Title level={4}>
          <Link to="#">Update profile picture</Link>
        </Title>
      </Upload>
    </ImgCrop>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfilePicture: (url, callback) =>
      dispatch(actions.updateProfilePicture(url, callback)),
  };
};

export default connect(null, mapDispatchToProps)(UploadProfilePicture);

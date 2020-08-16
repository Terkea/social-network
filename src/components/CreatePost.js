import React, { useState } from "react";
import { Upload, Card, Input, Button, Form } from "antd";
import ImgCrop from "antd-img-crop";
import { InboxOutlined, SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { runNotifications } from "../helpers/Notification";
import { storage } from "../createStore";
import uuid from "react-uuid";

const CreatePost = () => {
  const [fileList, setFileList] = useState([]);
  const [expand, setExpand] = useState(false);
  const [imageURL, setImageURL] = useState();
  const [form] = Form.useForm();
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const firestore = useFirestore();

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const customUpload = ({ onError, onSuccess, file }) => {
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = storage.ref();
    const imageName = uuid(); //a unique name for the image
    const imgFile = storageRef.child(`${imageName}.jpg`);
    try {
      const image = imgFile.put(file, metadata);
      image.then((snapshot) => {
        onSuccess(null, image);
        setImageURL(imageName);
      });
    } catch (e) {
      onError(e);
    }
  };

  const onFinish = (values) => {
    if (fileList.length == 0) {
      runNotifications("You forgot to upload a picture", "ERROR");
    } else {
      firestore.collection("posts").add({
        userId: auth.uid,
        profilePicture: profile.photoURL,
        userName: profile.username,
        commentCount: 0,
        likeCount: 0,
        description: values.description || null,
        timestamp: new Date().toISOString(),
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_STORAGE_BUCKET}/o/${imageURL}.jpg?alt=media`,
      });
      form.resetFields();
      setFileList([]);
    }
  };

  return (
    <Card hoverable style={{ maxWidth: 614, marginTop: "20px" }}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="description" rules={[{ required: false }]}>
          <Input
            size="large"
            onClick={() => setExpand(true)}
            style={{ marginBottom: "20px" }}
            bordered={false}
            placeholder={`What's on your mind, ${profile.username}?`}
            suffix={
              <Button style={{ border: "none" }} onClick={() => form.submit()}>
                <SendOutlined />
              </Button>
            }
          />
        </Form.Item>
      </Form>
      {expand ? (
        <ImgCrop style={{ width: "100%" }} rotate>
          <Upload.Dragger
            listType="picture"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            customRequest={customUpload}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
        </ImgCrop>
      ) : null}
    </Card>
  );
};

export default CreatePost;

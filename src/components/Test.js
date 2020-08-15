import React, { useState } from "react";
import { Form, Modal } from "antd";

import FullPost from "./FullPost";
const Test = () => {
  const [profileModalVisibility, setProfileModalVisibility] = useState(true);

  return (
    <Modal
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        setProfileModalVisibility(false);
      }}
      width={900}
      closable={false}
      footer={null}
      visible={profileModalVisibility}
    >
      <FullPost postId={"YfQRYe7EPScpdjIAJXky"} />
    </Modal>
  );
};

export default Test;

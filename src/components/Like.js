import React, { useState } from "react";
import { Button } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useFirestoreConnect,
  isLoaded,
  isEmpty,
  useFirestore,
} from "react-redux-firebase";

const Like = (props) => {
  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const checkLike = useSelector((state) => state.firestore.data.likes);
  useFirestoreConnect([
    {
      collection: "likes",
      where: [
        ["postId", "==", props.postId],
        ["userId", "==", auth.uid || null],
      ],
      //   storeAs: `checkLike${props.postId}`,
    },
  ]);

  const likePost = () => {
    if (!isEmpty(auth) && isLoaded(auth)) {
      if (isLoaded(checkLike) && isEmpty(checkLike)) {
        console.log("add like", props.postId);
        firestore.collection("likes").add({
          postId: props.postId,
          userId: auth.uid,
          userName: profile.username,
          photoURL: profile.photoURL,
        });
      }

      if (isLoaded(checkLike) && !isEmpty(checkLike)) {
        console.log("delete like", props.postId);
        firestore.collection("likes").doc(Object.keys(checkLike)[0]).delete();
      }
    }
  };

  return (
    <Button
      style={{ border: "none", padding: "0 0 0 0", marginRight: "10px" }}
      onClick={likePost}
    >
      {!isEmpty(checkLike) ? (
        <HeartFilled key={props.postId} style={{ fontSize: "25px" }} />
      ) : (
        <HeartOutlined key={props.postId} style={{ fontSize: "25px" }} />
      )}
    </Button>
  );
};

export default Like;

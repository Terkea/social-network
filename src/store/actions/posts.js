import * as actionTypes from "./actionTypes";
import { auth, firestore } from "../../firebase";

export const getAllPosts = (posts) => {
  return {
    type: actionTypes.GET_ALL_POSTS,
    error: null,
    loading: false,
    payload: { posts },
  };
};

export const fetchPosts = () => (dispatch) => {
  var all_posts = [];

  firestore
    .collection("posts")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        all_posts.push(doc.data());
      });
    });

  console.log(all_posts);
  dispatch(getAllPosts(all_posts));
};

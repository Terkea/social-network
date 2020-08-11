import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  loading: false,
  error: null,
  payload: null,
};

const getAllPosts = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    payload: action.payload,
  });
};

const handlers = {
  [actionTypes.GET_ALL_POSTS]: getAllPosts,
};

const reducer = (state = initialState, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export default reducer;

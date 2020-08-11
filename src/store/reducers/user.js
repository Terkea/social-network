import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  loading: false,
  error: null,
  payload: null,
};

const registerStart = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    payload: action.payload,
  });
};

const registerSuccess = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const registerFail = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
  });
};

const authStart = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    isAuthenticated: action.isAuthenticated,
  });
};

const updateProfileSuccess = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const updateProfileFail = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    // payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const updatePasswordSuccess = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const updatePasswordFail = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    // payload: action.payload,
    // isAuthenticated: action.isAuthenticated,
  });
};

const logout = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    payload: action.payload,
    isAuthenticated: action.isAuthenticated,
  });
};

const handlers = {
  [actionTypes.AUTH_START]: authStart,
  [actionTypes.AUTH_SUCCESS]: authSuccess,
  [actionTypes.AUTH_FAIL]: authFail,

  [actionTypes.REGISTER_START]: registerStart,
  [actionTypes.REGISTER_FAIL]: registerFail,
  [actionTypes.REGISTER_SUCCESS]: registerSuccess,

  [actionTypes.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [actionTypes.UPDATE_PROFILE_FAIL]: updateProfileFail,

  [actionTypes.UPDATE_PASSWORD_SUCCESS]: updatePasswordSuccess,
  [actionTypes.UPDATE_PASSWORD_FAIL]: updatePasswordFail,

  // [actionTypes.FORGOTTEN_PASSWORD]: forgottenPassword,

  [actionTypes.LOGOUT]: logout,
};

const reducer = (state = initialState, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export default reducer;

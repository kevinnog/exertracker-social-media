import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";
import axios from "axios";

export const getUserData = () => dispatch => {
  dispatch({ type: LOADING_USER });
  axios({
    method: "get",
    url: "/user",
    headers: { Authorization: localStorage.getItem("FBIdToken") }
  })
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(result => {
      const FBIdToken = `Bearer ${result.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(result => {
      const FBIdToken = `Bearer ${result.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const uploadImage = formData => dispatch => {
  dispatch({ type: LOADING_USER });
  axios({
    method: "post",
    url: "/user/image",
    data: formData,
    headers: { Authorization: localStorage.getItem("FBIdToken") }
  })
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.log(err);
    });
};

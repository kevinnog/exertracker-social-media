import {
  SET_EXERCISES,
  POST_EXERCISE,
  LOADING_DATA,
  LIKE_EXERCISE,
  UNLIKE_EXERCISE,
  DELETE_EXERCISE,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_EXERCISE,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
import axios from "axios";

// Get all exercises
export const getExercises = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/exercise")
    .then((res) => {
      dispatch({ type: SET_EXERCISES, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_EXERCISES, payload: [] });
    });
};

// Get one exercise
export const getExercise = (exerciseId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/exercise/${exerciseId}`)
    .then((res) => {
      dispatch({
        type: SET_EXERCISE,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Post an exercise
export const postExercise = (newExercise) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios({
    method: "post",
    url: "/exercise",
    data: newExercise,
    headers: { Authorization: localStorage.getItem("FBIdToken") },
  })
    .then((res) => {
      dispatch({ type: POST_EXERCISE, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Like an exercise
export const likeExercise = (exerciseId) => (dispatch) => {
  axios({
    method: "get",
    url: `/exercise/${exerciseId}/like`,
    headers: { Authorization: localStorage.getItem("FBIdToken") },
  })
    .then((res) => {
      dispatch({ type: LIKE_EXERCISE, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Unlike an exercise
export const unlikeExercise = (exerciseId) => (dispatch) => {
  axios({
    method: "get",
    url: `/exercise/${exerciseId}/unlike`,
    headers: { Authorization: localStorage.getItem("FBIdToken") },
  })
    .then((res) => {
      dispatch({ type: UNLIKE_EXERCISE, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Submit a comment
export const submitComment = (exerciseId, commentData) => (dispatch) => {
  axios({
    method: "post",
    url: `/exercise/${exerciseId}/comment`,
    data: commentData,
    headers: { Authorization: localStorage.getItem("FBIdToken") },
  })
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Delete an exercise
export const deleteExercise = (exerciseId) => (dispatch) => {
  axios({
    method: "delete",
    url: `/exercise/${exerciseId}`,
    headers: { Authorization: localStorage.getItem("FBIdToken") },
  })
    .then(() => {
      dispatch({ type: DELETE_EXERCISE, payload: exerciseId });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_EXERCISES,
        payload: res.data.exercises,
      });
    })
    .catch(() => {
      dispatch({ type: SET_EXERCISES, payload: null });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

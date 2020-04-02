import {
  SET_EXERCISES,
  POST_EXERCISE,
  LOADING_DATA,
  LIKE_EXERCISE,
  UNLIKE_EXERCISE,
  DELETE_EXERCISE,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS
} from "../types";
import axios from "axios";

// Get all exercises
export const getExercises = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/exercise")
    .then(res => {
      dispatch({ type: SET_EXERCISES, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: SET_EXERCISES, payload: [] });
    });
};

// Post an exercise
export const postExercise = newExercise => dispatch => {
  dispatch({ type: LOADING_UI });
  axios({
    method: "post",
    url: "/exercise",
    data: newExercise,
    headers: { Authorization: localStorage.getItem("FBIdToken") }
  })
    .then(res => {
      dispatch({ type: POST_EXERCISE, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

// Like an exercise
export const likeExercise = exerciseId => dispatch => {
  axios({
    method: "get",
    url: `/exercise/${exerciseId}/like`,
    headers: { Authorization: localStorage.getItem("FBIdToken") }
  })
    .then(res => {
      dispatch({ type: LIKE_EXERCISE, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};

// Unlike an exercise
export const unlikeExercise = exerciseId => dispatch => {
  axios({
    method: "get",
    url: `/exercise/${exerciseId}/unlike`,
    headers: { Authorization: localStorage.getItem("FBIdToken") }
  })
    .then(res => {
      dispatch({ type: UNLIKE_EXERCISE, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};

// Delete an exercise
export const deleteExercise = exerciseId => dispatch => {
  axios({
    method: "delete",
    url: `/exercise/${exerciseId}`,
    headers: { Authorization: localStorage.getItem("FBIdToken") }
  })
    .then(() => {
      dispatch({ type: DELETE_EXERCISE, payload: exerciseId });
    })
    .catch(err => {
      console.log(err);
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};

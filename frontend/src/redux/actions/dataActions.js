import {
  SET_EXERCISES,
  LOADING_DATA,
  LIKE_EXERCISE,
  UNLIKE_EXERCISE,
  DELETE_EXERCISE
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

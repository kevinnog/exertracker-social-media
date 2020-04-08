import {
  SET_EXERCISES,
  LOADING_DATA,
  LIKE_EXERCISE,
  UNLIKE_EXERCISE,
  DELETE_EXERCISE,
  POST_EXERCISE,
  SET_EXERCISE,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  exercises: [],
  exercise: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_EXERCISES:
      return {
        ...state,
        exercises: action.payload,
        loading: false,
      };
    case SET_EXERCISE:
      return {
        ...state,
        exercise: action.payload,
      };
    case LIKE_EXERCISE:
    case UNLIKE_EXERCISE:
      let index = state.exercises.findIndex(
        (exercise) => exercise.exerciseId === action.payload.exerciseId
      );
      state.exercises[index] = action.payload;
      if (state.exercise.exerciseId === action.payload.exerciseId) {
        state.exercise = {
          ...state.exercise,
          ...action.payload,
        };
      }
      return {
        ...state,
      };
    case DELETE_EXERCISE:
      let index2 = state.exercises.findIndex(
        (exercise) => exercise.exerciseId === action.payload
      );
      state.exercises.splice(index2, 1);
      return {
        ...state,
      };
    case POST_EXERCISE:
      return {
        ...state,
        exercises: [action.payload, ...state.exercises],
      };
    case SUBMIT_COMMENT:
      let commentedOnIndex = state.exercises.findIndex(
        (exercise) => exercise.exerciseId === action.payload.exerciseId
      );
      return {
        ...state,
        exercise: {
          ...state.exercise,
          comments: [action.payload, ...state.exercise.comments],
          commentCount: state.exercise.commentCount + 1,
        },
        exercises: state.exercises.map((exercise, exercisesArrIndex) =>
          exercisesArrIndex === commentedOnIndex
            ? { ...exercise, commentCount: exercise.commentCount + 1 }
            : exercise
        ),
      };
    default:
      return state;
  }
}

import {
  SET_EXERCISES,
  LOADING_DATA,
  LIKE_EXERCISE,
  UNLIKE_EXERCISE,
  DELETE_EXERCISE,
  POST_EXERCISE,
  SET_EXERCISE,
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
        state.exercise = action.payload;
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
    default:
      return state;
  }
}

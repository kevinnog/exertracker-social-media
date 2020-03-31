import React, { Component } from "react";
import axios from "axios";

// Components
import Exercise from "../components/Exercise";
import Profile from "../components/Profile";

// Material-UI items
import Grid from "@material-ui/core/Grid/";

export class home extends Component {
  state = {
    exercises: null
  };

  componentDidMount() {
    axios
      .get("/exercise")
      .then(res => {
        this.setState({
          exercises: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let recentExercisesMarkup = this.state.exercises ? (
      this.state.exercises.map(exercise => (
        <Exercise key={exercise.exerciseId} exercise={exercise} />
      ))
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          {recentExercisesMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

export default home;

import React, { Component } from "react";
import { connect } from "react-redux";
import { getExercises } from "../redux/actions/dataActions";
import PropTypes from "prop-types";

// Components
import Exercise from "../components/exercise/Exercise";
import Profile from "../components/profile/Profile";

// Material-UI items
import Grid from "@material-ui/core/Grid/";

export class home extends Component {
  componentDidMount() {
    this.props.getExercises();
  }

  render() {
    const { exercises, loading } = this.props.data;

    let recentExercisesMarkup = !loading ? (
      exercises.map((exercise) => (
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

home.propTypes = {
  getExercises: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getExercises })(home);

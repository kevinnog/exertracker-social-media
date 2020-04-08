import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Components
import Exercise from "../components/exercise/Exercise";
import StaticProfile from "../components/profile/StaticProfile";
import ExerciseSkeleton from "../utility/ExerciseSkeleton";
import ProfileSkeleton from "../utility/ProfileSkeleton";

// Material-UI items
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    exerciseIdParam: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const exerciseId = this.props.match.params.exerciseId;

    if (exerciseId) {
      this.setState({ exerciseIdParam: exerciseId });
    }

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { exercises, loading } = this.props.data;
    const { exerciseIdParam } = this.state;

    const exercisesMarkup = loading ? (
      <ExerciseSkeleton />
    ) : exercises === null ? (
      <p>This user doesn't have any exercise yet</p>
    ) : !exerciseIdParam ? (
      exercises.map((exercise) => (
        <Exercise key={exercise.exerciseId} exercise={exercise} />
      ))
    ) : (
      exercises.map((exercise) => {
        if (exercise.exerciseId !== exerciseIdParam) {
          return <Exercise key={exercise.exerciseId} exercise={exercise} />;
        } else {
          return (
            <Exercise
              key={exercise.exerciseId}
              exercise={exercise}
              openDialog
            />
          );
        }
      })
    );

    return (
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          {exercisesMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);

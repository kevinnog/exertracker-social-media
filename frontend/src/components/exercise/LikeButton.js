import React, { Component } from "react";
import MyButton from "../../utility/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import themeObject from "../../utility/themeObject";

// Icons
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

// Redux
import { connect } from "react-redux";
import { likeExercise, unlikeExercise } from "../../redux/actions/dataActions";

const styles = {
  ...themeObject,
};

export class LikeButton extends Component {
  checkIfExerciseIsLiked = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.exerciseId === this.props.exerciseId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeExercise = () => {
    this.props.likeExercise(this.props.exerciseId);
  };

  unlikeExercise = () => {
    this.props.unlikeExercise(this.props.exerciseId);
  };

  render() {
    const { classes } = this.props;
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder className={classes.likeColor} />
        </MyButton>
      </Link>
    ) : this.checkIfExerciseIsLiked() ? (
      <MyButton tip="Undo like" onClick={this.unlikeExercise}>
        <FavoriteIcon className={classes.likeColor} />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeExercise}>
        <FavoriteBorder className={classes.likeColor} />
      </MyButton>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  exerciseId: PropTypes.string.isRequired,
  likeExercise: PropTypes.func.isRequired,
  unlikeExercise: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeExercise,
  unlikeExercise,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(LikeButton));

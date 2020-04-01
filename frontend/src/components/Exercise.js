import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../utility/MyButton";

// Material-UI items
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

// Redux
import { connect } from "react-redux";
import { likeExercise, unlikeExercise } from "../redux/actions/dataActions";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200,
    objectFit: "cover"
  },
  content: {
    padding: 25,
    objectFit: "cover"
  },
  handleDisplay: {
    fontWeight: 360
  },
  body: {
    fontWeight: 280
  }
};

class Exercise extends Component {
  checkIfExerciseIsLiked = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        like => like.exerciseId === this.props.exercise.exerciseId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeExercise = () => {
    this.props.likeExercise(this.props.exercise.exerciseId);
  };

  unlikeExercise = () => {
    this.props.unlikeExercise(this.props.exercise.exerciseId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      exercise: {
        body,
        createdAt,
        userImage,
        userHandle,
        exerciseId,
        likeCount,
        commentCount
      },
      user: { authenticated }
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.checkIfExerciseIsLiked() ? (
      <MyButton tip="Undo like" onClick={this.unlikeExercise}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeExercise}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile Image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
            className={classes.handleDisplay}
          >
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1" className={classes.body}>
            {body}
          </Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
        </CardContent>
      </Card>
    );
  }
}

Exercise.propTypes = {
  likeExercise: PropTypes.func.isRequired,
  unlikeExercise: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeExercise,
  unlikeExercise
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Exercise));

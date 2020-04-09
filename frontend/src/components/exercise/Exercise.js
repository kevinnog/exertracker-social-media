import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../../utility/MyButton";

// Components
import DeleteExercise from "./DeleteExercise";
import ExerciseDialog from "./ExerciseDialog";
import LikeButton from "./LikeButton";

// Material-UI items
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { connect } from "react-redux";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
    objectFit: "cover",
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
  handleDisplay: {
    fontWeight: 360,
    color: "#01579b",
  },
  body: {
    fontWeight: 280,
  },
  commentColor: {
    color: "#1976d2",
  },
};

class Exercise extends Component {
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
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteExercise exerciseId={exerciseId} />
      ) : null;

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
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1" className={classes.body}>
            {body}
          </Typography>
          <LikeButton exerciseId={exerciseId} />
          <span>{likeCount} Likes</span>
          <MyButton tip="Comments">
            <ChatIcon className={classes.commentColor} />
          </MyButton>
          <span>{commentCount} Comments</span>
          <ExerciseDialog
            exerciseId={exerciseId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Exercise.propTypes = {
  user: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Exercise));

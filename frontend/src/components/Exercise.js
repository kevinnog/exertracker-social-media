import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Material-UI items
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

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
      }
    } = this.props;
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
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Exercise);

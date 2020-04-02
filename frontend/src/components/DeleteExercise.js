import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../utility/MyButton";

// Material-UI items
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

// Icons
import DeleteForever from "@material-ui/icons/DeleteForever";

// Redux
import { connect } from "react-redux";
import { deleteExercise } from "../redux/actions/dataActions";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%"
  }
};

class DeleteExercise extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  deleteExercise = () => {
    this.props.deleteExercise(this.props.exerciseId);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <MyButton
          tip="Delete Exercise"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteForever color="secondary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Are you sure you want to delete this exercise?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteExercise} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteExercise.propTypes = {
  deleteExercise: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  exerciseId: PropTypes.string.isRequired
};

export default connect(null, { deleteExercise })(
  withStyles(styles)(DeleteExercise)
);

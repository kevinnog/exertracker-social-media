import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "../../utility/MyButton";
import withStyles from "@material-ui/core/styles/withStyles";
import themeObject from "../../utility/themeObject";

// Components
import PostExercise from "../exercise/PostExercise";
import Notifications from "./Notifications";

// Material-UI items
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Icons
import HomeIcon from "@material-ui/icons/Home";

// Redux
import { connect } from "react-redux";

const styles = {
  ...themeObject,
};

class Navbar extends Component {
  render() {
    const { authenticated, classes } = this.props;

    return (
      <AppBar>
        <ToolBar className="nav-container">
          {authenticated ? (
            <Fragment>
              <PostExercise className={classes.navBarButton} />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon className={classes.navBarButton} />
                </MyButton>
              </Link>
              <Notifications />
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </ToolBar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(Navbar));

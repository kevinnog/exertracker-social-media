const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./utility/fbAuth");

const cors = require("cors");
app.use(cors());

const { db } = require("./utility/database");

const {
  getAllExercises,
  postOneExercise,
  getExercise,
  deleteExercise,
  commentOnExercise,
  likeExercise,
  unlikeExercise,
} = require("./handlers/exercise");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/user");

// ROUTES

// Exercise routes
app.get("/exercise", getAllExercises);
app.post("/exercise", FBAuth, postOneExercise);
app.get("/exercise/:exerciseId", getExercise);
app.delete("/exercise/:exerciseId", FBAuth, deleteExercise);
app.post("/exercise/:exerciseId/comment", FBAuth, commentOnExercise);
app.get("/exercise/:exerciseId/like", FBAuth, likeExercise);
app.get("/exercise/:exerciseId/unlike", FBAuth, unlikeExercise);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

// https://baseurl.com/api/

exports.api = functions.region("us-east1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("us-east1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/exercise-logs/${snapshot.data().exerciseId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            exerciseId: doc.id,
            type: "like",
            createdAt: new Date().toISOString(),
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("us-east1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("us-east1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/exercise-logs/${snapshot.data().exerciseId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            exerciseId: doc.id,
            type: "comment",
            createdAt: new Date().toISOString(),
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("us-east1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection("exercise-logs")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const exercise = db.doc(`/exercise-logs/${doc.id}`);
            batch.update(exercise, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onExerciseDelete = functions
  .region("us-east1")
  .firestore.document("/exercise-logs/{exerciseId}")
  .onDelete((snapshot, context) => {
    const exerciseId = context.params.exerciseId;
    const batch = db.batch();

    return db
      .collection("comments")
      .where("exerciseId", "==", exerciseId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("exerciseId", "==", exerciseId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("exerciseId", "==", exerciseId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });

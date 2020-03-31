const { db } = require("../utility/database");

// Fetch all exercises
exports.getAllExercises = (request, response) => {
  db.collection("exercise-logs")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let exercises = [];

      data.forEach(doc => {
        exercises.push({
          exerciseId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        });
      });

      return response.json(exercises);
    })
    .catch(err => {
      response.status(400).json({ error: "Error on fetching exercises" });
      console.error(err);
    });
};

// Post exercise
exports.postOneExercise = (request, response) => {
  const newExercise = {
    body: request.body.body,
    userHandle: request.user.handle,
    userImage: request.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("exercise-logs")
    .add(newExercise)
    .then(doc => {
      const responseExercise = newExercise;
      responseExercise.exerciseId = doc.id;
      response.json(responseExercise);
    })
    .catch(err => {
      response.status(500).send({ error: "Error on creating exercise" });
      console.error(err);
    });
};

// Fetch one exercise
exports.getExercise = (request, response) => {
  let exerciseData = {};
  db.doc(`/exercise-logs/${request.params.exerciseId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Exercise not found" });
      }
      exerciseData = doc.data();
      exerciseData.exerciseId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("exerciseId", "==", request.params.exerciseId)
        .get();
    })
    .then(data => {
      exerciseData.comments = [];
      data.forEach(doc => {
        exerciseData.comments.push(doc.data());
      });
      return response.json(exerciseData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

// Delete an exercise
exports.deleteExercise = (request, response) => {
  let document = db.doc(`/exercise-logs/${request.params.exerciseId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Exercise not found" });
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      response.json({ message: "Exercise deleted sucessfully" });
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

// Comment on an exercise
exports.commentOnExercise = (request, response) => {
  if (request.body.body.trim() === "")
    return response.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: request.body.body,
    createdAt: new Date().toISOString(),
    userHandle: request.user.handle,
    exerciseId: request.params.exerciseId,
    userImage: request.user.imageUrl
  };

  db.doc(`/exercise-logs/${request.params.exerciseId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Exercise not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      response.json(newComment);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: "Something went wrong" });
    });
};

// Like Exercise
exports.likeExercise = (request, response) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", request.user.handle)
    .where("exerciseId", "==", request.params.exerciseId)
    .limit(1);

  const exerciseDocument = db.doc(`exercise-logs/${request.params.exerciseId}`);

  let exerciseData = {};

  exerciseDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        exerciseData = doc.data();
        exerciseData.exerciseId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).jons({ error: "Exercise not found " });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            exerciseId: request.params.exerciseId,
            userHandle: request.user.handle
          })
          .then(() => {
            exerciseData.likeCount++;
            return exerciseDocument.update({
              likeCount: exerciseData.likeCount
            });
          })
          .then(() => {
            return response.json(exerciseData);
          });
      } else {
        return response.status(400).jons({ error: "Exercise already liked " });
      }
    })
    .catch(err => {
      console.error(err);
      response.status(500).jons({ error: err.code });
    });
};

// Unlike Exercise
exports.unlikeExercise = (request, response) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", request.user.handle)
    .where("exerciseId", "==", request.params.exerciseId)
    .limit(1);

  const exerciseDocument = db.doc(`exercise-logs/${request.params.exerciseId}`);

  let exerciseData = {};

  exerciseDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        exerciseData = doc.data();
        exerciseData.exerciseId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).jons({ error: "Exercise not found " });
      }
    })
    .then(data => {
      if (data.empty) {
        return response.status(400).json({ error: "Exercise not liked " });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            exerciseData.likeCount--;
            return exerciseDocument.update({
              likeCount: exerciseData.likeCount
            });
          })
          .then(() => {
            response.json(exerciseData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      response.status(500).jons({ error: err.code });
    });
};

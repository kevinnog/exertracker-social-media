const database = require("firebase-admin");
const serviceAccount = require("../keys/serviceAccountKey.json");

database.initializeApp({
  credential: database.credential.cert(serviceAccount),
  databaseURL: "https://exertracker-social-media.firebaseio.com",
  storageBucket: "exertracker-social-media.appspot.com"
});

const db = database.firestore();

module.exports = { database, db };

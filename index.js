const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
var cors = require("cors");

var serviceAccount = require("./config/tinvietsoft.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://polyfood-7fcd7.firebaseio.com",
});

app.use(cors());
//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get("/api/helloworld", (req, res) => {
  res.json({ sayHi: "hello from server, nice to meet you!" });
});

app.post("/tvs/notification", (req, res) => {
  let { body, title, tokens } = req.body;
  var arrTokens = tokens.split(",");
  //[device1,device2,....]
  var message = {
    android: {
      notification: {
        body: body,
        title: title,
      },
      //priority: "high"
    },
    apns: {
      headers: {
        "apns-priority": "10",
        "apns-expiration": "360000",
      },
      payload: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          sound: "default",
        },
        data: "some custom data",
      },
    },
    tokens: arrTokens,
  };
  console.log("Message -----" + JSON.stringify(message));
  admin
    .messaging()
    .sendMulticast(message)
    .then((batchResponse) => {
      console.log(batchResponse);
      res.json(batchResponse);
    })
    .catch((error) => {
      console.log("aaaaaaaaaaaaaaaa", error);
      res.json(error);
    });
});

// const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000);

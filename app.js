const http = require("http");
const https = require("https");
const fs = require("fs");

const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

const app = express();

// Connect to mongoose
mongoose.connect("mongodb://username:password@ds111078.mlab.com:11078/cryptinvest")
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch(error => console.log(error));

// Load User model
require("./models/User");
const User = mongoose.model("user");

// Handlebars middleware
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override
app.use(methodOverride('_method'));

// Index route
app.get('/', (req, res) => {
  res.render("index")
});

// Add user - registration
app.post('/user/register', (req, res) => {

  const newUser = {
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    imageUrl: req.body.imageUrl,
    accountStatus: "pending"
  };

  User.findOne({$or: [
    {username: newUser.username},
    { email: newUser.email }
  ]})
  .exec((err, user) => {
    if (user) {
      res.render("user/registererror");
    }
    else {
      new User(newUser)
      .save()
      .then(user => {
        res.render("user/register");
      });
    } //no users with that email NOR username exist.
  });

});

// Get user - login
app.post('/user/login', (req, res) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (user.accountStatus === "accepted") {
      res.render("user/login", {
        fullName: user.fullName
      });
    } else {
      res.render("user/loginerror");
    }
  })
  .catch(() => {
    res.render("user/loginerror");
  })
})

// Update user's accountStatus
app.put('/user/:username/:newAccStatus', (req, res) => {
  const newAccStatus = req.params.newAccStatus;

  User.findOne({
    username: req.params.username
  })
  .then(user => {
    user.accountStatus = newAccStatus;
    
    user.save()
      .then(user => {
        res.send("User's new account status changed succesfully (email=" + user.email + ") to: " + user.accountStatus + "!");

        // Send email to user... (npm mandrill)
      });
  })

})

let httpServer = http.createServer(app).listen(8080);

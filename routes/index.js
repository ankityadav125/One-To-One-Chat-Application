var express = require("express");
var router = express.Router();
const userModel = require("../models/user");

var passport = require("passport");
var localStrategy = require("passport-local");
const messageModel = require("../models/message");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", isloggedIn, function (req, res, next) {
  const user = req.user;
  res.render("index", { title: "Express", user });
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/login");
}

router.post("/register", function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    profileImage: req.body.profileImage,
  });
  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  (req, res, next) => {}
);

router.get("/logout", (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect("/");
    });
  else {
    res.redirect("/");
  }
});

router.get("/getOnlineUser", isloggedIn, async (req, res, next) => {
  const loggedInUser = req.user;

  const onlineUsers = await userModel.find({
    socketId: { $ne: "" },
    _id: { $ne: loggedInUser._id },
  });

  res.status(200).json({
    onlineUsers,
  });
});

router.get("/getMessage", isloggedIn, async (req, res, next) => {
  const sender = req.user.username;
  const receiver = req.query.receiver;

  const messages = await messageModel.find({
    $or: [
      {
        sender: sender,
        receiver: receiver,
      },
      {
        sender: receiver,
        receiver: sender,
      },
    ],
  });

  res.status(200).json({
    messages,
  });
});

module.exports = router;

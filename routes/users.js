var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
const isAuth = require('../middleware/isAuth')
const { body } = require("express-validator");

router.get("/", function (req, res) {
  res.send("this is User Route");
});
const loginValidation = [
  [body("password").notEmpty().withMessage("password is required"),
  body("email").notEmpty().withMessage("email is required").isEmail()
    .withMessage("Invalid Email"),]
];
const registerValidation = [
  [
    body("name").notEmpty().withMessage("name is required"),
    body("email").notEmpty().withMessage("email is required").isEmail()
      .withMessage("Invalid Email"),
    body("role").notEmpty().withMessage("role is required"),
    body("password").notEmpty().withMessage("password is required"),
  ]
];



router.post("/register", registerValidation, userController.register);

router.get("/verify/:userId/:uniqueString", userController.verify);

router.post("/login", loginValidation, userController.login);

router.post("/forgotPassword", userController.forgotPassword);

router.post("/resetPassword", userController.resetPassword);

router.post("/purchaseRequest", isAuth, userController.purchaseRequest);

router.put("/updateProfile", isAuth, userController.updateProfile);

router.post("/logUserActivity", isAuth, userController.logUserActivity);
module.exports = router;

const User = require("../models/usres");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const mailVarification = require("../utils/mailVerification")
const sendOtpEmail = require("../utils/sendOtpEmail");
const Books = require("../models/books");
const { validationResult } = require("express-validator");
const PurchaseRequest = require("../models/PurchaseRequest");

const asyncMiddlewareAuth = (handler) => {
  return async (req, res, next) => {
    try {
      if (req.body.role !== "user") {
        return res.status(401).json({
          status: 0,
          message: "Request not authorized.",
        });
      }
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};
const asyncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      // if (req.body.role !== "user") {
      //   return res.status(401).json({
      //     status: 0,
      //     message: "Request not authorized.",
      //   });
      // }
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};
exports.register = asyncMiddleware(async (req, res) => {
  var err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: 0, message: err.array() });
  }
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userInDB = await User.find({ email: email });
  if (userInDB.length === 0) {
    const data = new User({ name, email, password: hashedPassword, role });
    await data.save();
    var userId = data._id
    mailVarification.mailerFun(email, name, userId)
    res.status(201).json({
      message: "verification mail is sent Successfully",
      userId: userId,
      status: "verification panding",
    });

  } else {
    res.status(200).json({
      message: "this email is Alredy Used",
    });
  }
})
exports.verify = asyncMiddleware(async (req, res) => {
  const { userId, uniqueString } = req.params
  const isKey = await User.findById(userId);
  const isData = await bcrypt.compare(uniqueString, isKey.uniqueString);
  if (isData) {
    isKey.isActive = true
    await isKey.save();
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: "10000h",
    });
    return res.status(201).json({
      message: "verification  Successfully",
      status: " verifed ",
      token: token,
    });
  }
  else {
    return res.status(500).json({
      message: "something went wrong",

    });
  }
})
exports.login = asyncMiddleware(async (req, res) => {
  var err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: 0, message: err.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
    isActive: true
  });
  console.log(user)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials......' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Generate and send JWT token
  const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'saurabh', { expiresIn: '1h' });
  return res.json({ token });
})
exports.forgotPassword = asyncMiddleware(async (req, res) => {
  var err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: 0, message: err.array() });
  }
  const { email } = req.body;
  var err = validationResult(req);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  sendOtpEmail.sendOtp(user.email, otp, user.name, user._id);
  return res.json({ message: 'OTP sent to your email' });
})
exports.resetPassword = asyncMiddleware(async (req, res) => {
  var err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ status: 0, message: err.array() });
  }
  const { email, otp, password } = req.body;
  if (!otp || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (user.resetToken !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetToken = null
  await user.save();
  return res.json({ message: 'Password reset successful' });
})

exports.purchaseRequest = asyncMiddlewareAuth(async (req, res) => {
  const { bookId, userId } = req.body;
  if (!bookId || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const data = await Books.findById(bookId);
  console.log(data)
  if (!data) { return res.status(404).json({ message: 'Book not found' }) }
  const newRequest = new PurchaseRequest({
    userId,
    bookId
  });
  await newRequest.save();
  res.status(201).json({ message: 'Purchase request sent successfully' });
})

exports.logUserActivity = asyncMiddlewareAuth(async (req, res) => {
  let { userId } = req.body
  if (!userId) {
    return res.status(400).json({ message: 'userId fields are required' });
  }
  const newActivity = new UserActivity({
    userId,
    action: "Logged in",
  });

  await newActivity.save();

})

exports.updateProfile = asyncMiddlewareAuth(async (req, res) => {
  const { email, name, age } = req.body;
  if (!email || !name || !age) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.name = name;
  user.age = age
  await user.save();
  return res.json({ message: 'Profile updated successful' });
})

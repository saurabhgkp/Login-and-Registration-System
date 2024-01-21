const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  // console.log(token);
  if (!token) {
    return res.status(403).json({ error: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, "saurabh");
    req.body.userId = decoded.userId;
    req.body.role = decoded.role
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: "Invalid Token" });
  }
  return next();
};

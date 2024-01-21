var express = require("express");
var router = express.Router();
var adminController = require("../controllers/admin");
const isAuth = require('../middleware/isAuth')

/* GET users listing. */
router.get("/", function (req, res) {

  res.send("this is Admin Route");
});

router.get("/getAllusers", isAuth, adminController.getAllusers);
router.get("/userActive", isAuth, adminController.userActive);
router.put("/updateProfile", isAuth, adminController.updateProfile);
router.get("/userInactive", isAuth, adminController.userInactive);
router.post("/addBook", isAuth, adminController.addBook);
router.get("/getAllBooks", isAuth, adminController.getAllBooks);
router.get("/getBookById", isAuth, adminController.getBookById);
router.put("/updateBook", isAuth, adminController.updateBook);
router.delete("/deleteBookById", isAuth, adminController.deleteBookById);
router.get("/RequestList", isAuth, adminController.RequestList);
router.put("/sellBook", isAuth, adminController.sellBook);

module.exports = router;

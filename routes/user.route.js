const express = require("express");
const userController = require("../controllers/user.controller");
const uploader = require("../middlewares/uploader");
const verifyJwt = require("../middlewares/verifyJwt");
const verifyAdmin = require("../middlewares/verifyAdmin");
const adminOrUser = require("../middlewares/adminOrUser");

const router = express.Router();


router
  .route("/signup")
  .post(uploader.single("photo"), userController.createUser);

router.route("/login").post(userController.loginUser);

router.route("/all").get(verifyJwt, verifyAdmin, userController.getAllUsers);

router
  .route("/get/:email")
  .get(verifyJwt, adminOrUser, userController.getUserByEmail)
router
  .route('/edit/:email')
  .patch(
    verifyJwt,
    adminOrUser,
    uploader.single("photo"),
    userController.updateUser
  )
router
  .route('/delete/:email')
  .delete(verifyJwt, adminOrUser, userController.deleteUser);

module.exports = router;

const multer = require("multer");
const userRoute = require("express").Router();

const { isAuthenticatedUser } = require("../middleware/authentication");
const {
  createNewUser,
  loginUser,
  logoutUser,
  getUserDetails,
  getAllUsers,
  uploadProfilePicture,
  forgotUserPassword,
  updateForgotPassword,
} = require("../controller/userController");

//  Upload profile picture...
const upload = multer().single("avatar");

userRoute.route("/signup").post(createNewUser);
userRoute.route("/login").post(loginUser);
userRoute.route("/logout").get(logoutUser);
userRoute.route("/me").get(isAuthenticatedUser, getUserDetails);
userRoute.route("/all-users").get(isAuthenticatedUser, getAllUsers);
userRoute
  .route("/me/profile-upload")
  .put(isAuthenticatedUser, upload, uploadProfilePicture);
userRoute.route("/user/forgot-password").post(forgotUserPassword);
userRoute
  .route("/user/forgot/update-password/:tokenId")
  .post(updateForgotPassword);

module.exports = userRoute;

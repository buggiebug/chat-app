const multer = require("multer");
const userRoute = require("express").Router();
const path = require("path")

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
  blockUnblokUser,
  getBlockUserList
} = require("../controller/userController");

//  Upload profile picture...
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"uploads/");
  },
  filename:function(req,file,cb){
    cb(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname))
  }
})
const upload = multer({storage}).single("avatar");


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

userRoute.route("/user/:state").post(isAuthenticatedUser,blockUnblokUser);  
userRoute.route("/user/blocklist").get(isAuthenticatedUser,getBlockUserList);  
module.exports = userRoute;

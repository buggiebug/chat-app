const catchAsynError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ObjHelper = require("../utils/helper");
const MailSender = require("../utils/mailSender");
const SearchFeature = require("../utils/searchFeature");
const UserModel = require("../models/userModel");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

//  Get file...
const getFile = async(fileName)=>{
  const profilePath = await path.join(__dirname,"../uploads", String(fileName));  
  if(String(profilePath.split("\\").at(profilePath.split("\\").length-1)) !== "{}" && fileName !== null && String(profilePath.split("\\").at(profilePath.split("\\").length-1)) !== " "){
    const profileData = (await fs.promises.readFile(profilePath)).toString("base64");
    return profileData;
  }else{
    return " ";
  }
}

//  Create a new user...
exports.createNewUser = catchAsynError(async (req, res, next) => {
  const { step } = req.query;
  const { email, otp, name, password, cPassword } = req.body;
  const { tempToken } = req.cookies;

  const objHelper = new ObjHelper();

  if (isNaN(parseInt(step)))
    return next(new ErrorHandler("Signup step is required.", 400));
  if (!(parseInt(step) <= 3 && parseInt(step) >= 1))
    return next(new ErrorHandler("Signup steps is bewteen 1-3.", 400));

  let isUser;
  if (email) {
    if (!objHelper.verifyEmail(email))
      return next(new ErrorHandler("Invalid email.", 400));
    isUser = await UserModel.findOne({
      email: String(email).toLowerCase().trim(),
    });
  } else if (tempToken) {
    let id = await objHelper.objectId(tempToken);
    if (!objHelper.isValidMongoId(id))
      return next(new ErrorHandler(`Invalid Id: ${id}`, 400));
    isUser = await UserModel.findById(id);
  }

  if (isUser && isUser.isVerifiedUser)
    return next(new ErrorHandler("Email already in used.", 400));

  //  Step [1]...
  if (parseInt(step) === 1) {
    if (!email) return next(new ErrorHandler("Invalid email.", 400));
    await UserModel.findOneAndRemove({ email });
    let mailSender = new MailSender();
    try {
      if (await mailSender.validateEmailAddress(email)) {
        const otp = objHelper.getOtp(4);
        const mailRes = await mailSender.sendOtp({
          to: String(email).toLowerCase().trim(),
          otp,
        });
        if(!mailRes.success)
          return next(new ErrorHandler(res.message, 400));
        let passwordToken = {
          token: otp,
          date: Date.now() + 15 * 60 * 1000,
          tokenVerified: false,
        };
        const user = await UserModel.create({
          email: String(email).toLowerCase().trim(),
          passwordToken,
        });
        return res
          .status(200)
          .cookie("tempToken", await user.getTempAuthToken())
          .json({
            success: true,
            message: `An OTP has send to your email: ${email}`,
          });
      } else {
        return next(new ErrorHandler("Email not found.", 400));
      }
    } catch (err) {
      return next(new ErrorHandler(`${err.message}`, 400));
    }
  }
  //  Step [2]...
  if (parseInt(step) === 2) {
    if (!tempToken && !(await objHelper.objectId(tempToken)))
      return next(new ErrorHandler("Invalid Id.", 400));
    if (!otp) return next(new ErrorHandler("Please enter OTP.", 401));

    // console.log(tempToken);
    // console.log(isUser.passwordToken.token);

    if (
      String(otp) === String(await isUser.passwordToken.token) &&
      Date.now() < (await isUser.passwordToken.date)
    ) {
      isUser.passwordToken = {
        token: "",
        date: "",
        tokenVerified: true,
      };
      await isUser.save({ validateModifiedOnly: true });
      return res
        .status(200)
        .cookie("tempToken", await isUser.getTempAuthToken())
        .json({
          success: true,
          message: "OTP verified.",
        });
    } else return next(new ErrorHandler(`Invalid OTP or OTP is expired.`, 400));
  }
  //  Step [3]...
  if (parseInt(step) === 3) {
    if (!tempToken && !(await objHelper.objectId(tempToken)))
      return next(new ErrorHandler("Invalid Id.", 400));

    if (!objHelper.veifyString(name))
      return next(new ErrorHandler("Name must be alphabet.", 401));
    if (
      !objHelper.verifyPassword(password) &&
      !objHelper.verifyPassword(cPassword)
    )
      return next(
        new ErrorHandler(
          "Password must be AlphaNumeric & contains Special Symbol.",
          401
        )
      );
    if (String(password) !== String(cPassword))
      return next(
        new ErrorHandler("Password & Confirm Password mismatched.", 401)
      );

    const userData = await UserModel.findById(
      await objHelper.objectId(tempToken)
    );
    if (!userData) return next(new ErrorHandler("User not found.", 400));
    if (!userData.passwordToken.tokenVerified)
      return next(new ErrorHandler("User not found.", 400));

    userData.name = name;
    userData.password = password;
    userData.isVerifiedUser = true;
    userData.passwordToken = { tokenVerified: undefined };

    await userData.save({
      validateModifiedOnly: true,
      validateBeforeSave: true,
    });

    return res
      .status(201)
      .cookie("userawthtoken", await userData.getAuthToken())
      .json({
        success: true,
        message: "Welcome to GapSap 😍",
      });
  }

  return next(new ErrorHandler("Follow the API steps...", 400));
});

//  Login a user...
exports.loginUser = catchAsynError(async (req, res, next) => {
  const { email, password } = req.body;
  const objHelper = new ObjHelper();
  if (!objHelper.verifyEmail(email))
    return next(new ErrorHandler("Invalid email.", 400));
  if (!objHelper.verifyPassword(password))
    return next(new ErrorHandler("Invalid password.", 400));
  const user = await UserModel.findOne({
    email: String(email).toLowerCase().trim(),
  }).select("+password");
  if (!user) return next(new ErrorHandler("User not found.", 400));
  if (!(await user.isVerifiedUser))
    return next(new ErrorHandler("User not found.", 400));
  if (!(await user.comparePassword(password)))
    return next(new ErrorHandler("Invalid password.", 401));

  if (await user.accountStatus)
    return next(new ErrorHandler("Your account has been blocked.", 401));

  return res
    .status(200)
    .cookie("userawthtoken", await user.getAuthToken())
    .json({
      success: true,
      message: "Welcome back GapSap 😍",
    });
});

//  Logout user...
exports.logoutUser = catchAsynError(async (req, res, next) => {
  return res
    .status(200)
    .cookie("userawthtoken", null)
    .json({ success: true, message: "Logged out 🔒" });
});

//  Get user...
exports.getUserDetails = catchAsynError(async (req, res, next) => {
  try {
    let user = req.user;
    const profilePicture = await getFile(user.profilePicture);
    if(profilePicture)
    {
      const jsonData = {
        _id : user._id,
        name: user.name,
        email: user.email,
        activeStatus:user.activeStatus,
        profilePicture: profilePicture,
      }
      return res.status(200).json({ success: true, user:jsonData });
    }else
      return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(new ErrorHandler(err.message,400))
  }
});

//  Upload profile picture...
exports.uploadProfilePicture = catchAsynError(async (req, res, next) => {
  try {
    if (!req.file)
      return next(new ErrorHandler("Please select a picture.", 400));
    const userData = await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      { profilePicture:req.file.filename }
    );
    try {
      const profilePicture = await getFile(userData.profilePicture);
      if(profilePicture){
        const jsonData = {
          _id : userData._id,
          name: userData.name,
          email: userData.email,
          activeStatus:userData.activeStatus,
          profilePicture: profilePicture,
        }
        return res
          .status(200)
          .json({ success: true, message: "Profile picture updated.",user:jsonData });
      }
    } catch (err) {
      return next(new ErrorHandler(err.message,400))
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Forgot password...
exports.forgotUserPassword = catchAsynError(async (req, res, next) => {
  const { email } = req.body;
  const mailSender = new MailSender();
  const objHelper = new ObjHelper();
  if (!(await objHelper.verifyEmail(email)))
    return next(new ErrorHandler("Invalid email.", 401));

  const user = await UserModel.findOne({
    email: String(email).toLowerCase().trim(),
  });
  if (!user) return next(new ErrorHandler("User not found.", 400));
  if (!(await user.isVerifiedUser))
    return next(new ErrorHandler("User not found.", 401));

  if (await mailSender.validateEmailAddress(email)) {
    //  Save token in db & send token to user...
    const resetPassToken = await crypto.randomBytes(10).toString("hex");
    const passwordToken = {
      token: await crypto
        .createHash("sha256")
        .update(resetPassToken)
        .digest("hex"),
      date: Date.now() + 30 * 60 * 1000,
    };

    user.passwordToken = await passwordToken;
    await user.save({ validateBeforeSave: true, validateModifiedOnly: true });

    const forgotUrl = `http://localhost:8000/user/forgot/update-password/${resetPassToken}`;
    await mailSender.sendForgotPasswordMail({
      email: String(email).toLowerCase().trim(),
      forgotUrl,
    });

    return res.status(200).json({
      success: true,
      message: `Reset password link send to ${String(email).toLowerCase()}`,
    });
  } else {
    return next(new ErrorHandler("Email not found.", 400));
  }
});

//  Update forgot password...
exports.updateForgotPassword = catchAsynError(async (req, res, next) => {
  const { tokenId } = req.params;
  const { password, cPassword } = req.body;
  const objHelper = new ObjHelper();
  if (!tokenId) return next(new ErrorHandler("Invalid URL.", 401));
  if (
    !objHelper.verifyPassword(password) &&
    !objHelper.verifyPassword(cPassword)
  )
    return next(
      new ErrorHandler(
        "Password must be AlphaNumeric & contains Special Symbol.",
        401
      )
    );
  if (String(password) !== String(cPassword))
    return next(
      new ErrorHandler("Password & Confirm Password mismatched.", 401)
    );

  const hashToken = await crypto
    .createHash("sha256")
    .update(tokenId)
    .digest("hex");

  const user = await UserModel.findOne({
    $and: [
      { "passwordToken.token": hashToken },
      { "passwordToken.date": { $gt: Date.now() } },
    ],
  });
  if (!user) return next(new ErrorHandler("Invalid token.", 401));
  user.password = password;
  user.passwordToken = undefined;
  await user.save({ validateBeforeSave: true, validateModifiedOnly: true });
  return res.status(200).json({ success: true, message: "Password updated." });
});

//  Get all users...
exports.getAllUsers = catchAsynError(async (req, res, next) => {
  const search = req.query;
  const searchFeature = new SearchFeature(UserModel.find()).findUsers(
    search,
    req.user._id
  );
  const allUsers = await searchFeature;

  //  Update profile pictures to base64 if profile picture...
  for(let user of allUsers){
    // console.log(await getFile(user.profilePicture));
    user.profilePicture = await getFile(user.profilePicture);
  }

  return res.status(200).json({ success: true, allUsers });
});

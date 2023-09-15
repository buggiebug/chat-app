const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
class Helper {
  //  //! REGEX for Email & Password...
  regexEmail  = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  // regexPass   = /^[a-zA-Z0-9]+(?:[@&!])?$/;
  regexAlpha  = /^[A-Za-z\s]+$/;

  //  Name...
  veifyString(str) {
    if (this.regexAlpha.test(str)) return true;
    else return false;
  }

  //  Email...
  verifyEmail(str) {
    if (this.regexEmail.test(String(String(str)))) return true;
    else return false;
  }

  //  Password...
  verifyPassword(str) {
    if (String(str).length >= 8) return true;
    else return false;
  }

  //  OTP...
  getOtp(digit) {
    let otp = "";
    for (let i = 0; i < digit; i++) otp = otp + Math.round(Math.random(1) * 9);
    return otp;
  }

  isValidMongoId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      else return false;
    }
    return false;
  }

  //  Decode auth token...
  async objectId(token){
    const id =  await jwt.verify(token,process.env.JWT_SECRET);
    return await id.id;
  }
}

module.exports = Helper;

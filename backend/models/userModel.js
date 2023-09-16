const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },
    profilePicture: {
      mimetype: { type: String },
      buffer: { type: Buffer },
    },
    email: {
      type: String,
      trim: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    phone: {
      type: String,
      minLenght: [10],
    },
    isVerifiedUser: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordToken: {
      token: { type: String, trim: true },
      date: { type: Number },
      tokenVerified: { type: Boolean },
    },
    activeStatus: {
      type: String,
      trim: true,
      default: "online",
    },
  },
  { timestamps: true,}
);

//  Hash the password...
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//  Get temp JWT token...
userSchema.methods.getTempAuthToken = async function () {
  const token = await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TEMP_EXPIRES_IN,
  });
  return token;
};

//  Get after logged in JWT token...
userSchema.methods.getAuthToken = async function () {
  const token = await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + 15 * 60 * 1000,
  });
  return token;
};

//  Compare the user password...
userSchema.methods.comparePassword = async function (enteredPassword) {
  const isValidPassword = await bcrypt.compare(
    String(enteredPassword),
    this.password
  );
  return isValidPassword;
};


module.exports = mongoose.model("users", userSchema);

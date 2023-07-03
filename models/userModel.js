const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'firstName is required!'],
    },
    lastName: {
      type: String,
      required: [true, 'lastName is required!'],
    },  
    userName: {
      type: String,
      required: [true, 'userName is required!'],
    },
    email: {
      type: String,
      unique: [true, 'email must be unique'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Too short password'],
    },
    country: {
      type: String,
      required: [true, 'Must provide your country!'],
    },
    city: {
      type: String,
      required: [true, 'Must provide your city!'],
    },
    phoneNumber: String,
    
    profileImg: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    active: {
      type: Boolean,
      default: true,
    },
    resendCodeCount: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function (next) {
  // this points to the current query.
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  // 1234
  this.passwordResetCode = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return code;
};

const user = mongoose.model('User', userSchema);

module.exports = user;
//Node.js modules to use in this schema
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//create a user mongoose schema to create objects
const userSchema = new mongoose.Schema(
  {
    //first name of the user
    firstName: {
      type: String,
      required: [true, 'Please enter your first name']
    },
    //last name of the user
    lastName: {
      type: String,
      required: [true, 'Please enter your last name']
    },
    //user email which must be unique
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    //role of the user within the four available roles
    role: {
      type: String,
      enum: ['student', 'staff', 'admin', 'team-maintenance'],
      default: 'student',
      required: true
    },
    //user's major which belongs in the university by department
    major: {
      type: String,
      enum: [
        'Information Technology',
        'Business',
        'Accounting',
        'Project Management',
        'NOT A MAJOR'
      ]
    },
    //phone number of the user
    phoneNumber: {
      type: String,
      required: true,
      length: 10
    },
    //creation date of the user object
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true
    },
    //password of the user to log in, it is not selected
    password: {
      type: String,
      // required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    //confirmation password to create or change password
    passwordConfirm: {
      type: String,
      // required: [true, 'Please confirm your password'],
      //validation to check both are the same
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    //when the password was changed, if it has been
    passwordChangedAt: Date,
    //reset token to reset password of the user
    passwordResetToken: String,
    //when the token to reset the password will expire
    passwordResetExpires: Date,
    //if the user is active (to log in)
    active: {
      type: Boolean,
      default: true
    },
    //if the user is for testing purpose for the team maintenance
    testUser: {
      type: Boolean,
      default: false
    }
  },
  //conversion to the virtual attributes
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//before the user is saved, it will be codification the password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//create password change date when user update its password
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  //time of password was changed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//method to check if the password is correct when user log in
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//function if the user change password during it is using the system
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //return if the JWT has expired when the password was changed
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//create password to reset it
userSchema.methods.createPasswordResetToken = function() {
  //create random password
  const resetToken = crypto.randomBytes(32).toString('hex');

  //codified the password created in the token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //24 hours to reset password in the expired time of the token
  this.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000;

  //return the token
  return resetToken;
};

//create model of the schema in the db
const User = mongoose.model('User', userSchema);

//export the model
module.exports = User;

"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "username": "admin",
    "password": "aA*123456",
    "email": "admin@site.com",
    "first_name": "admin",
    "last_name": "admin",
    "is_active": true,
    "is_staff": true,
    "is_superadmin": true
}
{
    "username": "staff",
    "password": "aA*123456",
    "email": "staff@site.com",
    "first_name": "staff",
    "last_name": "staff",
    "is_active": true,
    "is_staff": true,
    "is_superadmin": false
}
{
    "username": "test",
    "password": "aA*123456",
    "email": "test@site.com",
    "first_name": "test",
    "last_name": "test",
    "is_active": true,
    "is_staff": false,
    "is_superadmin": false
}
/* ------------------------------------------------------- */
// User Model:

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },

    first_name: {
        type: String,
        trim: true,
        required: true
    },

    last_name: {
        type: String,
        trim: true,
        required: true
    },

    is_active: {
        type: Boolean,
        default: true
    },

    is_staff: {
        type: Boolean,
        default: false
    },

    is_superadmin: {
        type: Boolean,
        default: false
    },

}, { collection: 'users', timestamps: true })

/* ------------------------------------------------------- */
// Schema Configs:

const passwordEncrypt = require('../helpers/passwordEncrypt')

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  is_staff: Boolean,
  is_superadmin: Boolean,
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre(["save", "updateOne"], function (next) {
  // Get data from "this" when creating;
  // if process is updateOne, data will receive in "this._update"
  const data = this?._update || this;

  // Email validation
  const isEmailValidated = data.email
    ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
    : true;

  console.log("Email validation:", isEmailValidated);

  if (isEmailValidated) {
    if (data?.password) {
      // Password validation: (min 1: lowerCase, upperCase, Numeric, @$!%*+?& + min 8 chars)
      const isPasswordValidated =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*+?&]).{8,}$/.test(
          data.password
        );

      console.log(
        "Password validation:",
        isPasswordValidated,
        "Password:",
        data.password
      );

      if (isPasswordValidated) {
        // Uncomment the encryption line before deployment
        // this.password = passwordEncrypt(data.password);
        this.password = data.password;
        this._update = data; // updateOne will wait for data from "this._update".
        next();
      } else {
        return next(new Error("Password not validated."));
      }
    } else {
      // If no password is provided, proceed (assuming it's an update operation that doesn't modify the password)
      next();
    }
  } else {
    return next(new Error("Email not validated."));
  }
});

/* ------------------------------------------------------- */
// FOR REACT PROJECT:
UserSchema.pre("init", function (data) {
  data.id = data._id;
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
});
/* ------------------------------------------------------- */
module.exports = mongoose.model("User", UserSchema);

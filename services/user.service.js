const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const { hashedPassword } = require("../utils/helpers");
const { log } = require("console");

exports.getAllUsersServices = async (start, limit) => {
  const users = await User.find().select({
    __v: 0,
    date: 0,
  })
    .skip(start)
    .limit(limit);
  return users;
};

exports.createUserServices = async (body, file) => {
  const { name, email, password, address, role, phone } = body;
  const photo = file?.filename || null;
  const newUser = new User({
    name,
    email,
    password,
    address,
    photo,
    phone,
    role
  });
  const result = await User.create(newUser);
  return result;
};

exports.userLoginServices = async (email) => {
  const user = await User.find({ email: email });
  return user;
};

exports.updateUserServices = async (email, userData, file) => {
  const user = await User.findOne({ email: email });
  if (userData.email) {
    throw new Error("Email not updated");
  }
  if (!user) {
    throw new Error("User not found!");
  }
  const previousImagePath = path.join("uploads", user.photo);


  // return user
  const newUser = {
    ...user.toObject(),
    ...userData,
  };
  if (userData.password) {
    newUser.password = hashedPassword(userData.password, 10)
  }
  delete newUser.email;
  delete newUser._id;
  if (file) {
    fs.access(previousImagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(previousImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
      }
    });
    newUser.photo = file.filename;
  }

  const result = await User.updateOne({ email: email }, newUser, {
    runValidators: true,
  });
  return result;
};

exports.deleteUserServices = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.photo) {
    const imagePath = path.join("uploads", user.photo);
    fs.unlinkSync(imagePath);
  }
  const result = await User.deleteOne({ email });
  return result;
};

exports.getUserByEmailServices = async (email) => {
  // Find the user by email
  const user = await User.findOne({ email });
  console.log('sdgad', user);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

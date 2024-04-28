const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: {
      validator: async function (email) {
        const existingUser = await User.findOne({ email });
        return !existingUser;
      },
      message: (props) => `${props.value} is already taken!`,
    },
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        // Password should be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character.
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[^\w\d\s]).{8,}$/.test(
          password
        );
      },
      message: (props) =>
        `Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (phoneNumber) {
        // Validate Bangladeshi phone number format
        return /^(\+)?(88)?01[0-9]{9}$/i.test(phoneNumber);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  photo: {
    type: String,
    required: true,
    validate: {
      validator: function (photoUrl) {
        // Regular expression to check if the URL ends with .jpg, .jpeg, or .png
        return /\.(jpg|jpeg|png)$/i.test(photoUrl);
      },
      message: (props) => `${props.value} is not a valid photo URL!`,
    },
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});



const User = mongoose.model("User", userSchema);

module.exports = User;

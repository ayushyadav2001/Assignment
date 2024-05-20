const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const register = async (req, res) => {
  const validationRules = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("mobileNumber").notEmpty().withMessage("Mobile number is required"),
    body("emailId")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ];

  try {
    await Promise.all(
      validationRules.map((validationRule) => validationRule.run(req))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { firstName, lastName, mobileNumber, emailId, password } = req.body;

    const userExists = await User.findOne({
      $or: [{ mobileNumber }, { email: emailId }],
    });
    if (userExists) {
      return res.status(409).json({
        error: "User already registered!",
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
      email: emailId,
      password,
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "720h",
    });
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const validationRules = [
    body("emailId")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ];

  try {
    await Promise.all(
      validationRules.map((validationRule) => validationRule.run(req))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { emailId, password } = req.body;

    const user = await User.findOne({ email: emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "720h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getProfileData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const Auth = {
  register,
  login,
  getProfileData,
};
module.exports = Auth;

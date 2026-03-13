

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.json({
        message: "Login successful",
        user,
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

  const updatedUser = await user.save();

  res.json(updatedUser);
};



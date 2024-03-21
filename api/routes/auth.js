const { UserModel } = require("../db/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
var { JWT_SECRET } = require("./../middleware/verifyToken");

const prodOptions = {
  secure: true,
  httpOnly: true,
};
const nonProdOptions = {
  secure: false,
  httpOnly: true,
};

async function sendTokenAsCookieInResponse(res, user) {
  // Generate JWT token
  const token = jwt.sign(
    { email: user.email, profilePic: user?.profilePic, displayName: user.displayName },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("AUTH_TOKEN", token, process.env.NODE_ENV === "production" ? prodOptions : nonProdOptions);
  delete user["hashedPassword"];
  res.send(user);
}

/* Login as user */
router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;
  // Mock user data for demonstration (replace with actual database queries)
  const foundUser = await UserModel.findOne({ email });
  console.log(foundUser);
  // Check if the email exists and passwords match
  if (email !== foundUser?.email || !(await bcrypt.compare(password, foundUser.hashedPassword))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Send the token in the response
  sendTokenAsCookieInResponse(res, foundUser);
});

/* Create new user */
router.post("/newUser", async function (req, res) {
  console.log(req.body);
  const { email, password, displayName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 11);
  const userToCreate = new UserModel({ email, hashedPassword, displayName });
  const createdUser = await userToCreate.save();
  sendTokenAsCookieInResponse(res, createdUser);
});

module.exports = router;

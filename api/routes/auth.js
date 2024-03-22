const moment = require("moment");
const { UserModel } = require("../db/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
var { JWT_SECRET } = require("./../middleware/verifyToken");

const RefreshTokenTtlMillis = 30 * 24 * 60 * 60 * 1000; // 30 days
const AccessTokenTtlMillis = 60 * 60 * 1000; // 1 Hour

const defaultTokenOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

async function sendVerificationEmail(user) {
  const verificationCode = crypto.randomUUID();

  const accountVerification = {
    verified: false,
    emailSentDate: moment().toISOString(),
    verificationCode,
  };
  user.accountVerification = accountVerification;

  const savedUser = await user.save();

  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 587,
    auth: {
      user: "no-reply@flowerboy.app",
      pass: "5YIE6W12SXPxvpop7l4=",
    },
  });

  const verificationUrl =
    process.env.NODE_ENV === "production"
      ? "https://flowerboy.app/verify-email/" + user.accountVerification.verificationCode
      : "http://192.168.86.68/verify-email/" + user.accountVerification.verificationCode;

  var mailOptions = {
    from: "no-reply@flowerboy.app",
    to: user.email,
    subject: "Flower Boy - Verification",
    text: `<!DOCTYPE html>
    <html lang="en"><p>Hey there ${user.displayName}!</p><br/><p>Click <a href="${verificationUrl}">HERE</a> to verify your email!</p></html>
    `,
  };

  console.log("saved user: ", savedUser);

  const emailResult = await transporter.sendMail(mailOptions);
  console.log("email results: ", emailResult);
  return savedUser;
}

async function sendNewRefreshToken(user, res) {
  // Generate refresh token
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "30d" });
  res.cookie("REFRESH_TOKEN", token, {
    ...defaultTokenOptions,
    maxAge: RefreshTokenTtlMillis,
    path: process.env.NODE_ENV === "production" ? "/api/auth/refresh" : "/auth/refresh",
  });
}

async function loginAsUser(user, response) {
  sendNewAccessToken(user, response);
  sendNewRefreshToken(user, response);
  delete user["hashedPassword"];
  response.send({
    email: user.email,
    profilePic: user.profilePic,
    displayName: user.displayName,
    accountVerification: {
      verified: user.accountVerification.verified,
    },
  });
}

async function sendNewAccessToken(user, res) {
  // Generate access token
  const token = jwt.sign(
    { _id: user._id, email: user.email, profilePic: user?.profilePic, displayName: user.displayName },
    JWT_SECRET,
    { expiresIn: "30s" }
  );
  res.cookie("ACCESS_TOKEN", token, { ...defaultTokenOptions, maxAge: AccessTokenTtlMillis });
}

/* Handle login attempt */
router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  // Mock user data for demonstration (replace with actual database queries)
  const foundUser = await UserModel.findOne({ email: email.toLocaleLowerCase() });
  // Check if the email exists and passwords match
  if (!foundUser || !(await bcrypt.compare(password, foundUser.hashedPassword))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Send the token in the response
  loginAsUser(foundUser, res);
});

/* Create new user */
router.post("/newUser", async function (req, res) {
  const { email, password, displayName } = req.body;

  const foundUser = await UserModel.findOne({ email: email.toLocaleLowerCase() });
  const hashedPassword = await bcrypt.hash(password, 11);

  if (foundUser && foundUser.accountVerification.verified) {
    return res.status(400).json({ error: "Account with this email already exists" });
  }

  const userToSave = new UserModel({
    email: email.toLocaleLowerCase(),
    hashedPassword,
    displayName,
    accountVerification: {
      verified: false,
    },
  });

  if (foundUser && !foundUser.accountVerification.verified) {
    // Resend email for existing account - mebbe they forgot about this or it expired. 🤷‍♀️
    userToSave._id = _foundUser;
  }

  const createdUser = await userToSave.save();
  await sendVerificationEmail(createdUser);
  loginAsUser(createdUser, res);
});

/* Verify user email */
router.post("/verifyEmail", async function (req, res) {
  const { verificationCode, userId } = req.body;

  const foundUser = await UserModel.findById(userId);

  const curDate = moment()

  if(foundUs)

  if (foundUser && foundUser.accountVerification.verified) {
    return res.status(400).json({ error: "Account with this email already exists" });
  }

  const userToSave = new UserModel({
    email: email.toLocaleLowerCase(),
    hashedPassword,
    displayName,
    accountVerification: {
      verified: false,
    },
  });

  if (foundUser && !foundUser.accountVerification.verified) {
    // Resend email for existing account - mebbe they forgot about this or it expired. 🤷‍♀️
    userToSave._id = _foundUser;
  }

  const createdUser = await userToSave.save();
  await sendVerificationEmail(createdUser);
  loginAsUser(createdUser, res);
});

// Example endpoint for refreshing access token using refresh token
router.get("/refresh", async function (req, res) {
  const refreshToken = req.cookies.REFRESH_TOKEN;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized: Missing refresh token" });
  }
  // Validate refresh token and issue new access token
  jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid refresh token" });
    }
    const foundUser = await UserModel.findById(decoded._id);
    // TODO: check if foundUser's status is still active/verified
    if (!foundUser) {
      return res.status(403).json({ error: "Forbidden: User not found" });
    }
    sendNewAccessToken(foundUser, res);
    res.status(204).end();
  });
});

router.get("/logout", async function (req, res) {
  res.clearCookie("REFRESH_TOKEN", { httpOnly: true });
  res.clearCookie("ACCESS_TOKEN", { httpOnly: true });
  res.status(204).end();
});

module.exports = router;

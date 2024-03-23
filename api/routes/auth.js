const moment = require("moment");
const { UserModel } = require("../db/userSchema");
const { OrganizationModel } = require("../db/organizationSchema");
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
    // Expire after 1 day
    verificationCodeExpirationDate: moment().add(1, "day").toISOString(),
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
      pass: process.env.TITAN_MAIL_PASSWORD,
    },
  });

  const verificationUrl =
    process.env.NODE_ENV === "production"
      ? "https://flowerboy.app/verify-email/" + user.accountVerification.verificationCode + "/" + user._id
      : "http://192.168.86.68:3000/verify-email/" + user.accountVerification.verificationCode + "/" + user._id;

  var mailOptions = {
    from: '"Flower Boy" <no-reply@flowerboy.app>',
    to: user.email,
    subject: "Verify Your Email",
    text: `Welcome to Flower Boy`,
    html: `<!DOCTYPE html>
    <html lang="en"><body><p>Hey there ${user.displayName}!</p><p>Click <a href="${verificationUrl}">HERE</a> to verify your email!</p>
    <p>Let's get growing!</p></body></html>
    `,
  };

  const emailResult = await transporter.sendMail(mailOptions);
  return savedUser;
}

async function addUserToOrganization(user, org) {
  if (!user.organizations) {
    user.organizations = [];
  }
  user.organizations.push(org);

  const userWithOrgAdded = await user.save().populate("organizations.$.name");

  if (!org.members) {
    org.members = [];
  }
  org.members.push({ role: ["ADMIN"], user: userWithOrgAdded });

  const orgWithUserAdded = await org.save();
  return userWithOrgAdded;
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
    organizations: user.organizations,
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
  const foundUser = await UserModel.findOne({ email: email.toLocaleLowerCase() }).populate("organizations.$.name");
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
  const GULB_ORG = await OrganizationModel.findOne({});
  let userToVerify;

  if (foundUser && !foundUser.accountVerification.verified) {
    // Resend email for existing account - mebbe they forgot about this or it expired. 🤷‍♀️
    foundUser.hashedPassword = hashedPassword;
    foundUser.displayName = displayName;
    userToVerify = await foundUser.save();
  } else {
    const userToSave = new UserModel({
      email: email.toLocaleLowerCase(),
      hashedPassword,
      displayName,
      accountVerification: {
        verified: false,
      },
    });
    userToVerify = await userToSave.save();
  }

  const userWithOrg = await addUserToOrganization(userToVerify, GULB_ORG);

  await sendVerificationEmail(userWithOrg);
  loginAsUser(userWithOrg, res);
});

/* Verify user email */
router.post("/verifyEmail", async function (req, res) {
  const { verificationCode, _id } = req.body;

  let foundUser = await UserModel.findById(_id).populate("organizations.$.name");

  if (!foundUser) {
    return res.status(403).json({ error: "Forbidden: User not found" });
  }

  const curDate = moment().toISOString();

  const codeExpired = foundUser.accountVerification.verificationCodeExpirationDate < curDate;
  const codesMatch = verificationCode === foundUser.accountVerification.verificationCode;
  if (codeExpired) {
    return res.status(400).json({ error: "Verification code expired" });
  }
  if (!codesMatch) {
    return res.status(400).json({ error: "Verification code mismatch" });
  }

  if (!foundUser.accountVerification.verified) {
    foundUser.accountVerification = {
      verified: true,
      verificationDate: curDate,
    };
    foundUser = await foundUser.save();
  }

  loginAsUser(foundUser, res);
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

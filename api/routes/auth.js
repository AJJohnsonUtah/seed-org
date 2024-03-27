const moment = require("moment");
const { UserModel } = require("../db/userSchema");
const { OrganizationModel } = require("../db/organizationSchema");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var { JWT_SECRET } = require("./../middleware/verifyToken");
const crypto = require("crypto");
const { PlantingModel } = require("../db/plantingSchema");
const { OrderModel } = require("../db/orderSchema");
const OrganizationService = require("../services/organizationService");
const EmailService = require("../services/emailService");
const TokenService = require("../services/tokenService");

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

  const verificationUrl =
    process.env.NODE_ENV === "production"
      ? "https://flowerboy.app/verify-email/" + user.accountVerification.verificationCode + "/" + user._id
      : "http://192.168.86.68:3000/verify-email/" + user.accountVerification.verificationCode + "/" + user._id;

  const emailSubject = "Verify Your Email";
  const emailBody = `<!DOCTYPE html>
      <html lang="en"><body><p>Hey there ${user.displayName}!</p><p>Click <a href="${verificationUrl}">HERE</a> to verify your email!</p>
      <p>Let's get growing!</p></body></html>`;
  EmailService.sendEmail(user.email, emailSubject, emailBody);

  return savedUser;
}

async function logUserOut(res) {
  res.clearCookie("REFRESH_TOKEN", { httpOnly: true });
  res.clearCookie("ACCESS_TOKEN", { httpOnly: true });
}

async function loginAsUser(user, response) {
  TokenService.sendNewAccessToken(user, response);
  TokenService.sendNewRefreshToken(user, response);
  delete user["hashedPassword"];
  const orgsToDisplay = user.organizations.map((o) => ({
    _id: o._id,
    name: o.name,
    role: o.members.find((m) => m.user._id.equals(user._id)).role,
  }));
  response.send({
    _id: user._id,
    email: user.email,
    profilePic: user.profilePic,
    displayName: user.displayName,
    accountVerification: {
      verified: user.accountVerification.verified,
    },
    organizations: orgsToDisplay,
  });
}

/* Handle login attempt */
router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  // Mock user data for demonstration (replace with actual database queries)
  const foundUser = await UserModel.findOne({ email: email.toLocaleLowerCase() }).populate("organizations");
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
  const standardizedEmail = email.toLocaleLowerCase();
  const foundUser = await UserModel.findOne({ email: standardizedEmail });
  const hashedPassword = await bcrypt.hash(password, 11);

  if (foundUser && foundUser.accountVerification.verified) {
    return res.status(400).json({ error: "Account with this email already exists" });
  }
  let userToVerify;

  if (foundUser && !foundUser.accountVerification.verified) {
    // Resend email for existing account - mebbe they forgot about this or it expired. 🤷‍♀️
    foundUser.hashedPassword = hashedPassword;
    foundUser.displayName = displayName;
    userToVerify = await foundUser.save();
  } else {
    const userToSave = new UserModel({
      email: standardizedEmail,
      hashedPassword,
      displayName,
      accountVerification: {
        verified: false,
      },
    });
    userToVerify = await userToSave.save();
  }

  // Add user to any orgs they are a "pending member" of
  const orgsInvitedTo = await OrganizationModel.find({ pendingMembers: { email: standardizedEmail } });
  let userWithOrgs = userToVerify;
  for (const org of orgsInvitedTo) {
    userWithOrgs = await OrganizationService.addUserToOrganization(userWithOrgs, org, ["CONTRIBUTOR"]);
  }

  await sendVerificationEmail(userWithOrgs);
  loginAsUser(userWithOrgs, res);
});

/* Verify user email */
router.post("/verifyEmail", async function (req, res) {
  const { verificationCode, _id } = req.body;

  let foundUser = await UserModel.findById(_id).populate("organizations");

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
      logUserOut(res);
      return res.status(403).json({ error: "Unauthorized: Invalid refresh token" });
    }
    const foundUser = await UserModel.findById(decoded._id);
    // TODO: check if foundUser's status is still active/verified
    if (!foundUser) {
      logUserOut(res);
      return res.status(403).json({ error: "Forbidden: User not found" });
    }
    TokenService.sendNewAccessToken(foundUser, res);
    res.status(204).end();
  });
});

router.get("/logout", async function (req, res) {
  logUserOut(res);
  res.status(204).end();
});

module.exports = router;

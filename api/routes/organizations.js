const moment = require("moment");
var express = require("express");
const { OrderModel } = require("../db/orderSchema.js");
const { OrganizationModel } = require("../db/organizationSchema.js");
const { UserModel } = require("../db/userSchema.js");
const OrganizationService = require("../services/organizationService.js");
const TokenService = require("../services/tokenService.js");
var router = express.Router();

/* GET order */
router.get("/:_organizationId", async function (req, res, next) {
  const org = await OrganizationModel.findById(req.params._organizationId).populate("members.user", "-hashedPassword");
  res.send(org);
});

router.post("/:_organizationId/addMember", async function (req, res, next) {
  const memberEmail = req.body.email.toLocaleLowerCase();

  // Check if member exists by email. If so, add them to this org (if not already added!)
  const foundUser = await UserModel.findOne({ email: memberEmail });
  const foundOrg = await OrganizationModel.findById(req.params._organizationId).populate(
    "members.user",
    "-hashedPassword"
  );
  if (!foundOrg) {
    return res.status(404).json({ error: "Organization not found" });
  }
  if (foundUser) {
    const [updatedUser, updatedOrg] = await OrganizationService.addUserToOrganization(foundUser, foundOrg, [
      "CONTRIBUTOR",
    ]);
    return res.send(updatedOrg);
  } else {
    // If user with that email doesn't exist, send em an email and add them to... pending members?
    const pendingUser = { email: memberEmail, invitedDate: moment().toISOString(), role: ["CONTRIBUTOR"] };
    const updatedOrg = await OrganizationService.addPendingUserToOrganization(pendingUser, foundOrg, req.user);
    return res.send(updatedOrg);
  }
});

router.post("/:_organizationId/revokeInvite", async function (req, res, next) {
  const memberEmail = req.body.email.toLocaleLowerCase();
  console.log("removing users with email", memberEmail);
  const updatedOrg = await OrganizationModel.findByIdAndUpdate(
    req.params._organizationId,
    {
      $pull: {
        pendingMembers: { email: memberEmail },
      },
    },
    { new: true }
  ).populate("members.user", "-hashedPassword");
  if (!updatedOrg) {
    return res.status(404).json({ error: "Organization not found" });
  }
  return res.send(updatedOrg);
});

router.delete("/:_organizationId/removeMember/:_userId", async function (req, res, next) {
  const foundOrg = await OrganizationModel.findById(req.params._organizationId);
  const foundUser = await UserModel.findById(req.params._userId);
  if (!foundOrg || !foundUser) {
    return res.status(404).json({ error: "Organization or user not found" });
  }
  const [updatedOrg, updateduser] = await OrganizationService.unlinkUserAndOrganization(foundUser, foundOrg);
  return res.send(updatedOrg);
});

/* POST new organization */
router.post("/", async function (req, res, next) {
  const organization = req.body;
  const currentUser = await UserModel.findById(req.user._id);
  const orgToCreate = new OrganizationModel(organization);
  const savedOrganization = await orgToCreate.save();
  const [updatedUser, updatedOrg] = await OrganizationService.addUserToOrganization(currentUser, savedOrganization, ["ADMIN"]);
  TokenService.sendNewAccessToken(updatedUser, res);
  res.send(savedOrganization);
});

/* DELETE organization */
router.delete("/:_organizationId", async function (req, res, next) {
  const foundOrg = await OrganizationModel.findById(req.params._organizationId);
  const usersToRemoveLink = [...foundOrg.members];
  for (const userToRemoveLink of usersToRemoveLink) {
    const updatedUser = await UserModel.findByIdAndUpdate(userToRemoveLink._id, {
      $pull: {
        organizations: { _id: req.params._organizationId },
      },
    });
  }
  OrganizationModel.findByIdAndDelete(req.params._organizationId).then(() => res.sendStatus(204));
});

module.exports = router;

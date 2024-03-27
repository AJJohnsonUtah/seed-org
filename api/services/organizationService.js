const { OrganizationModel } = require("../db/organizationSchema");
const { UserModel } = require("../db/userSchema");
const EmailService = require("./emailService");

async function sendWelcomeEmail(pendingUser, org, invitedBy) {
  const appUrl =
    process.env.NODE_ENV === "production"
      ? "https://flowerboy.app/public/sign-up"
      : "http://192.168.86.68:3000/public/sign-up";

  const emailSubject = "You've been invited";
  const emailBody = `
  <html>
    <body>
      <p>
        You've been invited by ${invitedBy.displayName} to join ${org.name} using the Flower Boy farm/garden assistant.
      </p>
      <p>
        <a href='${appUrl}'>Click here</a> to get started.
      </p>
    </body>
  </html>
  `;
  return await EmailService.sendEmail(pendingUser.email, emailSubject, emailBody);
}

const OrganizationService = {
  addPendingUserToOrganization: async (pendingUser, org, invitedBy) => {
    if (!org.pendingMembers) {
      org.pendingMembers = [];
    }

    let orgWithMember = org;
    if (!org.pendingMembers.find((pu) => pu.email === pendingUser.email)) {
      // Doesn't already exist. Add 'em!
      org.pendingMembers.push(pendingUser);
      orgWithMember = await org.save().then((o) => o.populate("members.user", "-hashedPassword"));
    }
    const emailResult = sendWelcomeEmail(pendingUser, org, invitedBy);
    return orgWithMember;
  },
  addUserToOrganization: async (user, org, role) => {
    if (!user.organizations) {
      user.organizations = [];
    }

    // Add org to user if not already added
    let userWithOrg = user;
    if (!user.organizations.find((o) => o._id.equals(org._id))) {
      user.organizations.push(org);
      userWithOrg = await user.save().then((u) => u.populate("organizations"));
    }

    if (!org.members) {
      org.members = [];
    }
    // Remove user from pending users if they were pending
    if (org.pendingMembers) {
      const foundIndex = org.pendingMembers.findIndex((pm) => pm.email === user.email);
      if (foundIndex >= 0) {
        org.pendingMembers.splice(foundIndex, 1);
      }
    }

    // Add user to org if not already added
    let orgWithUser = org;
    if (!org.members.find((m) => m.user._id.equals(user._id))) {
      org.members.push({ role, user: user });
      orgWithUser = await org.save().then((o) => o.populate("members.user", "-hashedPassword"));
    }

    return [userWithOrg, orgWithUser];
  },
  unlinkUserAndOrganization: async (user, org) => {
    // Add org to user if not already added
    let userWithOrg = user;
    if (!user.organizations.find((o) => o._id.equals(org._id))) {
      user.organizations.push(org);
      userWithOrg = await user.save();
    }

    const updatedOrg = await OrganizationModel.findByIdAndUpdate(
      org._id,
      {
        $pull: {
          members: { user: { _id: user._id } },
        },
      },
      { new: true }
    ).populate("members.user", "-hashedPassword");

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          organizations: { _id: org._id },
        },
      },
      { new: true }
    )
      .select("-hashedPassword")
      .populate("organizations");

    return [updatedOrg, updatedUser];
  },
};

module.exports = OrganizationService;

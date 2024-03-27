const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/verifyToken");

const RefreshTokenTtlMillis = 30 * 24 * 60 * 60 * 1000; // 30 days
const AccessTokenTtlMillis = 60 * 60 * 1000; // 1 Hour

const defaultTokenOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

const TokenService = {
  sendNewRefreshToken: async (user, res) => {
    // Generate refresh token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.cookie("REFRESH_TOKEN", token, {
      ...defaultTokenOptions,
      maxAge: RefreshTokenTtlMillis,
      path: process.env.NODE_ENV === "production" ? "/api/auth/refresh" : "/auth/refresh",
    });
  },

  sendNewAccessToken: async (user, res) => {
    // Generate access token
    const token = jwt.sign(
      { _id: user._id, email: user.email, profilePic: user?.profilePic, displayName: user.displayName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("ACCESS_TOKEN", token, { ...defaultTokenOptions, maxAge: AccessTokenTtlMillis });
  },
};
module.exports = TokenService;

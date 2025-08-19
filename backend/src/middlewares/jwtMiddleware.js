const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized", error: error.message });
  }
};

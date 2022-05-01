const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") next();

  try {
    //   Getting the token from the request object
    const token = req.headers.authorization.split(" ")[1];

    // Checking if the user hsa access token
    if (!token)
      return res.status(403).json({ message: "User is not athenticated" });

    //   Decoding the token
    const decodeData = jwt.verify(token, secret);

    //  Creating new request object
    req.user = decodeData;

    next();
  } catch (error) {
    cansole.log.error(error);
    return res.status(403).json({ message: "User is not athenticated" });
  }
};

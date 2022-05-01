const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") next();

    try {
      //   Getting the token from the request object
      const token = req.headers.authorization.split(" ")[1];

      // Checking if the user hsa access token
      if (!token)
        return res.status(403).json({ message: "User is not athenticated" });

      const { roles: userRoles } = jwt.verify(token, secret);

      let hasRole = false;

      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole)
        return res
          .status(403)
          .json({ message: "User not allowed to get data" });

      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "User is not athenticated" });
    }
  };
};

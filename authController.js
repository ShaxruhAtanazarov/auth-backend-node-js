const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };

  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  // user Registration
  async registration(req, res) {
    try {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        return res.status(400).json({ message: "Error registration", error });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      // Check if the user is already registered
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User has already been registered" });
      }

      // Hashing password for authentication
      const hashPassword = bcrypt.hashSync(password, 7);

      // Getting user roles
      const userRole = await Role.findOne({ value: "user" });

      // create a new user in the database
      const user = await new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });

      // Saving the user to the database
      await user.save();

      return res.json({ message: "User has registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Registration failed" });
    }
  }

  //   user Login
  async login(req, res) {
    try {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        return res.status(400).json({ message: "Error in Logging", error });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username });

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!user)
        return res.status(400).json({ message: `Such ${user} user not found` });

      if (!validPassword)
        return res.status(400).json({ message: `Invalid password` });

      const token = generateAccessToken(user._id, user.roles);

      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Login failed" });
    }
  }

  //   getUsers
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new authController();

const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./Middleware/authMiddleware");
const roleMiddleware = require("./Middleware/roleMiddleware");

router.post(
  "/registrations",
  //   Validating registration
  [
    check("username", "Username field conn't be empty").notEmpty(),
    check(
      "password",
      "Password conn't be less than 4 characters and more than 10 characters"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post(
  "/login",

  [
    check("username", "Username field conn't be empty").notEmpty(),
    check(
      "password",
      "Password conn't be less than 4 characters and more than 10 characters"
    ).isLength({ min: 4, max: 10 }),
  ],

  controller.login
);
router.get("/users", roleMiddleware(["admin"]), controller.getUsers);

module.exports = router;

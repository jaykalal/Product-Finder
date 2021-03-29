const { check, sanitizeBody } = require("express-validator");
exports.form = [
  // email address validation
  check("email")
    .notEmpty()
    .withMessage("Email Address required")
    .normalizeEmail()
    .isEmail()
    .withMessage("must be a valid email"),

  // password validation
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 5 })
    .withMessage("password must be minimum 5 length")
    .matches(/(?=.*?[A-Z])/)
    .withMessage("At least one Uppercase")
    .matches(/(?=.*?[a-z])/)
    .withMessage("At least one Lowercase")
    .matches(/(?=.*?[0-9])/)
    .withMessage("At least one Number")
    .matches(/(?=.*?[#?!@$%^&*-])/)
    .withMessage("At least one special character")
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
  //confirm email validation
  check("confirmEmail").custom((value, { req }) => {
    if (value !== req.body.email) {
      throw new Error("Email Confirmation does not match Email");
    } else {
      return true;
    }
  }),

  // confirm password validation
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password Confirmation does not match password");
    }
    return true;
  }),
];
exports.loginform = [
  // email address validation
  check("email")
    .notEmpty()
    .withMessage("Email Address required")
    .normalizeEmail()
    .isEmail()
    .withMessage("must be a valid email"),

  // password validation
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 5 })
    .withMessage("password must be minimum 5 length")
    .matches(/(?=.*?[A-Z])/)
    .withMessage("At least one Uppercase")
    .matches(/(?=.*?[a-z])/)
    .withMessage("At least one Lowercase")
    .matches(/(?=.*?[0-9])/)
    .withMessage("At least one Number")
    .matches(/(?=.*?[#?!@$%^&*-])/)
    .withMessage("At least one special character")
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
];

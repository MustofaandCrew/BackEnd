const { validationResult } = require("express-validator");

module.exports = {
  validate(req, res, next) {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
};

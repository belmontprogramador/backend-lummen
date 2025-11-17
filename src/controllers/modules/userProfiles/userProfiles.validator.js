const { body, query } = require("express-validator");

module.exports = {
  localeHeaderValidator: [
    query("locale").optional().isString().isLength({ min: 2, max: 5 }),
  ]
};

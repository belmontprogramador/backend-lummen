// src/modules/users/user.validator.js
const Joi = require("joi");

module.exports = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    isPaid: Joi.boolean().optional(),
    status: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

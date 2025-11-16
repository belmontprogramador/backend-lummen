const Joi = require("joi");

module.exports = {
  validateCreate(body) {
    const schema = Joi.object({
      // nenhum field textual, apenas validação básica
    });

    const result = schema.validate(body);
    if (result.error) throw new Error(result.error.message);
  },

  validateUpdatePosition(params) {
    const schema = Joi.object({
      userId: Joi.string().uuid().required(),
      position: Joi.number().integer().min(1).max(8).required(),
    });

    const result = schema.validate(params);
    if (result.error) throw new Error(result.error.message);
  },

  validateList(params) {
    const schema = Joi.object({
      userId: Joi.string().uuid().required(),
    });

    const result = schema.validate(params);
    if (result.error) throw new Error(result.error.message);
  },

  validateDelete(params) {
    const schema = Joi.object({
      photoId: Joi.string().uuid().required(),
    });

    const result = schema.validate(params);
    if (result.error) throw new Error(result.error.message);
  }
};

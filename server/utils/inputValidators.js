// utils/inputValidator.js
const Joi = require('joi');

const schemas = {
  user: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().valid('buyer', 'seller').required()
  }),
  product: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required()
  }),
  order: Joi.object({
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).required(),
    shippingAddress: Joi.string().required()
  })
};

const validateInput = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

module.exports = { schemas, validateInput };
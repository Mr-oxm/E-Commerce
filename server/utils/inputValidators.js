// utils/inputValidator.js
const Joi = require('joi');

const schemas = {
  // User related schemas
  userSignup: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  }),
  
  // Product related schemas
  productCreate: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().required(),
    category: Joi.array().items(Joi.string()).required(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()),
    hasVariations: Joi.boolean(),
    variations: Joi.when('hasVariations', {
      is: true,
      then: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          options: Joi.array().items(
            Joi.object({
              name: Joi.string().required(),
              price: Joi.number().positive().required(),
              stock: Joi.number().integer().min(0).required()
            })
          ).required()
        })
      ).required(),
      otherwise: Joi.forbidden()
    }),
    basePrice: Joi.when('hasVariations', {
      is: true,
      then: Joi.number().positive().required(),
      otherwise: Joi.forbidden()
    })
  }),


  // Review related schemas
  reviewCreate: Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(10).max(500).required()
  }),
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
    
    next();
  };
};

module.exports = { schemas, validate };
import Joi from 'joi';

export const schemas = {
  sma: Joi.object({
    tp: Joi.number().integer().min(5).max(200).required(),
    date: Joi.date().iso().optional()
  }),

  smaByDate: Joi.object({
    tp: Joi.number().integer().min(5).max(200).required(),
    date: Joi.date().iso().required()
  }),

  updateRole: Joi.object({
    uid: Joi.string().required(),
    role: Joi.string().valid('ADMIN', 'LAWYER', 'COMMON_USER').required()
  }),

  customSma: Joi.object({
    sma_period: Joi.number().integer().min(5).max(200).optional(),
    threshold_pct: Joi.number().min(0.1).max(10).optional()
  })
};

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

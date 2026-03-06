import Joi from 'joi';

const addBookSchema = Joi.object({
  title: Joi.string().min(1).required(),
  author: Joi.string().min(1).required(),
  year: Joi.number().integer().min(0).required(),
  totalPages: Joi.number().integer().min(0).required(),
});

const updateBookSchema = Joi.object({
  title: Joi.string().min(1).optional(),
  author: Joi.string().min(1).optional(),
  year: Joi.number().integer().min(0).optional(),
  totalPages: Joi.number().integer().min(0).optional(),
});

const addBookReviewSchema = Joi.object({
  rating: Joi.number()
    .valid(0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
    .optional(),
  resume: Joi.string().max(1000).optional(),
});

export { addBookSchema, updateBookSchema, addBookReviewSchema };

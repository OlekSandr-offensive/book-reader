import Joi from 'joi';

export const addBookSchema = Joi.object({
  title: Joi.string().min(1).required(),
  author: Joi.string().min(1).required(),
  year: Joi.number().integer().min(0).required(),
  text: Joi.string().min(1).required(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(1),
  author: Joi.string().min(1),
  year: Joi.number().integer().min(0),
  text: Joi.string().min(1),
});


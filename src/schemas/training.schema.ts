import Joi from 'joi';

const trainingSchema = Joi.object({
  bookIds: Joi.array().items(Joi.number()).required().messages({
    'array.base': 'Book IDs must be an array',
    'any.required': 'Book IDs are required',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  finishDate: Joi.date().required().messages({
    'date.base': 'Finish date must be a valid date',
    'any.required': 'Finish date is required',
  }),
});

const addDailyProgressSchema = Joi.object({
  trainingId: Joi.number().integer().required().messages({
    'number.base': 'Training ID must be a number',
    'any.required': 'Training ID is required',
  }),
  bookId: Joi.number().integer().required().messages({
    'number.base': 'Book ID must be a number',
    'any.required': 'Book ID is required',
  }),
  pagesRead: Joi.number().integer().min(1).required().messages({
    'number.min': 'You must read at least 1 page',
    'number.base': 'Pages read must be a number',
    'any.required': 'Pages read is required',
  }),
});

export { trainingSchema, addDailyProgressSchema };

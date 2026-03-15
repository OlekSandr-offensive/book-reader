import Joi from 'joi';
import dayjs from 'dayjs';

const trainingSchema = Joi.object({
  bookIds: Joi.array().items(Joi.number()).min(1).required().messages({
    'array.base': 'Book IDs must be an array',
    'array.min': 'At least one book ID is required',
    'any.required': 'Book IDs are required',
  }),
  startDate: Joi.date()
    .iso()
    .custom((value, helpers) => {
      const start = dayjs(value).startOf('day');
      const today = dayjs().startOf('day');
      if (!start.isSame(today)) {
        return helpers.message({ custom: 'Start date must be today' });
      }
      return value;
    })
    .required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'any.required': 'Start date is required',
    }),
  finishDate: Joi.date()
    .iso()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': 'Finish date must be a valid date',
      'any.required': 'Finish date is required',
      'date.greater': 'Finish date must be after start date',
    }),
});

const addDailyProgressSchema = Joi.object({
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

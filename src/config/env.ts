import Joi from 'joi';

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  ACCESS_SECRET: Joi.string().required(),
  REFRESH_SECRET: Joi.string().required(),
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Env validation error: ${error.message}`);
}

export default value;

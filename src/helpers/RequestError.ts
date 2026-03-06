import HttpError from './HttpError';

const errorMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

const RequestError = (status: number, message?: string) =>
  new HttpError(status, message ?? errorMessages[status]);

export { RequestError };

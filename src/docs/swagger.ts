import { OpenAPIV3 } from 'openapi-types';
import {
  loginRequest,
  loginResponse,
  signupRequest,
  signupResponse,
  refreshParameter,
  refreshResponse,
  currentResponse,
  logoutParameter,
  logoutResponse,
} from './components/schemas';

import {
  addBookRequest,
  addBookResponse,
  getBooksParameter,
  getBooksResponse,
  getBookByIdParameter,
  getBookByIdResponse,
  updateBookParameter,
  updateBookRequest,
  updateBookResponse,
  deleteBookParameter,
  deleteBookResponse,
  getBookProgressParameter,
  getBookProgressResponse,
  addBookReviewParameter,
  addBookReviewRequest,
  addBookReviewResponse,
} from './components/schemas';

import {
  startTrainingRequest,
  startTrainingResponse,
  getCurrentTrainingResponse,
  addDailyProgressParameter,
  addDailyProgressRequest,
  addDailyProgressResponse,
  getTrainingStatsParameter,
  getTrainingStatsResponse,
} from './components/schemas/training';

const swaggerConfig: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Book Reader API',
    version: '1.0.0',
    description: 'API documentation for the Book Reader application',
    license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication related endpoints' },
    { name: 'Books', description: 'Endpoints related to book management' },
    {
      name: 'Training',
      description: 'Endpoints related to training management',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'User signup',
        requestBody: signupRequest,
        responses: signupResponse,
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'User login',
        requestBody: loginRequest,
        responses: loginResponse,
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        parameters: [refreshParameter],
        responses: refreshResponse,
      },
    },
    '/auth/current': {
      get: {
        tags: ['Auth'],
        summary: 'Get current User profil',
        security: [{ bearerAuth: [] }],
        responses: currentResponse,
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'User logout',
        security: [{ bearerAuth: [] }],
        parameters: [logoutParameter],
        responses: logoutResponse,
      },
    },
    '/books/': {
      post: {
        tags: ['Books'],
        summary: 'Add user book',
        security: [{ bearerAuth: [] }],
        requestBody: addBookRequest,
        responses: addBookResponse,
      },
      get: {
        tags: ['Books'],
        summary: 'Get books',
        security: [{ bearerAuth: [] }],
        parameters: [...getBooksParameter],
        responses: getBooksResponse,
      },
    },
    '/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get book by id',
        security: [{ bearerAuth: [] }],
        parameters: [getBookByIdParameter],
        responses: getBookByIdResponse,
      },
      patch: {
        tags: ['Books'],
        summary: 'Update book by id',
        security: [{ bearerAuth: [] }],
        parameters: [updateBookParameter],
        requestBody: updateBookRequest,
        responses: updateBookResponse,
      },
      delete: {
        tags: ['Books'],
        summary: 'Delete book',
        security: [{ bearerAuth: [] }],
        parameters: [deleteBookParameter],
        responses: deleteBookResponse,
      },
    },
    '/books/{id}/progress': {
      get: {
        tags: ['Books'],
        summary: 'Get progress book',
        security: [{ bearerAuth: [] }],
        parameters: [getBookProgressParameter],
        responses: getBookProgressResponse,
      },
    },
    '/books/{id}/review': {
      post: {
        tags: ['Books'],
        summary: 'Add a review and rating to a book',
        security: [{ bearerAuth: [] }],
        parameters: [addBookReviewParameter],
        requestBody: addBookReviewRequest,
        responses: addBookReviewResponse,
      },
    },
    '/trainings': {
      post: {
        tags: ['Training'],
        summary: 'Start a new workout',
        description:
          'Creates an active workout and puts the selected books into READING status. Does not allow you to create a new one if there is already one active.',
        security: [{ bearerAuth: [] }],
        requestBody: startTrainingRequest,
        responses: startTrainingResponse,
      },
    },
    '/training/current': {
      get: {
        tags: ['Training'],
        summary: 'Get current active workout',
        description:
          'Returns the user active workout. If the workout has expired, the status automatically changes to EXPIRED.',
        security: [{ bearerAuth: [] }],
        responses: getCurrentTrainingResponse,
      },
    },
    '/training/{id}/progress': {
      post: {
        tags: ['Training'],
        summary: 'Add daily progress (pages read)',
        description:
          'Adds read pages to a specific book within a workout. Automatically updates the book (DONE) and workout (COMPLETED) statuses if the goal is achieved.',
        security: [{ bearerAuth: [] }],
        parameters: [addDailyProgressParameter],
        requestBody: addDailyProgressRequest,
        responses: addDailyProgressResponse,
      },
    },
    '/training/{id}/stats': {
      get: {
        tags: ['Training'],
        summary: 'Get workout statistics',
        description:
          'Returns the total number of pages, number of pages read, percentage completed, and detailed daily progress for the graph.',
        security: [{ bearerAuth: [] }],
        parameters: [getTrainingStatsParameter],
        responses: getTrainingStatsResponse,
      },
    },
  },
};

export { swaggerConfig };

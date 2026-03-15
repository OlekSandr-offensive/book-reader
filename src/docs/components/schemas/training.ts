import { OpenAPIV3 } from 'openapi-types';
import { bookCore } from './book';

const trainingCore = {
  id: { type: 'integer', example: 1 },
  userId: { type: 'integer', example: 10 },
  startDate: {
    type: 'string',
    format: 'date-time',
    example: '2024-05-01T00:00:00Z',
  },
  finishDate: {
    type: 'string',
    format: 'date-time',
    example: '2024-05-15T23:59:59Z',
  },
  durationDays: { type: 'integer', example: 15 },
  status: {
    type: 'string',
    enum: ['IN_PROGRESS', 'COMPLETED', 'EXPIRED'],
    example: 'IN_PROGRESS',
  },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
} satisfies Record<string, OpenAPIV3.SchemaObject>;

const trainingBookCore = {
  id: { type: 'integer', example: 101 },
  trainingId: { type: 'integer', example: 1 },
  bookId: { type: 'integer', example: 7 },
  isFinished: { type: 'boolean', example: false },
  countReadPage: {
    type: 'integer',
    example: 45,
    description: 'Number of pages read in this book',
  },
} satisfies Record<string, OpenAPIV3.SchemaObject>;

const dailyProgressCore = {
  id: { type: 'integer', example: 500 },
  userId: { type: 'integer', example: 10 },
  trainingId: { type: 'integer', example: 1 },
  bookId: { type: 'integer', example: 7 },
  date: {
    type: 'string',
    format: 'date-time',
    example: '2024-05-02T14:30:00Z',
  },
  pagesRead: {
    type: 'integer',
    example: 25,
    description: 'Number of pages read in one session',
  },
  createdAt: { type: 'string', format: 'date-time' },
} satisfies Record<string, OpenAPIV3.SchemaObject>;

const startTrainingRequest: OpenAPIV3.RequestBodyObject = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['bookIds', 'startDate', 'finishDate'],
        properties: {
          bookIds: {
            type: 'array',
            items: { type: 'integer' },
            example: [12, 15, 20],
            description: 'IDs of books to be added to the reading plan',
          },
          startDate: trainingCore.startDate,
          finishDate: trainingCore.finishDate,
        },
      },
    },
  },
};

const startTrainingResponse: OpenAPIV3.ResponsesObject = {
  201: {
    description: 'Training started successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: {
              type: 'string',
              example: 'Training started successfully',
            },
            data: {
              type: 'object',
              properties: {
                training: {
                  type: 'object',
                  properties: { ...trainingCore },
                },
              },
            },
          },
        },
      },
    },
  },
  400: {
    description: 'Validation error or active training already exists',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: {
              type: 'string',
              example: 'You already have an active training',
            },
          },
        },
      },
    },
  },
};

const getCurrentTrainingResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Active workout found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                training: {
                  type: 'object',
                  properties: {
                    ...trainingCore,
                    books: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          ...trainingBookCore,
                          book: {
                            type: 'object',
                            properties: { ...bookCore },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  404: {
    description: 'No active training found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'No active training found' },
          },
        },
      },
    },
  },
};

const addDailyProgressParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Current workout ID',
};

const addDailyProgressRequest: OpenAPIV3.RequestBodyObject = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['bookId', 'pagesRead'],
        properties: {
          bookId: dailyProgressCore.bookId,
          pagesRead: dailyProgressCore.pagesRead,
        },
      },
    },
  },
};

const addDailyProgressResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Progress saved successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            trainingFinished: {
              type: 'boolean',
              example: false,
              description: 'Is all training completed after this recording?',
            },
            bookFinished: {
              type: 'boolean',
              example: true,
              description: 'Have you finished reading this particular book?',
            },
            data: {
              type: 'object',
              properties: {
                progress: {
                  type: 'object',
                  properties: { ...dailyProgressCore },
                },
              },
            },
          },
        },
      },
    },
  },
  400: {
    description:
      'Validation error (book already read or number of pages exceeds limit)',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: {
              type: 'string',
              example: 'Pages read cannot exceed total pages of the book (300)',
            },
          },
        },
      },
    },
  },
  404: { description: 'No workout or book found' },
};

const getTrainingStatsParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Workout ID',
};

const getTrainingStatsResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Statistics successfully generated',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                totalPages: {
                  type: 'integer',
                  example: 500,
                  description: 'Total number of pages in all workout books',
                },
                pagesRead: {
                  type: 'integer',
                  example: 250,
                  description: 'How many pages have been read',
                },
                percent: {
                  type: 'integer',
                  example: 50,
                  description: 'Percentage read',
                },
                dailyProgress: {
                  type: 'array',
                  description: 'Array for plotting pages read by day',
                  items: {
                    type: 'object',
                    properties: {
                      date: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-05-10T14:30:00Z',
                      },
                      pagesRead: { type: 'integer', example: 45 },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  404: { description: 'Training not found' },
};

export {
  startTrainingRequest,
  startTrainingResponse,
  getCurrentTrainingResponse,
  addDailyProgressParameter,
  addDailyProgressRequest,
  addDailyProgressResponse,
  getTrainingStatsParameter,
  getTrainingStatsResponse,
};

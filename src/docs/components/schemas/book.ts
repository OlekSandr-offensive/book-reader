import { OpenAPIV3 } from 'openapi-types';

const bookCore = {
  id: { type: 'integer', format: 'int64', example: 1 },
  title: { type: 'string', example: 'All Quiet on the Western Front' },
  author: { type: 'string', example: 'Erich Maria Remarque' },
  year: { type: 'integer', example: 1928 },
  totalPages: { type: 'integer', example: 300 },
  userId: { type: 'integer', format: 'int64', example: 1 },
  rating: {
    type: 'integer',
    format: 'float',
    minimum: 1,
    maximum: 5,
    example: 5.0,
  },
  resume: { type: 'string', example: 'A powerful anti-war novel...' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  status: {
    type: 'string',
    description: 'Current status of the book in the users library',
    enum: ['PLAN', 'READING', 'DONE'],
    default: 'PLAN',
    example: 'READING',
  },
} satisfies Record<string, OpenAPIV3.SchemaObject>;

const addBookRequest: OpenAPIV3.RequestBodyObject = {
  description: 'Book object',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          title: bookCore.title,
          author: bookCore.author,
          year: bookCore.year,
          totalPages: bookCore.totalPages,
        },
      },
    },
  },
};

const addBookResponse: OpenAPIV3.ResponsesObject = {
  201: {
    description: 'Successful operation',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Book created' },
            data: {
              type: 'object',
              properties: {
                book: {
                  type: 'object',
                  properties: {
                    ...bookCore,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const getBooksParameter: OpenAPIV3.ParameterObject[] = [
  {
    name: 'page',
    in: 'query',
    description: 'Page number',
    required: false,
    schema: {
      type: 'string',
      default: 1,
      maximum: 1,
    },
  },
  {
    name: 'limit',
    in: 'query',
    description: 'Number of items per page',
    required: false,
    schema: {
      type: 'string',
      default: 20,
      minimum: 1,
      maximum: 100,
    },
  },
];

const getBooksResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Get books successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                books: {
                  type: 'object',
                  properties: {
                    id: bookCore.id,
                    title: bookCore.title,
                    author: bookCore.author,
                    year: bookCore.year,
                    totalPages: bookCore.totalPages,
                    status: bookCore.status,
                    createdAt: bookCore.createdAt,
                    updatedAt: bookCore.updatedAt,
                  },
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 50 },
                totalQueryPages: { type: 'integer', example: 500 },
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 20 },
                hasNextPage: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
    },
  },
};

const getBookByIdParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Book id',
  schema: {
    type: 'integer',
    example: 7,
  },
};
const getBookByIdResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Книгу знайдено',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
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
  401: { description: 'Not authorized' },
  404: { description: 'Book not found or not owned by user' },
};

const updateBookParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Update book',
};

const updateBookRequest: OpenAPIV3.RequestBodyObject = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          title: bookCore.title,
          author: bookCore.author,
          year: bookCore.year,
          totalPages: bookCore.totalPages,
        },
      },
    },
  },
};

const updateBookResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Book updated successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Book updated successfully' },
            data: {
              type: 'object',
              properties: {
                book: { type: 'object', properties: { ...bookCore } },
              },
            },
          },
        },
      },
    },
  },
  403: { description: 'Trying to update someone else book' },
  404: { description: 'Book not found' },
};

const deleteBookParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Delete book by id',
};

const deleteBookResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Book deleted successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Book deleted successfully' },
          },
        },
      },
    },
  },
  400: {
    description: 'Business logic error (book in READING status)',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: {
              type: 'string',
              example: 'Cannot delete a book that is currently being read',
            },
          },
        },
      },
    },
  },
  403: { description: 'Attempting to delete someone else book' },
  404: { description: 'Book not found' },
};

const getBookProgressParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Book id',
};

const getBookProgressResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Progress successfully calculated',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                bookId: { type: 'integer', example: 7 },
                totalPages: { type: 'integer', example: 300 },
                pagesRead: { type: 'integer', example: 150 },
                percent: { type: 'integer', example: 50 },
              },
            },
          },
        },
      },
    },
  },
  404: { description: 'Book not found' },
};

const addBookReviewParameter: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Book id',
};

const addBookReviewRequest: OpenAPIV3.RequestBodyObject = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['rating'],
        properties: {
          rating: bookCore.rating,
          resume: bookCore.resume,
        },
      },
    },
  },
};

const addBookReviewResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Review successfully added',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                book: { type: 'object', properties: { ...bookCore } },
              },
            },
          },
        },
      },
    },
  },
  400: { description: 'The book has not been read yet (status is not DONE)' },
  404: { description: 'Book not found' },
};

export {
  bookCore,
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
};

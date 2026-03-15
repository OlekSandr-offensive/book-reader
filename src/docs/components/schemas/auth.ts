import { OpenAPIV3 } from 'openapi-types';

const userCore = {
  id: { type: 'integer', format: 'int64', example: 1 },
  name: { type: 'string', example: 'Ivan Ivanov' },
  email: { type: 'string', format: 'email', example: 'ivan@gmail.com' },
  password: {
    type: 'string',
    format: 'password',
    minLength: 6,
    maxLength: 128,
  },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
} satisfies Record<string, OpenAPIV3.SchemaObject>;

const signupRequest: OpenAPIV3.RequestBodyObject = {
  description: 'Signup object',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: userCore.name,
          email: userCore.email,
          password: userCore.password,
        },
        required: ['name', 'email', 'password'],
      },
    },
  },
};

const loginRequest: OpenAPIV3.RequestBodyObject = {
  description: 'Authorizations object',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          email: userCore.email,
          password: userCore.password,
        },
        required: ['email', 'password'],
      },
    },
  },
};

const signupResponse: OpenAPIV3.ResponsesObject = {
  201: {
    description: 'Signup successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Signup successfully',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: userCore.id,
                    email: userCore.email,
                    createdAt: userCore.createdAt,
                  },
                  required: ['name', 'email', 'password'],
                },
              },
            },
          },
        },
      },
    },
  },
  400: {
    description: 'Bad request - invalid request body',
  },
  409: {
    description: 'User with email or name already exists',
  },
};

const loginResponse: OpenAPIV3.ResponsesObject = {
  201: {
    headers: {
      'Set-Cookie': {
        description: 'Refresh token. Have HttpOnly, Secure, SameSite atribute.',
        schema: {
          type: 'string',
          example:
            'refreshToken=abc123xyz; HttpOnly; Secure; SameSite=Strict; Max-Age=604800',
        },
      },
    },
    description: 'Login successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'login successful',
            },
            token: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: userCore.id,
                    email: userCore.email,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  400: {
    description: 'Bad request - invalid request body',
  },
  401: {
    description: 'Bad request - invalid email or password',
  },
};

const refreshParameter: OpenAPIV3.ParameterObject = {
  in: 'cookie',
  name: 'refreshToken',
  required: true,
  schema: { type: 'string' },
  description: 'Refresh token from HttpOnly cookie',
};

const refreshResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Tokens refreshed successfully',
    headers: {
      'Set-Cookie': {
        description: 'Set new refreshToken',
        schema: {
          type: 'string',
          example: 'refreshToken=abc...; HttpOnly; Secure',
        },
      },
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: {
              type: 'string',
              example: 'Tokens refreshed successfully',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1Ni...',
            },
          },
        },
      },
    },
  },
  401: {
    description: 'Invalid refresh token',
  },
};

const currentResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Current User successfully retrieved',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: userCore.id,
                    email: userCore.email,
                    name: userCore.name,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  401: {
    description: 'Not authorized / Invalid token',
  },
};

const logoutParameter: OpenAPIV3.ParameterObject = {
  in: 'cookie',
  name: 'refreshToken',
  required: true,
  schema: { type: 'string' },
  description: 'Delete token from HttpOnly cookie and DB',
};

const logoutResponse: OpenAPIV3.ResponsesObject = {
  200: {
    description: 'Successful exit. Cookies cleared, database session closed.',
    headers: {
      'Set-Cookie': {
        description: 'Clear refreshToken',
        schema: {
          type: 'string',
          example: 'refreshToken=; Max-Age=0; path=/; HttpOnly; Secure',
        },
      },
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: {
              type: 'string',
              example: 'Logout successful',
            },
          },
        },
      },
    },
  },
  401: {
    description: 'Not authorized / Invalid token',
  },
};

export {
  loginRequest,
  loginResponse,
  signupRequest,
  signupResponse,
  refreshParameter,
  refreshResponse,
  currentResponse,
  logoutParameter,
  logoutResponse,
};

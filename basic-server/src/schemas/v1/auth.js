const signupSchema = {
    body: {
      type: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['admin', 'normal'] }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' }
        }
      },
      500: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  };
  
  const signinSchema = {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          token: { type: 'string' }
        }
      },
      401: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  };
  
  module.exports = {
    signupSchema,
    signinSchema
  };
  
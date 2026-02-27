/**
 * Complete OpenAPI Specification
 * All API endpoints for Radio Cesar
 */

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Radio Cesar API',
    version: '1.0.0',
    description: `
## Radio Cesar - Community Radio Streaming Platform

### Authentication
All protected endpoints require JWT Bearer token:
\`Authorization: Bearer <token>\`

### User Roles
- **admin**: Full access to all endpoints
- **listener**: Limited access to public endpoints

### Response Format
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
\`\`\`

### Error Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
    `,
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Development' },
    { url: 'https://radio-azura.orioncaribe.com', description: 'Production' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Returns server health status',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'displayName'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  displayName: { type: 'string', minLength: 2 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created successfully' },
          '400': { description: 'Invalid input or email already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'User login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current user',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User data' },
          '401': { description: 'Not authenticated' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'User logout',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logout successful' },
        },
      },
    },
    '/api/users': {
      get: {
        summary: 'Get current user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile data' },
          '401': { description: 'Not authenticated' },
        },
      },
      put: {
        summary: 'Update current user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  avatar: { type: 'string' },
                  bio: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Profile updated' },
        },
      },
    },
    '/api/users/avatar': {
      post: {
        summary: 'Upload user avatar',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  avatar: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Avatar uploaded' },
        },
      },
    },
    '/api/blogs': {
      get: {
        summary: 'Get all blog posts',
        tags: ['Blog'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of blog posts' },
        },
      },
      post: {
        summary: 'Create blog post (admin only)',
        tags: ['Blog'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  excerpt: { type: 'string' },
                  category: { type: 'string' },
                  tags: { type: 'string' },
                  image: { type: 'string' },
                  published: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Blog post created' },
          '403': { description: 'Forbidden - Admin only' },
        },
      },
    },
    '/api/blogs/{id}': {
      get: {
        summary: 'Get blog post by ID',
        tags: ['Blog'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Blog post data' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        summary: 'Update blog post (admin only)',
        tags: ['Blog'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Blog post updated' },
          '403': { description: 'Forbidden' },
        },
      },
      delete: {
        summary: 'Delete blog post (admin only)',
        tags: ['Blog'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Blog post deleted' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/news': {
      get: {
        summary: 'Get all news',
        tags: ['News'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': { description: 'List of news' },
        },
      },
      post: {
        summary: 'Create news (admin only)',
        tags: ['News'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'News created' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/news/{id}': {
      get: {
        summary: 'Get news by ID',
        tags: ['News'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'News data' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        summary: 'Update news (admin only)',
        tags: ['News'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'News updated' },
        },
      },
      delete: {
        summary: 'Delete news (admin only)',
        tags: ['News'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'News deleted' },
        },
      },
    },
    '/api/events': {
      get: {
        summary: 'Get all events',
        tags: ['Events'],
        responses: {
          '200': { description: 'List of events' },
        },
      },
      post: {
        summary: 'Create event (admin only)',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Event created' },
        },
      },
    },
    '/api/events/{id}': {
      get: {
        summary: 'Get event by ID',
        tags: ['Events'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Event data' },
        },
      },
      put: {
        summary: 'Update event (admin only)',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Event updated' },
        },
      },
      delete: {
        summary: 'Delete event (admin only)',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Event deleted' },
        },
      },
    },
    '/api/events/{id}/register': {
      post: {
        summary: 'Register for event',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '201': { description: 'Registered successfully' },
        },
      },
    },
    '/api/products': {
      get: {
        summary: 'Get all products',
        tags: ['Products'],
        responses: {
          '200': { description: 'List of products' },
        },
      },
      post: {
        summary: 'Create product (admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Product created' },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get product by ID',
        tags: ['Products'],
        responses: {
          '200': { description: 'Product data' },
        },
      },
      put: {
        summary: 'Update product (admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Product updated' },
        },
      },
      delete: {
        summary: 'Delete product (admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Product deleted' },
        },
      },
    },
    '/api/schedule': {
      get: {
        summary: 'Get radio schedule',
        tags: ['Schedule'],
        responses: {
          '200': { description: 'Schedule data' },
        },
      },
      post: {
        summary: 'Create schedule entry (admin only)',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Schedule created' },
        },
      },
    },
    '/api/admin/users': {
      get: {
        summary: 'Get all users (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of users' },
          '403': { description: 'Forbidden' },
        },
      },
      post: {
        summary: 'Create user (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'User created' },
        },
      },
    },
    '/api/admin/users/{id}': {
      get: {
        summary: 'Get user by ID (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'User data' },
        },
      },
      patch: {
        summary: 'Update user (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User updated' },
        },
      },
      delete: {
        summary: 'Delete user (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User deleted' },
        },
      },
    },
    '/api/admin/stats': {
      get: {
        summary: 'Get admin statistics',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Statistics data' },
        },
      },
    },
    '/api/station/now-playing': {
      get: {
        summary: 'Get current playing track',
        tags: ['Station'],
        responses: {
          '200': { description: 'Now playing data' },
        },
      },
    },
    '/api/station/history': {
      get: {
        summary: 'Get playback history',
        tags: ['Station'],
        responses: {
          '200': { description: 'History data' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

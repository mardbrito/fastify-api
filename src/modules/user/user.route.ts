import { FastifyInstance } from 'fastify'
import {
  getUsersHandler,
  loginHandler,
  logoutHandler,
  registerUserHandler,
} from './user.controller'

import { $ref } from './user.schema'

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler,
  )

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          201: $ref('loginResponseSchema'),
        },
      },
    },
    loginHandler,
  )

  server.get(
    '/',
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler,
  )

  server.delete(
    '/logout',
    {
      preHandler: [server.authenticate],
    },
    logoutHandler,
  )
}

export default userRoutes

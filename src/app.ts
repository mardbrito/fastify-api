import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'

import userRoutes from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'
import { productSchemas } from './modules/product/product.schema'
import productRoutes from './modules/product/product.route'

const server = fastify()

server.register(fjwt, {
  secret: process.env.JWT_SECRET || 'some-secret-key',
})

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token

    if (!token) {
      return reply.status(401).send({ message: 'Authentication required' })
    }

    const decoded = request.jwt.verify<FastifyJWT['user']>(token)
    request.user = decoded
  },
)

server.addHook('preHandler', (req, res, next) => {
  req.jwt = server.jwt
  return next()
})

server.register(fCookie, {
  secret: process.env.COOKIE_SECRET || 'some-secret-key',
  hook: 'preHandler',
})

async function main() {
  for (const schema of [...userSchemas, ...productSchemas]) {
    // It should be before you register your routes
    server.addSchema(schema)
  }

  server.register(userRoutes, { prefix: 'api/users' }) // user routes
  server.register(productRoutes, { prefix: 'api/products' }) // product routes
  try {
    await server.listen({ port: 3333, host: '0.0.0.0' })
    console.log(`Server running `)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()

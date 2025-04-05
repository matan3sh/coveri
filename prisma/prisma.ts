import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

  // Soft delete middleware example (optional)
  // client.$use(async (params, next) => {
  //   if (params.action === 'delete') {
  //     params.action = 'update'
  //     params.args['data'] = { deleted: true }
  //   }
  //   return next(params)
  // })

  // Connection error handling
  client.$connect().catch((err) => {
    console.error('Failed to connect to the database:', err)
    process.exit(1)
  })

  // Graceful shutdown
  const signals = ['SIGINT', 'SIGTERM'] as const
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log('Closing Prisma Client connection...')
      await client.$disconnect()
      process.exit(0)
    })
  })

  return client
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export { prisma }

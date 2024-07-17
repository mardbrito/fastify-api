import { db } from '../../utils/prisma'
import { CreateProductInput } from './product.schema'

export async function createProduct(
  data: CreateProductInput & { ownerId: number },
) {
  return db.product.create({
    data,
  })
}

export async function getProducts() {
  return db.product.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

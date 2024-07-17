import * as z from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

// Define the properties
const productInput = {
  // users input properties
  title: z.string(),
  price: z.number(),
  content: z.string().optional(), // optional
}

const productGenerated = {
  // automatically generated when the product is created
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
}

// Define the schemas
const createProductSchema = z.object({
  ...productInput,
})

const productResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
})

const productsResponseSchema = z.array(productResponseSchema)

// Export the type
export type CreateProductInput = z.infer<typeof createProductSchema>

// Export the schemas
export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  {
    $id: 'productSchemas', // Ensure the root $id is unique
  },
)

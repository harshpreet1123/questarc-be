import { Type } from '@fastify/type-provider-typebox';

export const authSchemas = {
  signup: {
    body: Type.Object({
      email: Type.String({ format: 'email' }),
      password: Type.String({ minLength: 6 })
    }),
    response: {
      201: Type.Object({
        id: Type.String(),
        email: Type.String(),
        name: Type.String(),
        token: Type.String()
      })
    }
  },
  login: {
    body: Type.Object({
      email: Type.String({ format: 'email' }),
      password: Type.String()
    }),
    response: {
      200: Type.Object({
        id: Type.String(),
        email: Type.String(),
        name: Type.String(),
        token: Type.String()
      })
    }
  }
};
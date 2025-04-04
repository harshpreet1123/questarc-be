import { FastifyInstance } from 'fastify';
import { AuthService } from '../../services/auth.service';

export const AuthController = (fastify: FastifyInstance, _: any, done: () => void) => {
  fastify.post(
    '/signup',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        }
      }
    },
    async (request, reply) => {
      const { email, password, name } = request.body as { email: string; password: string, name:string };
      try {
        const user = await AuthService.signup(email, password, name);
        reply.code(201).send(user);
      } catch (err: any) {
        reply.code(400).send({ message: err.message });
      }
    }
  );

  fastify.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string };
      try {
        const user = await AuthService.login(email, password);
        reply.send(user);
      } catch (err: any) {
        reply.code(401).send({ message: err.message });
      }
    }
  );

  done();
};
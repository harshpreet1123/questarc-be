import { FastifyInstance } from 'fastify';
import { AuthController } from './auth/auth.controller';

export const routes = async (fastify: FastifyInstance) => {
  fastify.register(AuthController, { prefix: '/auth' });
};
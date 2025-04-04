import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: JWT;
    authenticate: typeof authenticate;
  }
  
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    user: {
      id: string;
      email: string;
    };
  }
}

declare const authenticate: () => void;
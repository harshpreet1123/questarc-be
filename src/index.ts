import fastify from 'fastify';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import { routes } from './modules';

dotenv.config();

const app = fastify({ logger: true });

// Connect to database
connectDB();

// Register routes
app.register(routes);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
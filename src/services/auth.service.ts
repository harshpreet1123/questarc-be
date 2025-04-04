import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { FastifyInstance } from 'fastify';

export const AuthService = (fastify: FastifyInstance) => ({
  async signup(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    const token = fastify.jwt.sign({ 
      id: user._id.toString(), 
      email: user.email 
    });
    
    return { 
      id: user._id, 
      name: user.name,
      email: user.email,
      token 
    };
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = fastify.jwt.sign({ 
      id: user._id.toString(), 
      email: user.email 
    });
    
    return { 
      id: user._id,
      name: user.name,
      email: user.email,
      token 
    };
  }
});
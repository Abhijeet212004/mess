import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRepository from './auth.repository.js';

export const authService = async (name, email, password) => {
  try {
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error) {
    throw new Error(error.message || 'Error registering user');
  }
};

export const loginService = async (email, password) => {
  try {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    throw new Error(err.message || 'Login failed');
  }
};

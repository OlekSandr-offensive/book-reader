import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import bcrypt from 'bcryptjs';
import { RequestError } from '../../helpers';

const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    if (user.email === email) {
      throw RequestError(409, `User with email ${email} already exists`);
    }
    if (user.name === name) {
      throw RequestError(409, `User with name ${name} already exists`);
    }
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await prisma.user.create({
    data: { name, email, password: hashPassword, refreshToken: null },
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
      },
    },
  });
};

export { signup };

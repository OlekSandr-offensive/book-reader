import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import bcrypt from 'bcryptjs';
import { RequestError, createTokens } from '../../helpers';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw RequestError(401, 'Invalid email or password');
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw RequestError(401, 'Invalid email or password');
  }
  const payload = {
    id: user.id,
  };
  const { accessToken, refreshToken } = createTokens(payload);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token: accessToken,
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  });
};

export { login };

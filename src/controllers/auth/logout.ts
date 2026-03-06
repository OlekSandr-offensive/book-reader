import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
  });
};

export { logout };

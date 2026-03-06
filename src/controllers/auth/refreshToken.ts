import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import jwt from 'jsonwebtoken';
import { type TokenPayload } from '../../interfaces';
import config from '../../config';
import { RequestError, createTokens } from '../../helpers';

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw RequestError(401, 'Refresh token not found');
  }

  const { id } = jwt.verify(
    refreshToken,
    config.REFRESH_SECRET,
  ) as TokenPayload;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.refreshToken !== refreshToken) {
    throw RequestError(401, 'Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = createTokens({ id });

  await prisma.user.update({
    where: { id },
    data: { refreshToken: newRefreshToken },
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: 'success',
    message: 'Tokens refreshed successfully',
    token: accessToken,
  });
};

export { refreshToken };

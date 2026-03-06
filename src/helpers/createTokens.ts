import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces/auth';
import config from '../config';

const { ACCESS_SECRET, REFRESH_SECRET } = config;

const expireTime = {
  accessToken: '24h',
  refreshToken: '7d',
} as const;

const createTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: expireTime.accessToken,
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: expireTime.refreshToken,
  });
  return { accessToken, refreshToken };
};

export { createTokens };

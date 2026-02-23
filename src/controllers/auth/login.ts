import { type Request, type Response } from 'express';
import prisma from "../../../prisma/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import RequestError from '../../helpers/RequestError';

const { SECRET_KEY = '' } = process.env;

const login = async (req: Request, res: Response) => {
  const {email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw RequestError(401, "Invalid email or password");
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw RequestError(401, "Invalid email or password");
  }
  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });
  res.status(200).json({
    message: 'Login successful',
    token,
      user: {
          email: user.email,
          name: user.name,
    },
  });
};

export default login;
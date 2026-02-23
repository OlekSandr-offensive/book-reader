import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../../prisma/prisma';
import RequestError from '../helpers/RequestError';
import {type TokenPayload } from '../interfaces/tokenPayload.interface';

const {SECRET_KEY = ''} = process.env;

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        return next(RequestError(401, "Not authorized"));
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY) as TokenPayload;
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
           return next(RequestError(401, "Not authorized"));
        }
        req.user = user;
        next();
    } catch (error) {
        next(RequestError(401, "Invalid token"));
    }
 }


export default authenticate;
import { type Request, type Response } from 'express';
import  prisma  from "../../../prisma/prisma";



const health = async (_: Request, res: Response) => { 
    await prisma.user.findMany();
    res.json({
        status: 'ok',
        db: 'connected',  
    });
};

export default health;    
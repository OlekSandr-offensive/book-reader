import { type Request, type Response } from 'express';

const currentUser = async (req: Request, res: Response) => {
  const { email, name, id } = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: id,
        email: email,
        name: name,
      },
    },
  });
};

export { currentUser };

import status from 'http-status';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'API Not Found!!',
    error: '',
  });
};

export default notFound;

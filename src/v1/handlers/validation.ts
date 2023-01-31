import express from 'express';
import { validationResult } from 'express-validator';

export const validate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //バリデーションチェック
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

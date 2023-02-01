//クライアントから渡されたJWTが正常か検証
import JWT from 'jsonwebtoken';
import express from 'express';
import 'dotenv/config';
import { assertIsDefined } from '../../../src/v1/helpers/assert';
import User from '../models/user';

const tokenDecode = (req: express.Request) => {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')[1];
    try {
      assertIsDefined(process.env.TOKEN_SECRET_KEY);
      const decodedToken = JWT.verify(
        bearer,
        process.env.TOKEN_SECRET_KEY
      ) as JWT.JwtPayload;
      return decodedToken;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

//JWT認証を検証するためのミドルウェア
export const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    //そのJWTと一致するユーザーを探してくる
    const user = await User.findById(tokenDecoded.id);
    if (!user) {
      return res.status(401).json('権限がありません');
    }
    req.body.user = user;
    next();
  } else {
    return res.status(401).json('権限がありません');
  }
};

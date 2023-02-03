import express from 'express';
import User from '../../../src/v1/models/user';
import { assertIsDefined } from '../../../src/v1/helpers/assert';
import AES from 'crypto-js/aes';
import JWT from 'jsonwebtoken';
import { enc } from 'crypto-js';

export const register = async (req: express.Request, res: express.Response) => {
  //パスワードの受け取り
  // console.log(req.body.password);
  const password: string = req.body.password;
  try {
    //パスワードの暗号化
    assertIsDefined(process.env.SECRET_KEY);
    req.body.password = AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();
    //   console.log(req.body.password);

    //ユーザーの新規作成
    const user = await User.create(req.body);
    //JWTの発行
    assertIsDefined(process.env.TOKEN_SECRET_KEY);
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: '24h',
    });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json(err);
  }
};

//ユーザーログイン用API
export const login = async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'ユーザー名が無効です',
          },
        ],
      });
    } else {
      //パスワードが合っているか照合する
      assertIsDefined(process.env.SECRET_KEY);
      const decryptedPassword = AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(enc.Utf8);

      if (decryptedPassword !== password) {
        return res.status(401).json({
          errors: [
            {
              param: 'password',
              msg: 'パスワードが無効です',
            },
          ],
        });
      }

      //JWTの発行
      assertIsDefined(process.env.TOKEN_SECRET_KEY);
      const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: '24h',
      });
      return res.status(201).json({ user, token });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

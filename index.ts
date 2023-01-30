import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import AES from 'crypto-js/aes';
import { assertIsDefined } from './src/v1/helpers/assert';
import User from './src/v1/models/user';
import JWT from 'jsonwebtoken';
const app: express.Express = express();
const PORT = 3001;
mongoose.set('strictQuery', false);

app.use(express.json());

//DB接続
try {
  assertIsDefined(process.env.MONGODB_URL);
  mongoose.connect(process.env.MONGODB_URL);
  console.log('DBと接続中・・・');
} catch (error) {
  console.log(error);
}

//ユーザー新規登録API
app.post('/register', async (req, res) => {
  //パスワードの受け取り
  const password: string = req.body.password;
  try {
    console.log(password);
    //パスワードの暗号化
    assertIsDefined(process.env.SECRET_KEY);
    req.body.password = AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();
    console.log(req.body.password);

    //ユーザーの新規作成
    const user = await User.create(req.body);
    console.log('test2');
    //JWTの発行
    assertIsDefined(process.env.TOKEN_SECRET_KEY);
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: '24h',
    });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ユーザーログイン用API

app.listen(PORT, () => {
  console.log('ローカルサーバー起動中・・・');
});

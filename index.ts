import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { assertIsDefined } from './src/v1/helpers/assert';

const app: express.Express = express();
const PORT = 3001;
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', require('./src/v1/routes/auth'));

//DB接続
try {
  assertIsDefined(process.env.MONGODB_URL);
  mongoose.connect(process.env.MONGODB_URL);
  console.log('DBと接続中・・・');
} catch (error) {
  console.log(error);
}

app.listen(PORT, () => {
  console.log('ローカルサーバー起動中・・・');
});

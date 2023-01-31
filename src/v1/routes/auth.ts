import express from 'express';
import User from '../../../src/v1/models/user';
import { body } from 'express-validator';
import 'dotenv/config';
import { validate } from '../handlers/validation';
import { register, login } from '../controllers/user';
const router = express.Router();

//ユーザー新規登録API
router.post(
  '/register',
  body('username')
    .isLength({ min: 8 })
    .withMessage('ユーザー名は8文字以上である必要があります'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上である必要があります'),
  body('confirmPassword')
    .isLength({ min: 8 })
    .withMessage('確認用パスワードは8文字以上である必要があります'),
  body('username').custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject('このユーザー名はすでに使われています');
      }
    });
  }),
  validate,
  register
);

//ユーザーログイン用API
router.post(
  '/login',
  body('username')
    .isLength({ min: 8 })
    .withMessage('ユーザー名は8文字以上である必要があります'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上である必要があります'),
  validate,
  login
);

module.exports = router;

import express from 'express';
import 'dotenv/config';
const router = express.Router();
import { verifyToken } from '../handlers/tokenHandler';
import { create, getAll, getOne, update, deleteOne } from '../controllers/memo';

//メモを作成
router.post('/', verifyToken, create);

//ログインしているユーザーが投稿したメモを全て取得
router.get('/', verifyToken, getAll);

//ログインしているユーザーが投稿したメモを1つ取得
router.get('/:memoId', verifyToken, getOne);

//ログインしているユーザーが投稿したメモを1つ更新
router.put('/:memoId', verifyToken, update);

//ログインしているユーザーが投稿したメモを1つ削除
router.delete('/:memoId', verifyToken, deleteOne);

module.exports = router;

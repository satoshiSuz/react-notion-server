import express from 'express';
import Memo from '../models/memo';

export const create = async (req: express.Request, res: express.Response) => {
  try {
    const memoCount = await Memo.find().count();
    //メモ新規作成
    const memo = await Memo.create({
      user: req.body.user._id,
      position: memoCount > 0 ? memoCount : 0,
    });
    res.status(201).json(memo);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const memos = await Memo.find({ user: req.body.user._id }).sort(
      '-position'
    );
    res.status(200).json(memos);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getOne = async (req: express.Request, res: express.Response) => {
  const { memoId } = req.params;
  try {
    const memo = await Memo.findOne({ user: req.body.user._id, _id: memoId });
    if (!memo) return res.status(404).json('メモが存在しません');
    res.status(200).json(memo);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const update = async (req: express.Request, res: express.Response) => {
  const { memoId } = req.params;
  const { title, description } = req.body;
  try {
    if (title === '') req.body.title = '無題';
    if (description === '')
      req.body.description = 'ここに自由に記入してください';
    const memo = await Memo.findOne({ user: req.body.user._id, _id: memoId });
    if (!memo) return res.status(404).json('メモが存在しません');

    const updatedMemo = await Memo.findByIdAndUpdate(memoId, {
      $set: req.body,
    });
    res.status(200).json(updatedMemo);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteOne = async (
  req: express.Request,
  res: express.Response
) => {
  const { memoId } = req.params;
  try {
    const memo = await Memo.findOne({ user: req.body.user._id, _id: memoId });
    if (!memo) return res.status(404).json('メモが存在しません');

    await Memo.deleteOne({ _id: memoId });
    res.status(200).json('メモを削除しました');
  } catch (err) {
    res.status(500).json(err);
  }
};

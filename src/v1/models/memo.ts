import { Schema, model, Document } from 'mongoose';

export interface IMemo extends Document {
  user: Schema.Types.ObjectId;
  icon: string;
  title: string;
  description: string;
  position: number;
  favorite: boolean;
  favoritePosition: number;
}

export const memoSchema = new Schema<IMemo>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  icon: {
    type: String,
    default: '📝',
  },
  title: {
    type: String,
    default: '無題',
  },
  description: {
    type: String,
    default: 'ここに自由に記入してください',
  },
  position: {
    type: Number,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  favoritePosition: {
    type: Number,
    default: 0,
  },
});

const Memo = model<IMemo>('Memo', memoSchema);
export default Memo;

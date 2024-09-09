import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  coins: number;
  miningPower: number;
  isMining: boolean;
  lastMiningStart: Date;
  referralCode: string;
  hasUsedReferralCode: boolean;
  referralCount: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coins: { type: Number, default: 0 },
  miningPower: { type: Number, default: 1 },
  isMining: { type: Boolean, default: false },
  lastMiningStart: { type: Date },
  referralCode: { type: String, unique: true, sparse: true },
  hasUsedReferralCode: { type: Boolean, default: false },
  referralCount: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', UserSchema);
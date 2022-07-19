import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface SessionDocument extends mongoose.Document {
  user: UserDocument['_id'],
  valid: boolean,
  password: string,
  userAgent: string,
  createdAt: Date,
  updateAt: Date,
  comparePassword(candidatePassword: string): Promise<boolean>
}

const sessionSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  valid: {type: Boolean, default: true},
  userAgent: {type: String}
}, {
  timestamps: true
})




const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema)

export default SessionModel;
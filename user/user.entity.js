import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, default: '' },
  nativeLanguage: {
    type: String,
    enum: ['CHINESE', 'ENGLISH', 'KOREAN']
  },
  learningLanguage: {
    type: String,
    enum: ['CHINESE', 'KOREAN']
  }
})


const user = mongoose.model('User', userSchema)
export { user }
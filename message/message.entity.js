import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';

const messageSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  chatId: String, //uses username to track currently
  userId: Number, //0 for bot, 1 for user
  text: String,
  translation: String,
  romanization: String,
  audioUrl: { type: String, default: ''},
  date: { type: Date, default: Date.now },
})


const Message = mongoose.model('Message', messageSchema)
export { Message }
import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'
import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import { Message } from './message.entity.js'
import { synthesizeText} from '../textToSpeech/TextToSpeech.service.js'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME
const AI_SERVICE_API = process.env.AI_SERVICE_API
// Creates a client using Application Default Credentials
const cloudStorage = new Storage();

//handles the audio of the user and returns the message text and audio url
const handleAudioFile = async (audioFile, username) => {
  const { words } = await transcribeAudio(audioFile)
  const audioName = path.basename(audioFile.originalname, '.m4a')

  // For generating audio of user's input
  // const generatedAudioPath = await synthesizeText(words.text, "./" + audioName)
  // const audioUrl = `https://storage.googleapis.com/spuddy-audio-files/${audioName}.mp3`
  // uploadAudioFile(audioName, generatedAudioPath)
  
  const savedMesssage = await saveMessage(words.text, '', username, 1)

  return { messageText: savedMesssage.text, messageAudioUrl: savedMesssage.audioUrl}
}

const transcribeAudio = async (audioFile) => {
  const form = new FormData();
  const file = fs.readFileSync(audioFile.path);
  form.append('file', file, audioFile.originalname)
  const response = await axios.post(AI_SERVICE_API + '/speech2text', form, {
    headers: {
      ...form.getHeaders()
    }
  })
  return response.data
}

const uploadAudioFile = async (audioName, generatedAudioPath) => {
  const options = {
    destination: audioName + '.mp3',
  }
  try {
    await cloudStorage.bucket(BUCKET_NAME).upload(generatedAudioPath, options);
    console.log('uploaded successfully!')
  } catch (error) {
    console.error('Error uploading audio', error)
  }
}

const saveMessage = async (text, messageAudioUrl, username, userId, romanization, translation) => {
  return await Message.create({ 
    _id: uuidv4(),
    userId: userId,
    chatId: username,
    text: text,
    romanization: romanization,
    translation: translation,
    audioUrl: messageAudioUrl })
}

const getAllMessages = async (chatId) => {
  return await Message.find({ chatId: chatId}).sort({ date: 'desc'})
}

const deleteAllMessages = async () => {
  return await Message.deleteMany({})
}

export { handleAudioFile, uploadAudioFile, saveMessage, getAllMessages, deleteAllMessages}
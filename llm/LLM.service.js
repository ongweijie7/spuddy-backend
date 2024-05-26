import axios from 'axios'
import dotenv from 'dotenv'
import { synthesizeText } from '../textToSpeech/TextToSpeech.service.js'
import { uploadAudioFile } from '../message/Message.service.js'
import { v4 as uuidv4 } from 'uuid'
import { saveMessage } from '../message/Message.service.js'

dotenv.config();

const AI_SERVICE_API = process.env.AI_SERVICE_API
const handleUserInput = async (username, latestMessages) => {
  const generateduuid = uuidv4()
  const audioUrl = `https://storage.googleapis.com/spuddy-audio-files/${generateduuid}.mp3`
  
  try {
    const { reply, romanization, translation } = await fetchLLMResponse(latestMessages)
    const generatedAudioPath = await synthesizeText(reply, generateduuid)
  
    await uploadAudioFile(generateduuid, generatedAudioPath)
    saveMessage(reply, audioUrl, username, 0, romanization, translation)
    
    return { 
      text: reply, 
      romanization: romanization, 
      translation: translation,
      audioUrl: audioUrl }
  } catch (error) {
    return { messageText: 'Sorry, I am not able to respond at the moment.', messageAudioUrl: '' }
  }
}

const fetchLLMResponse = async (inputText) => {
  try {
    const response = await axios.post(AI_SERVICE_API + '/generateResponse', {
      input: inputText
    })
    // console.log(breakDownText(response.data.reply))
    const processedResponse = response.data.reply.split('\n')
    const message = {
      reply: processedResponse[0],
      romanization: processedResponse[1],
      translation: processedResponse[2]
    }
    console.log(processedResponse)
    return message
  } catch (error) {
    console.log(error)
    return { reply: 'Sorry, I am not able to respond at the moment.'}
  }
}

const splitTextByNewline = (text) => {
  return text.split('\n');
};

const breakDownText = (text) => {
  // Detect the position of the word "translation:"
  const translationIndex = text.indexOf("translation:");
  
  if (translationIndex !== -1) {
    // Extract the Chinese and English parts
    const chineseText = text.substring(0, translationIndex).trim();
    const englishText = text.substring(translationIndex + "translation:".length).trim();
    
    return {
      chinese: chineseText,
      english: englishText
    };
  } else {
    return {
      error: "The word 'translation:' was not found in the text."
    };
  }
}

export { handleUserInput }
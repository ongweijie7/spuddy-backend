import textToSpeech from '@google-cloud/text-to-speech'
import fs from 'fs'
import util from 'util'
import path from 'path'

const client = new textToSpeech.TextToSpeechClient()

const synthesizeText = async (text, fileName) => {
  const audioPath = './generatedAudio/' + fileName + '.mp3'
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'cmn-CN', ssmlGender: 'FEMALE'},
    // voice: { languageCode: 'en-US', ssmlGender: 'FEMALE'},
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },

  }
  const [response] = await client.synthesizeSpeech(request)
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile)
  await writeFile(audioPath, response.audioContent, 'binary')
  return audioPath
}
export { synthesizeText}
// app.js
import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv'
import { handleAudioFile, getAllMessages, deleteAllMessages } from './message/Message.service.js';
import { connectMongoDb } from './init.js';
import { handleUserInput } from './llm/LLM.service.js';
import { getUser, createUser } from './user/User.service.js';

dotenv.config();

const upload = multer({ dest: 'uploads/', limits: { fileSize: 10000000 } })
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// app.post('/user', async (req, res) => {
//   const resultJson = await saveUser(req)
//   return res.json(resultJson)
// })

app.post('/uploadAudioFile', upload.single('file'), async (req, res) => {
  const { username } = req.body
  console.log(username)
  const resultJson = await handleAudioFile(req.file, username)
  return res.json(resultJson)
})

app.post('/getReply', async (req, res) => {
  const resultJson = await handleUserInput(req.body.username, req.body.input)
  return res.json(resultJson)
})

app.get('/messages/:username', async (req, res) => {
  const username = req.params.username;
  const messages = await getAllMessages(username)
  return res.json(messages)
})

app.delete('/deleteAllMessages', async (req, res) => {
  await deleteAllMessages()
  res.json({ message: 'Hello World!' })
});

// app.get('/user/:email', async (req, res) => {
//   const email = req.params.email;
//   const user = await getUser('ongweijie7@gmail.com')
//   return res.json(user)
// })

app.post('/user', async (req, res) => {
  const body = req.body
  console.log(body)
  const user = await createUser(body.username, body.nativeLanguage, body.learningLanguage)
  console.log(user)
  return res.json(user)
})



await connectMongoDb()

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
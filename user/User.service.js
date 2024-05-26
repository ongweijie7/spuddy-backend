import { user } from './user.entity.js'

const getUser = async (email) => {
  console.log(await user.find({ email: email}))
  return await user.find({ email: email})
}

const createUser = async (username, nativeLanguage, learningLanguage) => {
  const existingUser = await user.findOne({ username: username });

  // If the user exists, return a message or handle it accordingly
  if (existingUser) {
    user.updateOne({ nativeLanguage: nativeLanguage, learningLanguage: learningLanguage })
    return existingUser
  }
  return await user.create({ 
    username: username,
    nativeLanguage: nativeLanguage, 
    learningLanguage: learningLanguage })
}

export { getUser, createUser }
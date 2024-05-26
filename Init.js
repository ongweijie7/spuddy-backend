import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

dotenv.config()

const uri = process.env.MONGODB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

const connectMongoDb = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database')
  } catch (error) {
    console.error('Error connecting to the database', error)
  }

}

export { connectMongoDb }
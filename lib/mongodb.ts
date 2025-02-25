import { MongoClient } from 'mongodb'


const uri = process.env.MONGODB_URI
// const uri = `${process.env.MONGODB_URI}?retryWrites=true&w=majority&connectTimeoutMS=10000&socketTimeoutMS=10000&serverSelectionTimeoutMS=10000`
const options = {
  maxPoolSize: 10,
  retryWrites: true,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error('Please add MongoDB URI to environment variables');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise!
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  console.log('Connecting to MongoDB...')
  clientPromise = client.connect()
}



export default clientPromise
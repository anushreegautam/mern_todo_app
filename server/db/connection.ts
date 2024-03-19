import { Db, MongoClient, ServerApiVersion } from "mongodb"

const DbUri = process.env.ATLAS_URI

export const client = new MongoClient(DbUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

var dbo: Db

export const connectToDatabase = async () => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    const dboConnection = await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('ToDoApp').command({ ping: 1 })
    dbo = dboConnection.db('ToDoApp')
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (e) {
    console.dir(e)
  } 
//   finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
}

export const getDbo = () => dbo
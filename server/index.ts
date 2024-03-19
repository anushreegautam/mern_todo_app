import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

import { connectToDatabase } from "./db/connection"
import router from './routes'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ credentials: true, origin: 'http://localhost:9000', methods: ['GET','PATCH','POST','DELETE']  }))

app.use(express.json())
app.use(router)

app.listen(port, () => {
  // perform a database connection when server starts
  connectToDatabase()
  console.log(`Server is running on port: ${port}`)
})
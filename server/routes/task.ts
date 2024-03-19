import { NextFunction, Request, Response } from "express"
import { ObjectId, TransactionOptions } from "mongodb"

import { client, getDbo } from "../db/connection"

export const getTasks = async (req: Request, res: Response) => {
    try {
      const { id, is_completed} = req.query  
      const filter = { user_id: id, ...(is_completed && { is_completed: is_completed === 'true' }) }

      const tasks = await getDbo().collection("tasks").find(filter).toArray()
      const result = tasks.sort((a,b) => a.sort_order > b.sort_order ? -1 : 1)   
      res.json(result)
   } catch (error) {
     res.status(500).json({ error: 'Internal Server error' })
   }
 }

export const updateTask = async (req: Request, res: Response) => {
  try {
    const requestBody = req.body 
    const { taskId } = req.params
    const result = await getDbo().collection("tasks").findOneAndUpdate({ _id: new ObjectId(taskId) }, { $set: requestBody }, { returnDocument: 'after' })
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server error' })
  }
}

export const reorderTasks = async (req: Request, res: Response) => {
  const requestBody = req.body
  const session = client.startSession()
  try {
   
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    }

   await session.withTransaction( async () => {
      const tasksCollection = getDbo().collection("tasks")

      return await Promise.all(requestBody.map(async ({ id, sort_order}: { id: string, sort_order: number }) => 
        await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: { sort_order: sort_order }} , { session })
        ))
    }, transactionOptions as TransactionOptions).then((response => {
      const successfulTransactions  = response.filter(result => result.acknowledged).length === requestBody.length
     
      if(successfulTransactions) {
        res.status(204).json({})
      } else {
        res.status(500).json('Failed to update the order')
      }
    }))
    
  } catch (e) {
    res.status(500).json('Failed to update the order')
  } finally {
    await session.endSession()
  }
}


export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, sort_order } = req.body 
    const { userId } = req.params

    if(!title || !sort_order) {
      res.status(422).json('Missig Parameter')
      next()
    } else {

      const task = { title, sort_order, is_completed: false, user_id: userId, _id: new ObjectId() }
  
    const result = await getDbo().collection("tasks").insertOne(task)

    if(result.acknowledged) {
      const newTask = await getDbo().collection("tasks").findOne({ _id: result.insertedId })
      res.json(newTask).status(200)
    } else {
      res.status(500).json({ error: 'Internal Server error' })
    }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server error' })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params

    const result = await getDbo().collection("tasks").deleteOne({ _id: new ObjectId(taskId) })
   
    if(result.acknowledged) {
      res.status(204).json({})
    } else {
      res.status(500).json({ error: 'Internal Server error' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server error' })
  }
}
import { Router, Response, Request } from "express"
import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb"

import  {register} from "./register"
import  {login, authenticate} from "./login"
import { forgotPassword, resetPassword } from "./resetPassword"
import  { reorderTasks, getTasks, updateTask, createTask, deleteTask } from "./task"

const router = Router()

router.post('/api/register', register)
router.post('/api/authenticate', login)
router.patch('/api/reset_password', resetPassword)
router.patch('/api/forgot_password', forgotPassword)
 
router.get('/api/tasks', authenticate, getTasks)
router.post('/api/tasks/new', authenticate, createTask)
router.patch('/api/tasks/:taskId', authenticate, updateTask)
router.patch('/api/reorder_tasks', authenticate, reorderTasks)
router.delete('/api/tasks/:taskId', authenticate, deleteTask)

export default router
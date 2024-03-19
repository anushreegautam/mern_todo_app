import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { getDbo } from '../db/connection'

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const isEmailAlreadyRegistered = await getDbo().collection('users').findOne({ "email": email })

        if(isEmailAlreadyRegistered) {
          res.status(401).json({ error: 'This email is already registered!' })
        } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await getDbo().collection('users').insertOne({ "name": name, "email": email, "password": hashedPassword, "resetToken": null })

        res.status(200).json({ user })
        }
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
}

import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { getDbo } from '../db/connection'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await getDbo().collection('users').findOne({ "email": email})

    if (!user) {
      return res.status(401).json({ error: 'This email doesn\'t exist' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
  

    if (!passwordMatch) {
      res.status(422).json({ error: 'Please enter the correct password' })
    } else {
       // Create a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.PRIVATE_RSA_KEY, {
      algorithm: 'RS256',
      expiresIn: '1h'
    })
  // maxAge: 3600000  expires: new Date(Date.now() + 3600000)
  
    res.cookie('token', token,  { httpOnly: true, path: '/', maxAge: 3600000, sameSite: 'none' })
    res.status(200).json({ id: user._id, name: user.name, token })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, process.env.PUBLIC_RSA_KEY, {
        algorithms: ['RS256']
    }) as JwtPayload
    req.params = { ...req.params, userId: decodedToken.id, email: decodedToken.email }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
import { createTransport } from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import {Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import {getDbo} from '../db/connection'

dotenv.config()

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await getDbo().collection('users').findOne({ "email": email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.PRIVATE_RSA_KEY, {
        algorithm: 'RS256',
        expiresIn: '1h'
      })
    
    const updatedUserInfo = await getDbo().collection('users').findOneAndUpdate({ "email": email }, { $set: { "resetToken": token }}, { returnDocument: 'after' })
    
    const resetUrl = `${process.env.BASE_URL_UI}/resetPassword?token=${token}`

    var transporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'todo-app-anushreegautam@gmail.com',
        to: email,
        subject: "TODO Reset Password",
        html:`<h2>Hi ${user.name}</h2><p>Click on the link to reset your password</p><p>${resetUrl}</p><br/><p>Note: The above link is valid for one hour</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    
    res.status(200).json({ error: 'A link to reset your password have been sent to your email.' })
  }
}
  
//  Route to handle password reset request
const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    
    try {
    const decodedToken = jwt.verify(token, process.env.PUBLIC_RSA_KEY, {
        algorithms: ['RS256']
    }) as JwtPayload
    
    const user = await getDbo().collection('users').findOne({ "resetToken": token })
    if (!user) {
     res.status(400).json({ error: 'Invalid token' });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
    
      const reult = await getDbo().collection('users').updateOne({ "email": user.email }, { $set: { "password": newPassword, "resetToken": null } })
    
      res.status(200).json({ error: 'Password reset successful' })
    }
    } catch (e) {
        res.status(403).json('The requested link has expired')
    }
}

 export {forgotPassword, resetPassword}
  
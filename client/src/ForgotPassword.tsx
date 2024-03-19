import React, { BaseSyntheticEvent, FormEvent, useState } from 'react'
import Layout from './Layout'
import { Link } from 'react-router-dom'
import { forgotPassword } from './helpers'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleChange = (e: BaseSyntheticEvent) => setEmail(e.target.value)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsFetching(true)
    forgotPassword(email).then(response => {

      if(response.ok) {
        setIsEmailSent(true)
        setEmail('')
      } else {
        setError(true)
      }
    }).finally(() => setIsFetching(false))
  }

  return (
    <Layout>
      <div className="main-container">
      <span className="page-heading" >Forgot Password?</span>
       <form className="todo-login-form" onSubmit={handleSubmit} >
        <span>Please enter your registered email address and we will send you a password reset link</span>
        <input required type="text" className="todo-input-container" name="username" disabled={isFetching} value={email} placeholder="Email" onChange={handleChange} />
        <input type="submit" className="todo-container-button" name="link" disabled={!!error || isFetching || !email} value="Reset Password"/>
        {(error && !isFetching )&& <span>Please enter a valid email address</span>}
        {isEmailSent && <span style={{ color: "red" }} >An email has been sent to your registered email address. If you haven't recieved an email then please reinitiate the reset link email.</span>  }
        <Link to="/login" >Back to Login Page!</Link>
        </form>
      </div>
    </Layout>
    )
}

export default ForgotPassword
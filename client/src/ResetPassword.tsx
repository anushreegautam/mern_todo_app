import React, { FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { resetPassword } from './helpers'
import Layout from './Layout'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [ userInfo, setUserInfo ] = useState<{ email: string, password: string, confirmPassword: string}>({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: { target: { name: string, value: string } }) => {
    setUserInfo(prevState => ({...prevState, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsFetching(true)

    if(userInfo.password && userInfo.confirmPassword && userInfo.password !== userInfo.confirmPassword) {
      setError('Passwords do not match')
    } else {
      setError('')
      const token = new URLSearchParams(search).get('token') as string

      resetPassword({...userInfo, token}).then(response => {
        if(response.ok) {
          setIsFetching(false)
          navigate('/resetpassword/success')
        } else {
          setError(response?.error as string)
          setIsFetching(false)
        }
      })
    }
  }

  return (
    <Layout>
    <div className="main-container" >
      <span className="page-heading" >Reset Password</span>
      <form className="todo-login-form" onSubmit={handleSubmit} >
        <input required type="text" className="todo-input-container" name="email" disabled={isFetching} value={userInfo.email} placeholder="Email" onChange={handleChange} />
        <input required type="password" className="todo-input-container" name="password" disabled={isFetching} value={userInfo.password} placeholder="Password" onChange={handleChange} />
        <div className="password-container">
          {/* <input required type="password" className="todo-input-container" name="confirmPassword" disabled={isFetching} value={userInfo.confirmPassword} placeholder="Confirm Password" onChange={handleChange} /> */}
          <div className="password-input">
            <input required type={showPassword ? "text" : "password"} name="confirmPassword" disabled={isFetching} value={userInfo.confirmPassword} placeholder="Confirm Password" onChange={handleChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} >{ showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/> }</button> 
          </div>
          <div>
          {error && <span style={{ color: "red"}} >{error}</span>}
          </div>
        </div>
        <input type="submit" className="todo-container-button" name="reset" disabled={!!error || isFetching || !userInfo.email || !userInfo.password || !userInfo.confirmPassword} value="Reset Password"/>
      </form> 
    </div>
    </Layout>
  )
}

export default ResetPassword
import React, { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { login } from "./helpers"
import Layout from "./Layout"

const Login = () => {
  const navigate = useNavigate()
  const [ userInfo, setUserInfo ] = useState<{ email: string, password: string}>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: { target: { name: string, value: string } }) => {
    if(!e.target.value) {
      setError('')
    }
    setUserInfo(prevState => ({...prevState, [e.target.name]: e.target.value}))
  }

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    localStorage.clear()
    setIsFetching(true)
    setError('')
  
    login(userInfo).then(response => {
      if(response.ok) {
        navigate('/home')
      } else {
        setError(response?.error)
        setIsFetching(false)
      }
    })
  }

  return (
    <Layout>
    <div className="main-container" >
      <span className="page-heading" >Welcome Back!</span>
      <form className="todo-login-form" id="login-form"  onSubmit={handleLogin} >
        <input required type="text" className="todo-input-container" name="email" disabled={isFetching} value={userInfo.email} placeholder="Email" onChange={handleChange} />
        <div className="password-container">
          <div className="password-input">
            <input required type={showPassword ? "text" : "password"} name="password" disabled={isFetching} value={userInfo.password} placeholder="Password" onChange={handleChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} >{ showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/> }</button> 
          </div>
          <div className="forgot-password-link">
          <Link to="/forgotpassword" >Forgot Password?</Link>
          {error && <span>{error}</span>}
          </div>
        </div>
        <input type="submit" className="todo-container-button" name="login" disabled={isFetching || !userInfo.email || !userInfo.password } value="Login" />
        <span>Or</span>
        <span className="navigation-msg" >Don't have an account? <Link to="/signup">Sign up</Link></span>
      </form> 
    </div>
    </Layout>
  )  
}

export default Login
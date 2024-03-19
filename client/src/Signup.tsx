import React, { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { register } from './helpers'
import Layout from './Layout'

const Signup = () => {
  const navigate = useNavigate()
  const [ userInfo, setUserInfo ] = useState<{ name: string, email: string, password: string}>({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: { target: { name: string, value: string } }) => {
    setError('')
    setUserInfo(prevState => ({...prevState, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsFetching(true)
    setError('')
  
    register(userInfo).then((response: any) => {
      if(response.ok) {
        navigate('/signup/success')
      } else {
        setError(response.error)
      }
    }).finally(() => setIsFetching(false))
  }

  return (
    <Layout>
    <div className="main-container" >
      <span className="page-heading" >Signup!</span>
      <form className="todo-login-form" onSubmit={handleSubmit} >
        <input required type="text" className="todo-input-container" name="name" disabled={isFetching} value={userInfo.name} placeholder="Name" onChange={handleChange} />
        <input required type="text" className="todo-input-container" name="email" disabled={isFetching} value={userInfo.email} placeholder="Email" onChange={handleChange} />
        {/* <input required type={showPassword ? "text" : "password"} className="todo-input-container" name="password" disabled={isFetching} value={userInfo.password} placeholder="Password" onChange={handleChange} /> */}
        <div className="password-input">
            <input required type={showPassword ? "text" : "password"} name="password" disabled={isFetching} value={userInfo.password} placeholder="Password" onChange={handleChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} >{ showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/> }</button> 
          </div>
        <input type="submit" className="todo-container-button" name="reset" disabled={!!error || isFetching || !userInfo.name || !userInfo.email || !userInfo.password} value="Signup"/>
        { error && <span className="error-warning" >{error}</span> }
        <span>Or</span>
        <span className="navigation-msg" >Have an account? <Link to="/">Login</Link></span>
      </form> 
    </div>
    </Layout>
  )
}

export default Signup
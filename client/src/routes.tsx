import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import ResetPassword from './ResetPassword'
import SuccessBanner from './SuccessBanner'
import ForgotPassword from './ForgotPassword'

import "./styles.css"
import SideNavigation from './SideNavigation'

const App = () => (
  <>
    <Routes >
        <Route path="/signup/success" element={<SuccessBanner/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/resetpassword/success" element={<SuccessBanner/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Login/>} />
    </Routes>
  </>
)

export default App

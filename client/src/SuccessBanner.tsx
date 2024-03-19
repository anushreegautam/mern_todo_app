import React from "react"
import {  Link, useLocation } from "react-router-dom"

import VerifiedIcon from '@mui/icons-material/Verified';
import Layout from "./Layout";

const SuccessBanner = () => {
  const { pathname } = useLocation()  

  const message =  pathname.includes('signup') ? 'You have successfully registered!' : 'Your password has been successfully reset.'

  return (
    <Layout>
    <div className="main-container">
      <div className="success-banner">
      <VerifiedIcon />  
      <p>{message} Please click on the below link to navigate to the <Link to="/" >Login</Link> page.</p>
      </div>  
    </div>
    </Layout>
  )
}

export default SuccessBanner
import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

import SideNavigation from './SideNavigation'


const Layout = ({ children }: { children: ReactElement }) => {
  const { pathname } = useLocation()  
  return (
    <>
      {pathname.includes('/home') && <SideNavigation/>}
      <div className="app-container">
        <div className="todo-title" >T   O   D   O</div>
        {children}
      </div>  
    </>
  )  
}

export default Layout
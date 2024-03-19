import React, { useState } from 'react'

import { MenuItem, Menu } from '@mui/material'

import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom'

const SideNavigation = () => { 
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

   return (
    <div className="account-info" >
    <button style={{ height: "2rem", display: "flex", gap: "0.5rem", padding: "0.5rem"}} onClick={handleClick} > <span>My Account</span><AccountCircleIcon /></button>
     <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem >Hi, {localStorage.getItem('name')}!</MenuItem>
        <MenuItem onClick={handleLogout}><span>Logout</span><LogoutIcon /></MenuItem>
      </Menu>
    </div>
   )
}

export default SideNavigation
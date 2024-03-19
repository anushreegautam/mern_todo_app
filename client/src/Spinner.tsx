import React from 'react'

import { CircularProgress, Backdrop } from "@mui/material"

const Spinner = ({open}: { open: boolean }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
)

export default Spinner
import { Typography } from '@mui/material'
import React from 'react'

const Loader = ({ loaderText = "" }) => {
  return (
      <div style={{ position: "fixed", width: "100%", height: "100%", backgroundColor: "#393e46", display: "flex", justifyContent: "center", alignItems: "center", left: 0, top: 0 }}>
        <Typography color={"white"} variant="h1" sx={{ fontSize: "40px", fontWeight: "300" }}>
                  {loaderText}...
        </Typography>
      </div>
  )
}

export default Loader

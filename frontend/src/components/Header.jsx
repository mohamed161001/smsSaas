import { Box , Typography} from "@mui/material";
import React from 'react'

const Header = ({title,subtitle}) => {
  return (
    <Box>
        <Typography
         sx={{
            fontWeight:"700",
            color:"#000",
            fontSize:"1.3rem",
        }}>
            {title}
        </Typography>
        <Typography  
        sx={{
            fontWeight:"500",
            color:"#6B7280",
            fontSize:"0.8rem",
            }}>
            {subtitle}
        </Typography>
    </Box>
  )
}

export default Header
import React from 'react'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'

function ActionMenu() {

    const { logout } = useLogout()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => { setAnchorEl(event.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };

    const handleLogout = () => {
        try {
            logout()
        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <div>
        <IconButton 
            sx={{'&:hover': {backgroundColor: 'transparent',},}}
            onClick={handleClick}
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
        >
            {
                open ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRounded />
            }
        </IconButton>
        <Menu
            id="fade-menu"
            MenuListProps={{
            'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  // make a light filter 
                  filter: 'drop-shadow(0px 1px 4px rgba(1,1,1,0.15))',
                  mt: 2,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
        >
            <MenuItem 
                onClick={handleClose}
                component={ Link }
                to="/settings"
            >
                <ListItemIcon>
                    <AccountCircleIcon fontSize="small" sx={{ fontSize:'1.2rem'}}/>
                </ListItemIcon>
                <Typography variant="inherit" sx={{fontSize:'0.7rem',fontWeight:'500'}}>Mon compte</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" sx={{fontSize:'1.1rem',color:'#c63232' }}/>
                </ListItemIcon>
                <Typography variant="inherit" sx={{fontSize:'0.7rem',fontWeight:'500',color:'#c63232'}}>Déconnexion</Typography>
            </MenuItem>
        </Menu>
    </div>
  )
}

export default ActionMenu
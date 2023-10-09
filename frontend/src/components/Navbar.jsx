import { Box, AppBar, IconButton, InputBase, Toolbar, Typography } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import {
    SearchRounded,
    MenuRounded,
    NotificationsNoneRounded,
    AddRounded,
    NotificationsRounded,
    AccountCircleOutlined,
    Logout,
    AccountCircle as AccountCircleIcon,
    SupportRounded,
    SecurityRounded,
}from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { 
    Avatar ,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    Fade,
    Autocomplete,
    TextField,
    Skeleton,
 } from '@mui/material';
import { Link } from 'react-router-dom';
import profile from '../assets/profile.jpg';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import { useGetUserQuery } from '../state/api';
import ActionMenu from './ActionMenu';




const Navbar = ({isSidebarOpen, setIsSidebarOpen}) => {
    
    const { logout } = useLogout()
    const user = useSelector((state) => state.reducer.user)
    const token = useSelector((state) => state.reducer.token)

    const { data, isLoading, error } = useGetUserQuery({ id: user?._id, token })

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

    useEffect(() => {
        if (error && error.status === 401) {
          logout()
          console.log("unauthorized");
        }
    }, [error]);

    return (
        <AppBar sx={{ position: "sticky", background:"none", backgroundColor:"white", boxShadow:"none"}}>
            <Toolbar
              variant="dense"
             sx={{
                justifyContent:"space-between",
                }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    {/* left */}
                    <FlexBetween>
                        <IconButton onClick={()=>{setIsSidebarOpen(!isSidebarOpen)}}>
                            <MenuRounded sx={{fontSize:"1.4rem",}}/>
                        </IconButton>
                    </FlexBetween>

                    {/* right */}
                    <FlexBetween gap="1rem">
                        
                        {/* <IconButton>
                            <Badge color="primary" variant="dot" overlap="circular">
                            <NotificationsRounded sx={{fontSize:"1.3rem"}}/>
                            </Badge>
                        </IconButton> */}

                        <FlexBetween>
                            {
                                !isLoading ? (
                            <IconButton
                                sx={{'&:hover': {backgroundColor: 'transparent',}, mr:"0.7rem"}}
                                onClick={handleClick}
                                id="fade-button"
                                aria-controls={open ? 'fade-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                            <Avatar src={`http://localhost:4000/${data?.user.image}`} sx={{width:"2rem", height:"2rem",}}/>
                            </IconButton>
                                ) : (
                                    <Skeleton variant="circular" width={35} height={35} sx = {{mr:"0.7rem"}}/>
                                )
                            }
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
                                        right: 30,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                    },
                                }}
                            >
            <FlexBetween gap="0.2rem" p="0.5rem 1rem">
                <Avatar src={`http://localhost:4000/${data?.user.image}`} sx={{width:"1.8rem", height:"1.8rem",}}/>
                <Box>
                    <Typography sx={{fontSize:"0.7rem", fontWeight:"600", color:"#000"}}>
                        {data?.user.firstName ?? ''} { data?.user.lastName ?? ''}
                    </Typography>
                    <Typography sx={{fontSize:"0.65rem", fontWeight:"500", color:"#000"}}>
                        {data?.user?.role}
                    </Typography>
                </Box>
            </FlexBetween>
            
            <MenuItem 
                onClick={handleClose}
                component={ Link }
                to="/settings"
            >
                <ListItemIcon>
                    <AccountCircleIcon fontSize="small" sx={{ fontSize:'1rem'}}/>
                </ListItemIcon>
                <Typography variant="inherit" sx={{fontSize:'0.68rem',fontWeight:'600'}}>Mon compte</Typography>
            </MenuItem>
            <MenuItem
                onClick={handleClose}
                component={ Link }
                to="/support"
            >
                <ListItemIcon>
                    <SupportRounded fontSize="small" sx={{ fontSize:'1rem'}}/>
                </ListItemIcon>
                <Typography variant="inherit" sx={{fontSize:'0.68rem',fontWeight:'600'}}>Ressources</Typography>
            </MenuItem>
            <MenuItem
                onClick={handleClose}
                component={ Link }
                to="/security"
            >
                <ListItemIcon>
                    <SecurityRounded fontSize="small" sx={{ fontSize:'1rem'}}/>
                </ListItemIcon>
                <Typography variant="inherit" sx={{fontSize:'0.68rem',fontWeight:'600'}}>Sécurité</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" sx={{fontSize:'1.1rem',color:'#c63232' }}/>
                </ListItemIcon>
                <Typography variant="inherit" sx={{fontSize:'0.7rem',fontWeight:'500',color:'#c63232'}}>Déconnexion</Typography>
            </MenuItem>
        </Menu>
                            <Box>
                            {/* <Typography sx={{fontSize:"0.72rem", fontWeight:"600", color:"#000", ml:"0.5rem",}}>
                                {data?.user.firstName ?? ''} { data?.user.lastName ?? ''}
                            </Typography>
                            <Typography sx={{fontSize:"0.69rem", fontWeight:"500", color:"#000", ml:"0.5rem",}}>
                                {data?.user?.role}
                            </Typography> */}
                            </Box>
                            {/* <ActionMenu /> action menu */}
                        </FlexBetween>
                    </FlexBetween>
                </Box>
            </Toolbar>
        </AppBar>

    )
}

export default Navbar
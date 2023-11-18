import Box from '@mui/material/Box';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useLocation } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import logo from '../assets/msini.png';
import logocollapsed from '../assets/msinicollapsed.png';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
  Typography,
} from "@mui/material";
import {
  GridViewRounded,
  PeopleRounded,
  TodayRounded,
  LocalPharmacyRounded,
  ReceiptLongRounded,
  WeekendRounded,
  SupervisedUserCircleRounded,
  SendRounded,
  Groups2Rounded,
} from "@mui/icons-material";

const drawerWidth = 230;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      height: '100vh',
      border : 'none',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const navItems = [
  {
      text: "Tableau de bord",
      icon: <GridViewRounded fontSize = "small"/>,
      url: "dashboard"
  },
  {
      text: "Clients",
      icon: <PeopleRounded fontSize = "small"/>,
      url: "clients"
  },
  {
      text: "Groupes",
      icon: <Groups2Rounded fontSize = "small"/>,
      url: "groups"
  },
  {
      text: "Campagnes",
      icon: <SendRounded fontSize = "small"/>,
      url: "campaigns"
  },
];

const Sidebar = ({ 
  isNonMobile,
  isSidebarOpen,
  setIsSidebarOpen,
 }) => {
  const location = useLocation();

    return (
      <Box 
      component = "nav"
      >
          <Drawer 
          variant="permanent" 
          open={isSidebarOpen}
          >
           <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
           >
            {isSidebarOpen ? (
            <img src={logo} alt="logo" style={{ width: '55%', height: 'auto', margin: '20px auto' }} />
            ) : (
            <img src={logocollapsed} alt="logo" style={{ width: '50%', height: 'auto', margin: '20px auto' }} />
            )}
           </Box>
          <List>
          <Menu
              menuItemStyles={{
                button: ({active, disabled }) => {
                    return {
                      /*color: active ? '#000000' : '#6B7280',*/
                      color: active ? '#000000' : '#000000',
                      backgroundColor: active ? '#ffefe6' : 'transparent',
                    };
                },
                icon: ({ active, disabled }) => {
                    return {
                      /*color: active ? '#111827' : '#6B7280',*/
                      /*color: active ? '#5271FF' : '#6B7280'*/
                      color: active ? '#FF6100' : '#000000'
                    };
                },
              }}
            >
              {
                navItems.map(({text, icon, url}) => {
                  return(
                    <MenuItem 
                    component={<Link to={"/" + url} />}
                    key={text}
                    icon={icon}
                    active={location.pathname.startsWith(`/${url}`)}
                    style={{
                      borderRadius: '5px',
                      margin: '2px 6px',
                      paddingRight : '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                     }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: "13.5px",
                          fontWeight: location.pathname.startsWith(`/${url}`) ? "600" : "500",
                        }}
                      >{text}</Typography>
                    </MenuItem>
                  );
                })
              }
            </Menu>
          </List>
        </Drawer>    
      </Box>  
    );
}

export default Sidebar;
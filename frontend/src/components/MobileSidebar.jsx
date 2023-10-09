import Box from '@mui/material/Box';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useLocation } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
  Typography,
  Drawer,
} from "@mui/material";
import {
  GridViewRounded,
  PeopleRounded,
  TodayRounded,
  LocalPharmacyRounded,
  ReceiptLongRounded,
  WeekendRounded,
} from "@mui/icons-material";

const drawerWidth = 230;


const navItems = [
  {
      text: "Tableau de bord",
      icon: <GridViewRounded fontSize = "small"/>,
      url: "dashboard"
  },
  {
      text: "Patients",
      icon: <PeopleRounded fontSize = "small"/>,
      url: "patients"
  },
  {
      text: "Rendez-vous",
      icon: <TodayRounded fontSize = "small" />,
      url: "rendez-vous"
  },
  {
      text: "Salle d'attente",
      icon: <WeekendRounded fontSize = "small" />,
      url: "salle-dattente"
  },
  {
      text: "Actes",
      icon: <LocalPharmacyRounded fontSize = "small" />,
      url: "actes"
  },
  {
      text: "Comptabilité",
      icon: <ReceiptLongRounded fontSize = "small" />,
      url: "comptabilite"
  },
];

const MobileSidebar = ({ 
  isNonMobile,
  isSidebarOpen,
  setIsSidebarOpen,
 }) => {
  const location = useLocation();

    return (
      <Box component = "nav">
          <Drawer 
          variant="temporary"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
           <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
           >
            <img src={logo} alt="logo" style={{ width: '60%', height: 'auto', margin: '20px auto' }} />
           </Box>
          <List>
          <Menu
              menuItemStyles={{
                button: ({active, disabled }) => {
                    return {
                      /*color: active ? '#000000' : '#6B7280',*/
                      color: active ? '#000000' : '#000000',
                      backgroundColor: active ? '#E5E7EB' : 'transparent',
                    };
                },
                icon: ({ active, disabled }) => {
                    return {
                      /*color: active ? '#111827' : '#6B7280',*/
                      /*color: active ? '#5271FF' : '#6B7280'*/
                      color: active ? '#5271FF' : '#000000'
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
                    active={location.pathname === "/" + url}
                    style={{
                      borderRadius: '5px',
                      margin: '2px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                     }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: "13.5px",
                          fontWeight: location.pathname === "/" + url ? "500" : "400",
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

export default MobileSidebar;
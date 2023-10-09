import React from 'react';
import { useState } from 'react';
import { Box,useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SideBar from '../../components/Sidebar';
import MobileSidebar from '../../components/MobileSidebar';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Layout = () => {

  const isAuth = Boolean(useSelector((state) => state.reducer.token))
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    isAuth 
    ? <Box 
      display={isNonMobile ? "flex" : "block"}
      width="100%"
      height="100%"
      >  
        {isNonMobile && (
          <SideBar
            isNonMobile={isNonMobile}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        {!isNonMobile && (
          <MobileSidebar
            isNonMobile={isNonMobile}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <Box flexGrow={1} width="100%" height="100%" overflow="auto">
          <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Outlet/>
        </Box>
      </Box>
    : <Navigate to="/login"/>
  )
}

export default Layout;
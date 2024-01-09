import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import FlexBetween from '../../components/FlexBetween'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Button,
  Tabs,
  Tab,
} from '@mui/material'
import {
  SearchRounded,
  DeleteOutline,
  EditRounded,
  RemoveRedEyeRounded,
  DownloadRounded,
  AddRounded,
 } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ConfirmDelete from '../../components/ConfirmDeletePopup';
import { useLogout } from '../../hooks/useLogout';
import AddGroupPopup from '../../components/AddGroupPopup'
import ImportListPopup from '../../components/ImportListPopup';
import EditGroupPopup from '../../components/EditGroupPopup'
import AllCampaignsTable from '../../components/AllCampaignsTable'
import ScheduledCampaignsTable from '../../components/ScheduledCampaignsTable'



const Campaigns = () => {


  // handling the tabs
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
      <Header title="Campagnes" subtitle="Gérer vos campagnes" />
      <Button 
      // type is link and takes to /create_campaign page
      component={Link}
      to="/campaigns/create_campaign"
      variant="contained"
      size="medium"
      startIcon={<AddRounded/>}
      sx = {{
        backgroundColor: "black",
        color: "white",
        borderRadius: "7px",
        textTransform: "none",
        fontSize: "0.65rem",
        fontWeight : "600",
        padding: "0.61rem 0.9rem",
        boxShadow: "none",  
        '&:hover': {
          backgroundColor: "#2b2b2b",
          boxShadow: "none",
        },
      }}
      >Créer une campagne</Button>
      </FlexBetween>
      <Box
           sx = {{
            mt: "1rem",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "0.2rem 1rem",
          }}
      >
        <Box 
        sx={{ 
          borderBottom: 1,
          borderColor: 'rgb(0 0 0 / 6%)',
          marginBottom: "1rem",
          }}>
            <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        sx = {{
          '& .MuiTabs-indicator': {
            backgroundColor: 'black',
            height: '1.9px',
            borderRadius: '5rem',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.7rem',
            fontWeight: '600',
            // width: '5rem',
          },
        }}
        >
          <Tab 
          label="Tous"
          value="1"
          sx = {{
            '&.Mui-selected': {
              color: 'black',
            },
          }}
          />
          <Tab 
          label="Terminés"
          value="2"
          sx = {{
            '&.Mui-selected': {
              color: 'black',
            },
          }}
          />
          <Tab  
          label="Programmés"
          value="3"
          sx = {{
            '&.Mui-selected': {
              color: 'black',
            },
          }}
          />
        </Tabs>
          </Box>
          {value === "1" && <AllCampaignsTable/>}
          {value === "2" && <AllCampaignsTable/>}
          {value === "3" && <ScheduledCampaignsTable/>}
      </Box>
      
    </Box>
  )
}

export default Campaigns
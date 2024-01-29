import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CardMembershipRoundedIcon from '@mui/icons-material/CardMembershipRounded';
import SubscriptionsTab from '../../components/SubscriptionsTab'
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import TextField from '@mui/material/TextField';
import ProfileTab from '../../components/ProfileTab';
import EditPasswordTab from '../../components/EditPasswordTab';
import SmsConfigTab from '../../components/SmsConfigTab';
import { useSelector } from 'react-redux';



const CustomTextField = (props) => {
  return (
    <TextField
      {...props}
      inputProps={{
        style: {
          fontSize: '0.75rem',
          color: '#000',
          fontWeight: '600',
          padding: '0.85rem 0.5rem',
          borderRadius: '20px',
          ...props.inputProps?.style,
        },
      }}
      sx={{
        backgroundColor: '#f2f2f2',
        borderRadius: '8px',
        fontSize: '0.5rem',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#F5F5F5',
          },
          borderRadius: '8px',
        },
        ...props.sx,
      }}
    />
  );
};


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


function Settings() {

    const [value, setValue] = React.useState(0);
    const user = useSelector((state) => state.reducer.user);
    const isUser = user?.role === 'user';

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  return (
    <Box m="1.5rem 2rem" sx = {{backgroundColor: '#fff', borderRadius: '10px' , height: '85vh'}}>
      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12} lg={3}>
          <Paper sx={{ p: 2, paddingX: { xs: 4, md: 2 } , backgroundColor: 'transparent' , boxShadow:'none' }}>
            <Typography sx = {{fontSize:"1.1rem", fontWeight:"700", marginBottom: '1rem'}}>
              Paramètres
            </Typography>
            <Tabs
              orientation="vertical"
              value={value}
              onChange={handleChange}
              sx={{ 
                borderRight: 0,
                borderColor: 'transparent',
                }}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#FF6100',
                  borderRadius: '20px',
                  width: '0.2rem',
                }
              }}
            >
              <Tab  
                label={
                  <div style={{ display: 'flex',alignItems: 'center'}}>
                    <AccountCircleRoundedIcon sx={{ marginRight: 3 , fontSize:'1.1rem' }} />
                    <Typography
                      sx = {{
                        fontSize :"0.75rem",
                        fontWeight: 600,
                        textTransform:'none',
                      }}
                    >Mon Compte</Typography>
                  </div>
                } 
                {...a11yProps(0)}
                sx={{
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'start',
                    '&.Mui-selected': {
                        color:'#FF6100',
                        backgroundColor: '#ffefe6',
                    },
                    '&:hover': {
                        backgroundColor: '#efefef',
                    },
                    minHeight: '2.4rem',
                    marginBottom: '0.3rem',
                }}
              />
              {
                isUser &&
                <Tab  
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextsmsRoundedIcon sx={{ marginRight: 3 , fontSize:'1.1rem' }} />
                    <Typography
                      sx = {{
                        fontSize :"0.75rem",
                        fontWeight: 600,
                        textTransform:'none'
                      }}
                    >Configuration sms</Typography>
                  </div>
                } 
                {...a11yProps(1)}
                sx={{
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'start',
                    '&.Mui-selected': {
                      color:'#FF6100',
                      backgroundColor: '#ffefe6',
                    },
                    '&:hover': {
                      backgroundColor: '#efefef',
                  },
                    minHeight: '2.4rem',
                    marginBottom: '0.3rem',
                }}
              />}
              <Tab  
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LockRoundedIcon sx={{ marginRight: 3 , fontSize:'1.1rem' }} />
                    <Typography
                      sx = {{
                        fontSize :"0.75rem",
                        fontWeight: 600,
                        textTransform:'none'
                      }}
                    >Mot de passe</Typography>
                  </div>
                } 
                {...a11yProps(1)}
                sx={{
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'start',
                    '&.Mui-selected': {
                      color:'#FF6100',
                      backgroundColor: '#ffefe6',
                    },
                    '&:hover': {
                      backgroundColor: '#efefef',
                  },
                    // on hover change background color
                    minHeight: '2.4rem',
                    marginBottom: '0.3rem',
                }}
              />
              <Tab  
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CardMembershipRoundedIcon sx={{ marginRight: 3 , fontSize:'1.1rem' }} />
                    <Typography
                      sx = {{
                        fontSize :"0.75rem",
                        fontWeight: 600,
                        textTransform:'none'
                      }}
                    >Abonnement</Typography>
                  </div>
                } 
                {...a11yProps(1)}
                sx={{
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'start',
                    '&.Mui-selected': {
                      color:'#FF6100',
                      backgroundColor: '#ffefe6',
                    },
                    '&:hover': {
                      backgroundColor: '#efefef',
                  },
                    // on hover change background color
                    minHeight: '2.4rem',
                    marginBottom: '0.3rem',
                }}
              />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={9} >
          <Stack direction="column" spacing={2}>
            <Paper sx={{paddingX: { xs: 4, md: 2 },boxShadow:'none'}}>
              
              <TabPanel value={value} index={0}>
                <Stack>
                    <ProfileTab />
                </Stack>
              </TabPanel>

             { isUser &&
              <TabPanel value={value} index={1}>
                <Stack>
                <SmsConfigTab />
                </Stack>
              </TabPanel>
              }

              <TabPanel value={value} index={isUser ? 2 : 1}>
                <Stack>
                <EditPasswordTab />
                </Stack>
              </TabPanel>

              <TabPanel value={value} index={isUser ? 3 : 2}>
                 <Stack>
                    <SubscriptionsTab />
                </Stack>
              </TabPanel>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings
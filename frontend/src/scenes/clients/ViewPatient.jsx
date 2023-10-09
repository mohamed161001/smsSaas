import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import PatientInfo from '../../components/PatientInfo';
import {
  Typography,
  Tabs,
  Tab,
  Skeleton,
} from '@mui/material';
import ViewActes from '../../components/ViewActes';
import ImagesTab from '../../components/ImagesTab';
import PaymentsTab from '../../components/PaymentsTab';
import { useGetPatientQuery } from '../../state/api';
import { useParams, Link } from 'react-router-dom'
import PatientAppointments from '../../components/PatientAppointments';
import { useSelector } from 'react-redux';
import { useLogout } from '../../hooks/useLogout';


const ViewPatient = () => {

  const { logout } = useLogout()
  
  const [value, setValue] = useState(0);
  const token = useSelector((state) => state.reducer.token)

  const { id } = useParams();
  // console.log(id);

  const { data, isLoading, error } = useGetPatientQuery({
    id : id,
    token
  });

  // console.log(data);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (error && error.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [error]);

  return (
    <Box>
       {isLoading ? ( 
             <Box
              sx={{
                m : '0.7rem',
              }}
              >
                <Skeleton 
                variant="rounded"
                height={50}
                sx = {{
                  borderRadius: '1.5rem',
                  mb: '0.7rem',
                }}
                />
                <Skeleton 
                variant="rounded"
                height={500}
                sx = {{
                  borderRadius: '.5rem',
                  m : '0.7rem',
                }}
                />
              </Box>
        ) : (
      <Box>
      <PatientInfo patient={data} />
      <Box 
        sx={{
          m : '0.7rem',
          borderRadius: '0.5rem',
          p : '0.5rem',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          // centered
          textColor="primary"
          indicatorColor="primary"
          // variant="fullWidth"
          sx = {{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderRadius: '0.5rem',
            '& .MuiTabs-indicator': {
              backgroundColor: '#3788d8',
              height: '1.9px',
              borderRadius: '5rem',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              width: '10rem',
            },
            '& .Mui-selected': {
              backgroundColor: '#fff',
              color: '#3788d8',
              borderRadius: '0.5rem',
            },

          }}
        >
          <Tab 
          label="Actes"
          />
          <Tab label="Rendez-vous" />
          <Tab label="Imageries" />
          <Tab label="Paiements" />
        </Tabs>
        {
          value === 0 && 
          <ViewActes/>
        }
        {
          value === 1 && <PatientAppointments />
        }
        {
          value === 2 && <ImagesTab />
        }
        {
          value === 3 && <PaymentsTab />
        }
        </Box>
      </Box>
        )}
    </Box>
  );
}

export default ViewPatient;

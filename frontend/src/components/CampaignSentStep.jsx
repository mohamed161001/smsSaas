import React from 'react'
import {
    Button,
    Box, 
    Typography,
} from '@mui/material';
import sendinglogo from '../assets/2.png';
import { useNavigate } from 'react-router-dom';

const CampaignSentStep = () => {
    const navigate = useNavigate();
  return (
    <Box
      sx = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
        <img src={sendinglogo} alt="logo" style={{ width: '15%', height: 'auto', margin: '20px auto' }} />
        <Typography
        sx = {{
          textAlign: 'center',
          color: '#000000',
          fontWeight: '700',
          fontSize: '1.1rem',
        }}
        >
            Votre campagne est en cours d'envoi
        </Typography>
        <Typography
        sx = {{
          textAlign: 'center',
          color: '#000000',
          fontWeight: '500',
          fontSize: '0.8rem',
          mt: '0.5rem',
        }}
        >
            Merci de patienter quelques instants ...
        </Typography>
        <Button
        variant="contained"
        onClick={() => navigate('/campaigns')}
        sx={{
            backgroundColor: "black",
                            color: "#fff",
                            borderRadius: "7px",
                            boxShadow: "none",
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            padding: "0.6rem 1.7rem",
                            textTransform: "none",
                            margin: "1rem 0rem",
                            '&:hover': {
                                backgroundColor: "#2b2b2b",
                                boxShadow: "none",
                              },
        }}
        >
            Retour au dashboard
        </Button>


    </Box>
  )
}

export default CampaignSentStep
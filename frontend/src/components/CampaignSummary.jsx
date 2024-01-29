import React from 'react'
import {
    Box,
    Typography,
    Grid,
    Divider,
    Alert,
    Skeleton,
} from '@mui/material';
import { useSelector } from 'react-redux'
import { useLogout } from '../hooks/useLogout';
import { useGetSmsBalanceQuery } from '../slices/CampaignSlice';

const CampaignSummary = ({campaignName, campaignGroup, message,setNotEnoughCredits,notEnoughCredits,setIsCampiagnSummaryLoading}) => {

  const { logout } = useLogout()
  const clientId = useSelector((state) => state.reducer.client)
  const token = useSelector((state) => state.reducer.token)

    const { data, error, isLoading } = useGetSmsBalanceQuery({
      user : clientId,
      token: token,
    })


    // if the loading is true, set the isCampiagnSummaryLoading to true then set it to false when the loading is done
    React.useEffect(() => {
      if (isLoading) {
        setIsCampiagnSummaryLoading(true);
      } else {
        setIsCampiagnSummaryLoading(false);
      }
    }, [isLoading, setIsCampiagnSummaryLoading]);


    const isExpired = data && data.availableUnits.status === 'EXPIRED';
    const notEnoughCredit = data && data.availableUnits.availableUnits < campaignGroup.numberOfContacts;

    // set the not enough credit to true if the user doesn't have enough credit or if the sms status is expired
    React.useEffect(() => {
      if (isExpired || notEnoughCredit) {
        setNotEnoughCredits(true);
      }
    }, [isExpired, notEnoughCredit, setNotEnoughCredits]);


  return (
    <Box>
      {isLoading ? (
        <Box>
        <Skeleton
        variant="rectangular"
        width="100%"
        height={30}
        sx={{
          borderRadius: '8px',
          marginTop: '0.5rem',
        }}
        />
        <Skeleton
        variant="rectangular"
        width="100%"
        height={30}
        sx={{
          borderRadius: '8px',
          marginTop: '0.5rem',
        }}
        />
        <Skeleton
        variant="rectangular"
        width="100%"
        height={30}
        sx={{
          borderRadius: '8px',
          marginTop: '0.5rem',
        }}
        />
        <Skeleton
        variant="rectangular"
        width="100%"
        height={30}
        sx={{
          borderRadius: '8px',
          marginTop: '0.5rem',
        }}
        />
        </Box>
        
      ) : (
    <Box>
      <Typography 
      sx={{
        fontWeight: '600',
        fontSize: '0.85rem',
        color: '#000',
        }}>
        Résumé de la campagne
      </Typography>
      <Grid container spacing={1} sx={{marginTop: '0.5rem'}}>
        <Grid item xs={12} sm={2}>
          <Typography
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.76rem',
            color: '#8b8b8b',
          }}
          >
            Nom
          </Typography>
          <Typography
          sx={{
            fontWeight: '500',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#000',
          }}
          >
            {campaignName}
          </Typography>
        </Grid>
        <Divider 
        orientation="vertical" 
        flexItem 
        variant='middle'
        sx={{
          marginRight: '0.5rem',
          borderColor: 'rgb(0 0 0 / 6%)',
        }}
        />
        <Grid item xs={12} sm={2}>
          <Typography
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#8b8b8b',
          }}
          >
            Groupe de contacts
          </Typography>
          <Typography
          sx={{
            fontWeight: '500',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#000',
          }}
          >
            {campaignGroup.name}
          </Typography>
        </Grid>
        <Divider
        orientation="vertical"
        flexItem
        variant='middle'
        sx={{
          marginRight: '0.5rem',
          borderColor: 'rgb(0 0 0 / 6%)',
        }}
        />
        <Grid item xs={12} sm={2}>
          <Typography
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#8b8b8b',
          }}
          >
            Nombre de contacts
          </Typography>
          <Typography
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#000',
          }}
          >
            {campaignGroup.numberOfContacts}
          </Typography>
        </Grid>
        <Divider
        orientation="vertical"
        flexItem
        variant='middle'
        sx={{
          marginRight: '0.5rem',
          borderColor: 'rgb(0 0 0 / 6%)',
        }}
        />
        <Grid item xs={12} sm={3}>
          <Typography
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#8b8b8b',
          }}
          >
            Crédit SMS
          </Typography>
          <Typography
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            color: '#000',
          }}
          >
          {isExpired ? 0 : data && data.availableUnits.availableUnits}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
        <Typography
      sx={{
        fontWeight: '600',
        fontSize: '0.8rem',
        color: '#000',
        marginTop: '0.5rem',
      }}
      >
        Message
      </Typography>
      <Typography
      sx={{
        fontWeight: '500',
        fontSize: '0.7rem',
        color: '#000',
        backgroundColor: '#e1e1e1',
        padding: '0.55rem',
        borderRadius: '5px',
        marginTop: '0.5rem',
        overflowWrap: 'anywhere',
        userSelect: 'none',
      }}
      >
        {message}
      </Typography>
      </Grid>

      </Grid> 
      
      {
        (isExpired || notEnoughCredit) &&
        <Grid container spacing={1} sx={{marginTop: '0.5rem'}}>
          <Grid item xs={12} sm={7}>
        <Alert
        severity="warning"
        sx={{
          marginTop: '0.5rem',
          borderRadius: '8px',
          fontSize: '0.72rem',
          fontWeight: '600',
        }}
        >
          Vous n'avez pas assez de crédit pour envoyer ce message à tous les contacts de ce groupe
        </Alert>
        </Grid>
        </Grid>
      }

    </Box>
      )}
    </Box>
  )
}

export default CampaignSummary
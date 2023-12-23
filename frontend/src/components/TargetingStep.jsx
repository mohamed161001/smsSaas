import React , { useState } from 'react'
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Grid,
    InputLabel,
    Avatar,
    Chip,
    IconButton,
    Select,
    MenuItem,
} from '@mui/material';
import {
    MoodRounded,
    AutoFixHighRounded ,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Phone from '../assets/Phone.png'
import FlexBetween from '../components/FlexBetween';

const CustomTextField = (props) => {
    return (
      <TextField
      {...props}
      inputProps={{
        style: {
          fontSize: '0.74rem',
          color: '#000',
          fontWeight: '600',
          padding: '0.65rem 0.4rem',
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
          '&.Mui-focused fieldset': {
            borderColor: 'black',
          },
          borderRadius: '8px',
        },
        ...props.sx,
        //style the helper text
        '& .MuiFormHelperText-root': {
          fontSize: '0.65rem',
          fontWeight: '600',
          marginLeft: '0.2rem',
          marginTop: '0.1rem',
        },
      }}
      />
      );
    };

const TargetingStep = ({campaignName, setCampaignName, campaignGroup, setCampaignGroup}) => {

    

  return (
    <Box>
          <Grid container spacing={2}>
            {/* Left side - Inputs */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <InputLabel
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "black",
                    }}
                  >
                    Nom
                  </InputLabel>
                  <CustomTextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Nom de la campagne"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    fullWidth
                    sx={{
                      mt: "0.4rem",
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={7}>
                    <InputLabel
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                    }}
                    >
                        Groupe de contacts
                    </InputLabel>
                    <Select
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    placeholder="Groupe de contacts"
                    value={campaignGroup}
                    onChange={(e) => setCampaignGroup(e.target.value)}
                    size="small"
                    sx = {{
                        backgroundColor: "#f2f2f2",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        marginTop: "0.4rem",
                        padding: "0.15rem 0.4rem",
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f2f2f2',
                        },
                        '&.Mui-focused': {
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                          },
                        },
                    }}
                    MenuProps={{
                        // set a max height to the menu list
                        sx: {
                          maxHeight: '300px',
                        },
                      }}
                    >
                        <MenuItem value="1" sx={{ fontSize: '0.68rem', fontWeight: '600' }}>Groupe 1</MenuItem>
                        <MenuItem value="2" sx={{ fontSize: '0.68rem', fontWeight: '600' }}>Groupe 2</MenuItem>
                        <MenuItem value="3" sx={{ fontSize: '0.68rem', fontWeight: '600' }}>Groupe 3</MenuItem>
                    </Select>
                </Grid>

                        

                {/* Add more inputs as needed */}
              </Grid>
            </Grid>
          </Grid>
        </Box>   
  )
}

export default TargetingStep
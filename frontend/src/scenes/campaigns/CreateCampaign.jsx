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
} from '@mui/material';
import {
    MoodRounded,
    AutoFixHighRounded ,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Phone from '../../assets/Phone.png'
import FlexBetween from '../../components/FlexBetween';
import MessageStep from '../../components/MessageStep';
import TargetingStep from '../../components/TargetingStep';


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

const CreateCampaign = () => {

    const [activeStep, setActiveStep] = useState(0);
    

    const steps = [
        'Contacts',
        'Message',
        'Résumé',
    ]

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }


    // handling the steps

    // targeting step
    const [campaignName, setCampaignName] = useState('')
    const [campaignGroup, setCampaignGroup] = useState('')

    // message step
    const [message,setMessage] = useState('')


  return (
    <Box m="1.5rem 2.5rem">
      <Typography
              sx={{
                fontWeight:"700",
                color:"#000",
                fontSize:"1.3rem",
                }}
              >
            Créer une campagne
        </Typography>
        <Box
            sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "1rem",
                marginTop: "1rem",
            }}
        >
        <Stepper activeStep={activeStep} 
        sx={{
            mt:"1.5rem",
            // style the label
            '& .MuiStepLabel-label': {
                fontSize: '0.75rem',
                fontWeight: '600',
            },
            // Style the active label
            '& .MuiStepLabel-label.Mui-active': {
                fontWeight: '600',
            },
            //style the completed label
            '& .MuiStepLabel-label.Mui-completed': {
                fontWeight: '700',
            },
            // style the icon
            '& .MuiStepIcon-root': {
                fontWeight: '600',
                color: '#dddddd',
            },
            // style the background color of the icon
            '& .MuiStepIcon-root.Mui-active': {
                color: '#FF6100',
            },
            // style the check icon
            '& .MuiStepIcon-root.Mui-completed': {
                color: '#FF6100',
            },
            // style the connector line
            '& .MuiStepConnector-line': {
                borderColor: '#dddddd',
            },
        }}>
            {steps.map((label, index) => {
                const stepProps = {}
                const labelProps = {}
                return (
                    <Step 
                    key={label}
                    {...stepProps}
                    >
                        <StepLabel 
                        {...labelProps}
                    >{label}</StepLabel>
                    </Step>
                )
            }
            )}
        </Stepper>
        <Box sx={{mt:"1.5rem"}}>
            {activeStep === steps.length ? (
                <Box>
                    <Typography sx={{mt:"1.5rem"}}>Toutes les étapes sont terminées</Typography>
                    <Box sx={{mt:"1.5rem"}}>
                        <Button onClick={
                            () => setActiveStep(0)
                        }>
                            Réinitialiser
                        </Button>
                    </Box>
                </Box>
            ) : (
                
                <Box>
                {activeStep === steps.length ? (
    <Box>
      <Typography sx={{ mt: "1.5rem" }}>Toutes les étapes sont terminées</Typography>
      <Box sx={{ mt: "1.5rem" }}>
        <Button onClick={() => setActiveStep(0)}>Réinitialiser</Button>
      </Box>
    </Box>
  ) : (
    <Box>
      {activeStep === 0 && (
        <TargetingStep campaignName={campaignName} setCampaignName={setCampaignName} campaignGroup={campaignGroup} setCampaignGroup={setCampaignGroup}/>
      )}
      {activeStep === 1 && (
        <MessageStep message={message} setMessage={setMessage} />
      )}
    </Box>
  )}           
                    <Box sx={{mt:"1.5rem"}}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{
                                backgroundColor: "#fff",
                                color: "black",
                                borderColor: "#f55d00",
                                borderRadius: "7px",
                                boxShadow: "none",
                                fontSize: "0.65rem",
                                fontWeight: "600",
                                padding: "0.6rem 1.7rem",
                                textTransform: "none",
                                margin: "1rem 0.5rem",
                                '&:hover': {
                                  backgroundColor: "#fff",
                                  boxShadow: "none",
                                  borderColor: "#eb5900",
                                },
                              }}
                        >
                            Retour
                        </Button>
                        <Button 
                        variant="contained"
                        onClick={handleNext}
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
                            {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                        </Button>
                        </Box>
                </Box>
            )}
        </Box>
        </Box>
    </Box>
  )
}

export default CreateCampaign
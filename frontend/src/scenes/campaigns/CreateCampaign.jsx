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
    Alert,
} from '@mui/material';
import {
    MoodRounded,
    AutoFixHighRounded ,
    SendRounded,
} from '@mui/icons-material';
import { useCreateCampaignMutation } from '../../slices/CampaignSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Phone from '../../assets/Phone.png'
import FlexBetween from '../../components/FlexBetween';
import MessageStep from '../../components/MessageStep';
import TargetingStep from '../../components/TargetingStep';
import CampaignSentStep from '../../components/CampaignSentStep';
import CampaignSummary from '../../components/CampaignSummary';
import { useSelector } from 'react-redux';


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

  const user = useSelector((state) => state.reducer.user)
  const client = useSelector((state) => state.reducer.client)
  const token = useSelector((state) => state.reducer.token)

  const isSmsTokenEmpty = user.smsToken === null || user.smsToken === undefined || user.smsToken === ''
  const ismsNumberDevEmpty = user.smsNumberDev === null || user.smsNumberDev === undefined || user.smsNumberDev === ''

  const [activeStep, setActiveStep] = useState(0);
  const [isCampiagnSummaryLoading, setIsCampiagnSummaryLoading] = useState(false);

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
    // enough credits or not
    const [notEnoughCredits, setNotEnoughCredits] = useState(false)


    const isNextDisabled = () => {
      switch (activeStep) {
          case 0:
              return !campaignName || !campaignGroup || campaignGroup.length === 0;
          case 1:
              return !message || message.length === 0;
          case 2:
              return notEnoughCredits || isCampiagnSummaryLoading;
          default:
              return false;
      }
  };

  // create campaign mutation
  const [createCampaign, { isLoading, isSuccess, isError, error }] = useCreateCampaignMutation()


  const handleCampaignSend = async() => {
    const campaign = {
      userId: client,
      campaignName: campaignName,
      groupId: campaignGroup._id,
      message: message,
    }
    const formattedCampaign = {
      recipientsData: campaign,
    }
    try {
      const response = await createCampaign({
        campaign: formattedCampaign,
        token: token,
      })
      console.log(response)
    }
    catch (error) {
      console.log(error)
    }
    // move to the next step
    handleNext()
  }


  


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
            '& .MuiStepLabel-label': {
              fontSize: '0.75rem',
              fontWeight: '600',
          },
            // on small screens make the stepper label smaller
            '@media (max-width:400px)': {
              '& .MuiStepLabel-label': {
                fontSize: '0.6rem',
                fontWeight: '600',
              },
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
                borderColor: '#dddddd8c',
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
      {activeStep === 0 && (
        <TargetingStep campaignName={campaignName} setCampaignName={setCampaignName} campaignGroup={campaignGroup} setCampaignGroup={setCampaignGroup}/>
      )}
      {activeStep === 1 && (
        <MessageStep message={message} setMessage={setMessage} />
      )}
      {activeStep === 2 && (
        <CampaignSummary campaignName={campaignName} campaignGroup={campaignGroup} message={message} setNotEnoughCredits={setNotEnoughCredits} notEnoughCredits={notEnoughCredits} setIsCampiagnSummaryLoading={setIsCampiagnSummaryLoading}/>
      )}
      {activeStep === steps.length  && (
         <CampaignSentStep />
      )}
    </Box>  
      { isSmsTokenEmpty && ismsNumberDevEmpty && 
        <Alert 
        severity="error"
        sx={{
            fontSize: "0.68rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
            marginTop: "1rem",
            width: "fit-content",
        }}
        >
          Veuillez configurer votre compte dans les paramètres pour pouvoir envoyer des SMS
        </Alert>
      }
    { activeStep !== steps.length &&
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
                        // onClick={handleNext}
                        onClick={activeStep === steps.length - 1 ? handleCampaignSend : handleNext}
                        // disabled={isNextDisabled() || isSmsTokenEmpty || ismsNumberDevEmpty}
                        disabled={isSmsTokenEmpty || ismsNumberDevEmpty || isLoading}
                        startIcon={activeStep === steps.length - 1 ? <SendRounded/> : null}
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
                              '& .MuiSvgIcon-root': {
                                fontSize: '0.95rem',
                              },
                          }}
                        >
                            {activeStep === steps.length - 1 ? 'Envoyer' : 'Suivant'}
                        </Button>
                        </Box>
                }
                </Box>
    </Box>
  )
}

export default CreateCampaign
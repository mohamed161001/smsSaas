import React , { useState, useRef  } from 'react'
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
import Phone from '../assets/Phone.png'
import FlexBetween from '../components/FlexBetween';
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

const MessageStep = ({message,setMessage}) => {

    const user = useSelector((state) => state.reducer.user)
    const textfieldRef = useRef(null);



    const shortcodes = [
        {
            label: "Nom",
            value: "{{lastName}}",
            preview: user.lastName
        },
        {
            label: "Prénom",
            value: "{{firstName}}",
            preview: user.firstName
        },
        {
            label: "Téléphone",
            value: "{{phoneNumber}}"
        },
    ]

    const handleShortcode = (shortcode) => {
      setMessage((prevMessage) => prevMessage + shortcode);
      // Use the ref to focus on the text field
      if (textfieldRef.current) {
        textfieldRef.current.focus();
      }
    };

    const getPreviewMessage = () => {
      let previewMessage = message;
    
      // Replace shortcodes
      shortcodes.forEach(({ value, preview }) => {
        previewMessage = previewMessage.replace(new RegExp(value, 'g'), preview);
      });
    
      // Regular expression to match URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
    
      // Replace each URL with a styled span
      previewMessage = previewMessage.replace(urlRegex, (url) => {
        return `<span style="color: blue; text-decoration: underline; cursor: pointer;" onclick="window.open('${url}', '_blank')">${url}</span>`;
      });
    
      return <div dangerouslySetInnerHTML={{ __html: previewMessage }} />;
    };
    

  return (
    <Box>
          <Grid container spacing={2}>
            {/* Left side - Inputs */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <InputLabel
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                    }}
                    >
                        Message
                    </InputLabel>
                    <FlexBetween>
                        <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            color: "#000",
                            textAlign: "left",
                        }}
                        >
                            Shortcodes 
                        </Typography>
                    <Box>
                    { shortcodes.map(({ label, value }) =>
                    <Chip
                    label={label}
                    onClick={() => handleShortcode(value)}
                    // consider the id
                    key={label}
                    sx={{
                        fontSize: "0.55rem",
                        fontWeight: "600",
                        color: "#fff",
                        backgroundColor: "black",
                        borderColor: "#000",
                        padding: "0.2rem 0.5rem",
                        margin: "0.2rem 0.2rem",
                        '&:hover': {
                            backgroundColor: "#343434",
                            boxShadow: "none",
                        },
                    }}
                    />
                    )}
                    </Box>
                    </FlexBetween>
                    <Box
                      sx = {{
                        backgroundColor: "#f2f2f2",
                        marginTop: "0.4rem",
                        borderRadius: "8px",
                        pr : "0.5rem",
                        pt: "0.1rem",
                        border: '1px solid #f2f2f2',
                       // Add a transition for a smooth effect
                            ':hover': {
                                border: '1px solid black',
                            },
                    }}
                    >
                    <TextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Message"
                    inputRef={textfieldRef} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    sx={{
                        mt: "0rem",
                        backgroundColor: "#f2f2f2",
                        borderRadius: "8px",
                        fontSize: "0.5rem",
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#F5F5F5',
                        }, 
                        '&:hover fieldset': {
                            borderColor: '#F5F5F5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#F5F5F5',
                          },
                        borderRadius: '8px',
                        },
                        //style the helper text
                        '& .MuiFormHelperText-root': {
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        // marginLeft: '0.2rem',
                        // marginTop: '0.1rem',
                        },
                        '& .MuiInputBase-input': {
                        fontSize: '0.74rem',
                        color: '#000',
                        fontWeight: '600',
                        },
                    }}
                    />
                    <FlexBetween>
                    <Typography
                    variant="body2"
                    sx={{
                        fontSize: "0.6rem",
                        fontWeight: "600",
                        color: "#000",
                        textAlign: "left",
                        marginLeft: "0.2rem",
                    }}
                    >
                    {message.length}/160
                    </Typography>
                    <Box>
                    <IconButton
                    sx={{
                        backgroundColor: "#f2f2f2",
                        borderRadius: "8px",
                        padding: "0.2rem",
                        margin: "0.2rem 0.2rem",
                        '&:hover': {
                            backgroundColor: "#f2f2f2",
                            boxShadow: "none",
                        },
                    }}
                    >
                    <MoodRounded
                    sx={{
                        fontSize: "1.1rem",
                        color: "#FF6100",
                    }}
                    />
                    </IconButton>
                    <IconButton
                    sx={{
                        backgroundColor: "#f2f2f2",
                        borderRadius: "8px",
                        padding: "0.2rem",
                        margin: "0.2rem 0.2rem",
                        '&:hover': {
                            backgroundColor: "#f2f2f2",
                            boxShadow: "none",
                        },
                    }}
                    >
                    <AutoFixHighRounded
                    sx={{
                        fontSize: "1.1rem",
                        color: "#FF6100",
                    }}
                    />
                    </IconButton>
                    </Box>
                    </FlexBetween>
                    </Box>
                </Grid>

                {/* Add more inputs as needed */}
              </Grid>
            </Grid>

            {/* Right side - Phone image */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <img src={Phone} alt="phone" width="100%" />
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: '15%',  
                    left: '48%',
                    transform: 'translateX(-50%)',
                    fontWeight: '500',
                    color: 'black',
                    fontSize: '0.6rem',
                    backgroundColor: '#e1e1e1',
                    borderRadius: '5px',
                    padding: '0.3rem 0.5rem',
                    width: '35%',
                    overflowWrap: 'anywhere',
                    userSelect: 'none',
                  }}
                >
                    {
                      message ? getPreviewMessage() : `Salut ${user.firstName} , ici c'est `
                    }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>   
  )
}

export default MessageStep
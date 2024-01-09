import React from 'react'
import {
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Avatar,
    InputLabel,
    InputAdornment,
    IconButton,
    OutlinedInput,
    Alert,
    Snackbar,
} from '@mui/material';
import { 
    Visibility,
    VisibilityOff,
    EmailRounded,
    CallRounded,
    LockRounded,
 } from '@mui/icons-material';
 import { useState, useEffect } from 'react';
import FlexBetween from './FlexBetween';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useUpdateUserMutation } from '../state/api';
import { useLogout } from '../hooks/useLogout';

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
      
      const EditPasswordTab = () => {
        
        const { logout } = useLogout()
        const user = useSelector((state) => state.reducer.user)
        const token = useSelector((state) => state.reducer.token)
        
        const [updateUser, { isSuccess, isError, isLoading: isUpdating , error }] = useUpdateUserMutation()
        
        const validationSchema = yup.object({
          password: yup
          .string('Entrer le nouveau mot de passe')
          .required('Le mot de passe est requis'),
          confirmPassword: yup
          .string('Confirmer le mot de passe')
          .required('Confirmer le mot de passe')
      })

      const [popupError, setPopupError] = useState('');

      // snackbar setup /////////////
      const [open, setOpen] = React.useState(false);

          const handleClick = () => {
            setOpen(true);
          };

          const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
              return;
            }

            setOpen(false);
          };
      ////////////////////////////////


    // formik setup
    const formik = useFormik({
        initialValues: {
          password: '',
          confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          if (values.password !== values.confirmPassword) {
            setPopupError('Les mots de passe ne correspondent pas');
            return;
          }
          const formData = new FormData()
          formData.append('password', values.password)
          try {
            const response = updateUser({ 
              id: user?._id,
              user: formData,
              token
          })
          handleClick()
          if (response.error) {
            const errorMessage = response.error.data.error;
            setPopupError(errorMessage);
            console.log('Error:', errorMessage);
          } else {
            // Handle the successful response here
            console.log('Success:', response);
          }
          }
          catch (error) {
            console.log('error',error)
          }
        },
        enableReinitialize: true,
    })
    ////////////////////////////////

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (error && error.status === 401) {
        logout()
        console.log("unauthorized");
      }
    }, [error]);

  return (
    <Box >
        <Typography sx = {{fontSize:"0.95rem", fontWeight:"700",}}>
            Changer le mot de passe
        </Typography>
        {
            isSuccess && (
                <Snackbar 
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                // top right 
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx ={{
                    // put it a little bit down
                    marginTop:"2.5rem",

                }}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' , fontSize:"0.7rem" , fontWeight:"600", borderRadius:"0.5rem"}}>
                        Votre mot de passe a été changé avec succès
                    </Alert>
                </Snackbar>
            )
        }
        <Box sx = {{backgroundColor:"#fff", borderRadius:"1.2rem", mt:"1rem"}}>
                    <form onSubmit={formik.handleSubmit} noValidate encType="multipart/form-data">
                <Box sx = {{mt:"1.5rem"}}>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}>
                    <InputLabel
                        sx = {{
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color: "black",
                            marginBottom: "0.5rem",
                        }}
                    > 
                    Mot de passe
                    </InputLabel>
                    <OutlinedInput
                    placeholder="Entrer le  nouveau mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    // take off autofill from chrome
                    autoComplete="new-password"
                    fullWidth
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helpertext={formik.touched.password && formik.errors.password}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? <VisibilityOff/> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    sx = {{
                        backgroundColor: '#f2f2f2',
                        borderRadius: '8px',
                        fontSize: '0.5rem',
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'black',
                        },
                        borderRadius: '8px',
                        },
                        '.MuiSvgIcon-root': {
                        color: '#000',
                        fontSize: '1rem',
                        },
                        '.MuiOutlinedInput-notchedOutline' : {
                            borderColor: '#f2f2f2',
                        },
                        }}
                    inputProps={{style: {
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "0.65rem 0.4rem",
                        borderRadius: "20px",
                    }}}
                    />
                    </Grid>
                    <Grid item xs={12} sm={7}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    > 
                    Confirmer le mot de passe
                    </InputLabel>
                    <OutlinedInput
                    placeholder="Confirmer le mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    // take off autofill from chrome
                    autoComplete="new-password"
                    // set a text 
                    fullWidth
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helpertext={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? <VisibilityOff/> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    sx = {{
                        backgroundColor: '#f2f2f2',
                        borderRadius: '8px',
                        fontSize: '0.5rem',
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#f2f2f2',
                        },
                        borderRadius: '8px',
                        },
                        '.MuiSvgIcon-root': {
                        color: '#000',
                        fontSize: '1rem',
                        },
                        '.MuiOutlinedInput-notchedOutline' : {
                            borderColor: '#f2f2f2',
                        },
                        }}
                    inputProps={{style: {
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "0.65rem 0.4rem",
                        borderRadius: "20px",
                    }}}
                    />
                    </Grid>
                    <Grid item xs={12} sm={7}>
                    {isError && (
                        <Alert severity="error" sx={{ fontSize: '0.65rem', fontWeight: '600', marginTop: '0.5rem' }}>
                        {error?.data?.error} 
                        </Alert>
                    )}
                    </Grid>
                    <Grid item xs={12} sm={7}>
                    <Box
                   display="flex"
                    sx={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                    }}
                    >
        <Button
          variant="contained"
          type='submit'
          disabled={isUpdating}
          sx={{
            backgroundColor: "black",
            color: "#fff",
            borderRadius: "7px",
            boxShadow: "none",
            fontSize: "0.65rem",
            fontWeight: "500",
            padding: "0.6rem 1.7rem",
            textTransform: "none",
            margin: "1rem 0rem",
            '&:hover': {
              backgroundColor: "#c94d00",
              boxShadow: "none",
            },
          }}
        >
           Confirmer
        </Button>
       </Box>
       </Grid>
    </Grid> 
    </Box>
    </form>
           </Box>
        </Box>
  )
}

export default EditPasswordTab
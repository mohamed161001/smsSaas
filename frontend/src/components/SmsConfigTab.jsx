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
    Skeleton,
} from '@mui/material';
import { 
    Visibility,
    VisibilityOff,
    EmailRounded,
    CallRounded,
    KeyRounded,
 } from '@mui/icons-material';
 import { useState, useEffect } from 'react';
import FlexBetween from './FlexBetween';
import { useGetUserQuery , useUpdateUserMutation } from '../state/api';
import { useGetUserSmsBalanceQuery } from '../state/api';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
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
    
    const SmsConfigTab = () => {
      
      const { logout } = useLogout()
      const user = useSelector((state) => state.reducer.user)
      const token = useSelector((state) => state.reducer.token)

      const { data, isLoading, error } = useGetUserQuery({ id: user?._id, token })
      const [updateUser, { isSuccess, isError, isLoading: isUpdating, error: updateError }] = useUpdateUserMutation()

      const { data:smsBalance, error:smsBalanceError, isLoading: smsBalanceLoading} = useGetUserSmsBalanceQuery({
        user : user?._id,
        token: token,
      })



      const isExpired = smsBalance && smsBalance?.availableUnits?.status === 'EXPIRED';


    // formik setup
    const formik = useFormik({
        initialValues: {
          smsToken : data?.user?.smsToken,
          smsNumberDev : data?.user?.smsNumberDev,
        },
        validationSchema: yup.object({
          smsToken: yup.string().required('Le token d\'authentification est requis').matches(/^Basic [A-Za-z0-9+/]+={0,2}$/, 'Le format du token n\'est pas valide'),
          smsNumberDev: yup.string().required('Le numéro de téléphone d\'envoi est requis').matches(/^216\d{8}$/, 'Le numéro de téléphone doit commencer par 216 suivi de 8 chiffres'),
        }),
        onSubmit: async(values) => {
          const formData = new FormData()
          formData.append('smsToken', values.smsToken)
          formData.append('smsNumberDev', values.smsNumberDev)
          try {
            console.log('values',values)
            console.log('form data',formData)
            const response = await updateUser({ 
                id: user?._id,
                user: formData,
                token
            })
        }
        catch (error) {
            console.log('error',error)
        }
        },
        enableReinitialize: true,
    })



  useEffect(() => {
    if (error && error.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [error]);

  const [showSmsConfig, setShowSmsConfig] = useState(false);
  const handleClickShowSmsConfig = () => setShowSmsConfig(!showSmsConfig);


  useEffect(() => {
    if (data?.user?.smsNumberDev && data?.user?.smsToken) {
      setShowSmsConfig(true)
    }
  }
  , [data])


  return (
    <Box >
        <Typography sx = {{fontSize:"0.95rem", fontWeight:"700",}}>
            Configuration des SMS
        </Typography>
        <Typography sx = {{fontSize:"0.7rem", fontWeight:"500", mt:"0.3rem"}}>
            Configurez votre compte SMS pour commencer à envoyer des SMS
        </Typography>
        {smsBalanceLoading && showSmsConfig ? (
        <Box>
        <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
                mt:"1rem",
              }}
              />
        <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
        <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
        <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
        </Box>
      ) :
          showSmsConfig && !smsBalanceError ? (
          <Box sx = {{mt:"1rem"}}>
            <Box sx = {{
              display:"flex",
              '& > :not(style) + :not(style)': {
                marginLeft: '1rem',
              },
              }}>
            <Box
            sx = {{
              backgroundColor:"#fff",
              borderRadius:"0.5rem",
              // boxShadow:"0px 0px 8px rgba(0, 0, 0, 0.1)",
              border:"1px solid #f2f2f2",
              padding:"1rem",
              width:"50%",
              }}
            >
            <Typography sx = {{
              fontSize:"0.75rem",
              fontWeight:"600",
              color:"#8b8b8b",
            }}>
              Crédit SMS disponible
            </Typography>
            <Typography 
            sx = {{
              fontSize:"1rem",
              fontWeight:"800",
            }}>
              {isExpired ? 0 : smsBalance && smsBalance?.availableUnits?.availableUnits} SMS
            </Typography>
            </Box>
            <Box
              sx = {{
                backgroundColor:"#fff",
                borderRadius:"0.5rem",
                // boxShadow:"0px 0px 8px rgba(0, 0, 0, 0.1)",
                border:"1px solid #f2f2f2",
                padding:"1rem",
                width:"50%",
                }}
            >
            <Typography 
            sx = {{
              fontSize:"0.75rem",
              fontWeight:"600",
              color:"#8b8b8b",
            }}>
              Crédit SMS non disponible
            </Typography>
            <Typography 
            sx = {{
              fontSize:"1rem",
              fontWeight:"800",
            }}>
              {!isExpired ? 0 : smsBalance && smsBalance?.availableUnits?.availableUnits} SMS
            </Typography>
            </Box>
            </Box>
            <Button
            variant="contained"
            onClick={handleClickShowSmsConfig}
            sx={{
              backgroundColor: "black",
              color: "#fff",
              borderRadius: "7px",
              boxShadow: "none",
              fontSize: "0.65rem",
              fontWeight: "500",
              padding: "0.6rem 1.7rem",
              textTransform: "none",
              marginTop: "1rem",
              '&:hover': {
                backgroundColor: "#2b2b2b",
                boxShadow: "none",
              },
            }}
            >
              Modifier
            </Button>
          </Box>
          ) : (
        <Box sx = {{backgroundColor:"#fff", borderRadius:"1.2rem", mt:"1rem"}}>
              <form onSubmit={formik.handleSubmit} noValidate encType="multipart/form-data">
                <Box sx = {{mt:"1.5rem"}}>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Token d'authentification
                    </InputLabel>
                    <CustomTextField
                    fullWidth
                    id="smsToken"
                    name="smsToken"
                    variant="outlined"
                    size="small"
                    placeholder="Entrez votre token d'authentification"
                    value={formik.values.smsToken}
                    onChange={formik.handleChange}
                    error={formik.touched.smsToken && Boolean(formik.errors.smsToken)}
                    helperText={formik.touched.smsToken && formik.errors.smsToken}
                    // add icon in the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <KeyRounded sx = {{color: "#000" , fontSize: "1rem"}}/>
                        </InputAdornment>
                        ),
                    }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Numéro de téléphone d'envoi
                    </InputLabel>
                    <CustomTextField
                    fullWidth
                    id="smsNumberDev"
                    name="smsNumberDev"
                    variant="outlined"
                    size="small"
                    placeholder="Entrez votre numéro de téléphone d'envoi"
                    value={formik.values.smsNumberDev}
                    onChange={formik.handleChange}
                    error={formik.touched.smsNumberDev && Boolean(formik.errors.smsNumberDev)}
                    helperText={formik.touched.smsNumberDev && formik.errors.smsNumberDev}
                    // add icon in the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <CallRounded sx = {{color: "#000" , fontSize: "1rem"}}/>
                        </InputAdornment>
                        ),
                    }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      { 
                      isError &&
                      <Alert 
                      severity="error"
                      fullWidth
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: "600",
                        alignItems: "center",
                        borderRadius: "8px",
                        marginTop: "0.5rem",
                      }}
                      >{updateError?.data?.error}</Alert>
                      }
                      { isSuccess && 
                      <Alert 
                      severity="success"
                      fullWidth
                      sx = {{
                        fontSize: "0.68rem",
                        fontWeight: "600",
                        alignItems: "center",
                        borderRadius: "8px",
                        marginTop: "0.5rem",
                      }}
                      >Modifications enregistrées avec succès</Alert>}
                    </Grid>
                    <Grid item xs={12} sm={8}>
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
                        '&:hover': {
                          backgroundColor: "#2b2b2b",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Enregistrer
                    </Button>
                </Box>
       </Grid>
       <Grid item xs={12} sm={8}>
        {/* { data?.user?.smsNumberDev && data?.user?.smsToken &&
        <Box>
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
          {isExpired ? 0 : smsBalance && smsBalance.availableUnits.availableUnits}
        </Typography>
        </Box>
        } */}
        </Grid>
    </Grid> 
    </Box>
    </form>
    </Box>
    )}
  </Box>
  )
}

export default SmsConfigTab
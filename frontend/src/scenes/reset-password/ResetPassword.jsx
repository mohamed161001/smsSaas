import Box from "@mui/system/Box";
import { useState } from "react";
import logo from '../../assets/msini.png';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import { 
    OutlinedInput,
    InputAdornment,
    IconButton,
 } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate,useParams } from "react-router-dom";
import { useForgetPasswordMutation } from "../../state/api";
import { useUpdateUserMutation } from "../../state/api";
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';


// custom text field
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




const ResetPassword = () => {

  const [updateUser, { isSuccess, isError, isLoading, error }] = useUpdateUserMutation()
  const navigate = useNavigate();
  const { token, id } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object({
    password: yup
      .string('Entrer votre mot de passe')
      .required('Mot de passe requis'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
        .required('Confirmer votre mot de passe'),
  });

  

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async(values) => {
        const formData = new FormData()
        formData.append('password', values.password)
        try {
            const response = await updateUser({ 
                id: id,
                user: formData,
                token
            })
        }
        catch (err) {
            console.log(err)
        }
    },
  });
  
  return ( 
    <Box
      sx={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <Box
          sx={{
              display: 'flex',
              flexDirection: 'flex-start',
              ml : 4,
          }}
        >
          <img src={logo} alt="logo" style={{ 
                        height: 'auto',
                        width: '7.5rem',
                        marginTop: '1.5rem',
            }} />
        </Box>
      <Box 
      sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
      }}
      >
        <Grid
        sx={{
            alignItems: "center",
            justifyContent: "center",
            width: "270px"
        }}
        >
            <Grid item xs={12} sm={4}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                }}>
                    <LockResetRoundedIcon sx={{ fontSize: 50 , color: "#FF6100" , backgroundColor: "#ffefe6", borderRadius: "50%" , padding: "0.5rem"}}/>
                </Box>
                <Typography variant="h6"
                        sx={{
                        mt: 2,
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        alignSelf: "center",
                        textAlign: 'center',
                        }}
                    >
                        Réinitialiser mot de passe
                    </Typography>
                    
            </Grid>
            <Grid 
                item xs={10}
            >
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Grid item xs={12} sm={4}>
                        < InputLabel
                        id="demo-simple-select-label"
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "black",
                            marginBottom: "0.5rem",
                            marginTop: "1rem",
                        }}
                        >
                            Nouveau mot de passe
                        </InputLabel>
                        <OutlinedInput
                        required
                        fullWidth
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        onChange={formik.handleChange}
                        placeholder="Entrer votre nouveau mot de passe"
                        variant="outlined"
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helpertext={formik.touched.password && formik.errors.password}
                        size="small"
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
                            padding: "0.75rem 0.45rem",
                            borderRadius: "20px",
                        }}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        < InputLabel
                        id="demo-simple-select-label"
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "black",
                            marginBottom: "0.5rem",
                            marginTop: "1rem",
                        }}
                        >
                            Confirmer mot de passe
                        </InputLabel>
                        <OutlinedInput
                        required
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        onChange={formik.handleChange}
                        placeholder="Confirmer le nouveau mot de passe"
                        variant="outlined"
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        size="small"
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
                            padding: "0.75rem 0.45rem",
                            borderRadius: "20px",
                        }}}
                        />
                    </Grid>
                    <Grid item xs={10} mt={2}>
                        <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading || isSuccess}
                        sx={{
                            backgroundColor: "black",
                            minWidth: "200px",
                            color: "white",
                            borderRadius: "7px",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            padding: "0.6rem 1rem",
                            width: "100%",
                            boxShadow: "none",
                            '&:hover': {
                                backgroundColor: "#2b2b2b",
                                boxShadow: "none",
                              },
                        }}
                        >
                        Réinitialiser
                        </Button>
                    </Grid>
                    {
                      error && <Alert 
                      severity="error"
                      sx={{
                        mt: 2,
                        width: "100%",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                      >{error?.data?.error || error?.data?.message}</Alert>
                    }
                    {
                      isSuccess && <Alert 
                      severity="success"
                      sx={{
                        mt: 2,
                        width: "100%",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                      >Votre mot de passe a été réinitialisé avec succès</Alert>
                    }
                    <Grid 
                      item
                      xs={12}
                      mt={1}
                      sx={{
                          display: "flex",
                          justifyContent: "center",
                      }}
                    >
                        <ArrowBackRoundedIcon
                          onClick={() => {navigate("/login", { replace: true });}}
                          sx={{
                            fontSize: "1.5rem",
                            color: "black",
                            cursor: 'pointer',
                            alignSelf: "center",
                            mr: 1,
                            mt: 2,
                          }}
                        />
                        <Typography variant="caption"
                          onClick={() => {navigate("/login", { replace: true });}}
                          sx={{
                            mt: 2,
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            alignSelf: "center",
                            color: "black",
                            cursor: 'pointer'
                          }}
                        >
                          Retour à la connexion
                        </Typography>
                    </Grid>
                </form>
            </Grid>
        </Grid>
      </Box>
      </Box>
    );
}
 
export default ResetPassword;
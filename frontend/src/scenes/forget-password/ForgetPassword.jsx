import Box from "@mui/system/Box";
import logo from '../../assets/msini.png';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../../state/api";
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




const ForgetPassword = () => {

  const [forgetPassword, { isLoading, error , isSuccess }] = useForgetPasswordMutation();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup.string().email('Entrer un email valide').required('Email requis'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async(values) => {
      try {
        const response = await forgetPassword({
          email: values.email
        })
        if (response?.data?.success)
        navigate('/login', { replace: true })
      } catch (error) {
        console.error("Error during login:", error);
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
                    {/* <img src={logo} alt="logo" style={{ maxWidth: "200px", height: "auto" }} /> */}
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
                        Mot de passe oublié ?
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
                            Email
                        </InputLabel>
                        <CustomTextField
                        required
                        fullWidth
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        placeholder="Entrer votre email"
                        variant="outlined"
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        size="small"
                        sx ={{
                            marginBottom:"0.5rem"
                        }}
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
                        Réinitialiser mot de passe
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
                      >{error?.data?.error}</Alert>
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
                      >Un email de réinitialisation de mot de passe a été envoyé à votre adresse email</Alert>
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
 
export default ForgetPassword;
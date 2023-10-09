import Box from "@mui/system/Box";
import logo from "../../assets/logo.png";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../../state/api";


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


  // Api calls


const ForgetPassword = () => {

  const [ forgetPassword, isLoading, error ] = useForgetPasswordMutation()
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
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
        navigate('/login', { replace: true })
        // console.log(response);
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
                    <img src={logo} alt="logo" style={{ maxWidth: "200px", height: "auto" }} />
                </Box>
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
                            fontWeight: "600",
                            color: "#6B7280",
                            marginBottom: "0.5rem",
                            textAlign: 'center'
                        }}
                        >
                            veuillez entrer votre email
                        </InputLabel>
                        <CustomTextField
                        required
                        fullWidth
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        placeholder="Email"
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
                        disabled={!isLoading}
                        sx={{
                            backgroundColor: "#4b67e4",
                            minWidth: "200px",
                            color: "white",
                            borderRadius: "7px",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            padding: "0.6rem 1rem",
                            width: "100%",
                        }}
                        >
                            envoyer
                        </Button>
                    </Grid>
                    {
                      error && <Alert 
                      severity="error"
                      sx={{
                        mt: 2,
                        width: "100%",
                      }}
                      >{error?.data?.error}</Alert>
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
                        <Typography variant="caption" 
                            sx={{
                            mt: 2,
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            alignSelf: "center",
                            "& a": {
                            color: "#4B4EFC",
                            textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                                cursor: 'pointer'
                              },
                            },
                        }}>                  
                            Vous avez déjà un compte ? &nbsp;
                            <a 
                              onClick={() => {navigate("/login", { replace: true });}}
                            > 
                              Clicker ici
                            </a>
                        </Typography>
                    </Grid>
                </form>
            </Grid>
        </Grid>
      </Box>
    );
}
 
export default ForgetPassword;
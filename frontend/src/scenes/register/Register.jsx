import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { PhoneRounded } from '@mui/icons-material';
import logo from '../../assets/msini.png';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from '../../state/api';


const CustomTextField = (props) => {
  return (
    <TextField
      {...props}
      inputProps={{
        style: {
          fontSize: '0.75rem',
          color: '#000',
          fontWeight: '600',
          padding: '0.9rem 0.5rem',
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

const Register = () => {

  const navigate = useNavigate();

    const [registerUser, { isLoading, error , isSuccess }] = useRegisterUserMutation();
  

  const validationSchema = yup.object({
    firstName: yup.string().required('Nom est requis'),
    lastName: yup.string().required('Prénom est requis'),
    phoneNumber: yup.string().required('Numéro de téléphone est requis').matches(/^[0-9]{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres'),
    email: yup.string().email('Enter a valid email').required('Email est requis'),
    password: yup.string().required('Mot de passe est requis').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
      ),
  });

  const formik = useFormik({
    initialValues: { 
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
     },
    validationSchema: validationSchema,
    onSubmit: async(values) => {
        const data = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            email: values.email,
            password: values.password,
        } 
        try {
            const response = await registerUser({
                user: data,
            });
            if (response.data) {
                navigate("/login", { replace: true });
            }
        } catch (error) {
            console.log(error);
        }
    },
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square
      sx={{
        flexGrow: { xs: 1, sm: 1, md: 0 },
        maxWidth: { xs: '100%', sm: '100%', md: '50%' },
      }}
      >
        <Box
          sx={{
              display: 'flex',
              flexDirection: 'flex-start',
              ml : 6,
              mt : 3,
          }}
        >
          <img 
          src={logo}
          alt="logo" 
          style={{ 
            width: '7.5rem',
            height: 'auto',
          }} />
        </Box>
        <Box
          sx={{
            my: 4,
            mx: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <form onSubmit={formik.handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={12}>
          <Typography component="h1" variant="h5" sx={{ fontSize: "1.6rem", fontWeight: "700", color: "#000", }}>
            Créer un compte
          </Typography>
          <Typography
          sx={{
              fontSize: "0.76rem",
              fontWeight: "500",
              color: "#6B7280",
              marginTop: "0.3rem",
              marginBottom: "0.5rem",
              }}
          >
            Entrez vos identifiants pour créer votre compte
          </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
                  marginBottom: "0.7rem",
              }}
            >
              Nom
            </InputLabel>
            <CustomTextField
            required
            fullWidth
            id="firstName"
            placeholder="Nom"
            name="firstName"
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            variant="outlined"
            size="small"
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
                  marginBottom: "0.7rem",
              }}
            >
                Prénom
            </InputLabel>
            <CustomTextField
            required
            fullWidth
            id="lastName"
            placeholder="Prénom"
            name="lastName"
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            variant="outlined"
            size="small"
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
                  marginBottom: "0.7rem",
              }}
            >
              Email
            </InputLabel>
            <CustomTextField
            required
            fullWidth
            id="email"
            placeholder="Adresse email"
            name="email"
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <MailOutlineRoundedIcon
                position="start"
                sx={{
                  color: "#000",
                  fontSize: "1.1rem",
                  marginRight: "0.5rem",
                }}
                />
              ),
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
                  marginBottom: "0.7rem",
              }}
            >
            Numéro de téléphone
            </InputLabel>
            <CustomTextField
            required
            fullWidth
            id="phoneNumber"
            placeholder="Numéro de téléphone"
            name="phoneNumber"
            onChange={formik.handleChange}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <PhoneRounded
                position="start"
                sx={{
                  color: "#000",
                  fontSize: "1.1rem",
                  marginRight: "0.5rem",
                }}
                />
              ),
            }}
          />
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
                  marginBottom: "0.7rem",
              }}
              >
              Mot de passe
            </InputLabel>
            <CustomTextField
              margin="none"
              required
              fullWidth
              placeholder="Mot de passe"
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <LockOpenRoundedIcon
                  position="start"
                  sx={{
                    color: "#000",
                    fontSize: "1.1rem",
                    marginRight: "0.5rem",
                  }}
                  />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "#fff",
                borderRadius: "7px",
                boxShadow: "none",
                fontSize: "0.75rem",
                fontWeight: "500",
                padding: "0.75rem 1.7rem",
                textTransform: "none",
                marginTop: "0.8rem",
                '&:hover': {
                  backgroundColor: "#2b2b2b",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Chargement..." : "Créer un compte"}
            </Button>
            </Grid>
            </Grid>
            {
              error && <Alert 
              severity="error"
              sx={{
                  mt: 2,
                  width: "100%",
                  fontSize: "0.75rem",
                  fontWeight: "500",
              }}
              >{error?.data?.error}</Alert>
            }
            <Box sx={{ mt: 3 , display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Typography variant="caption" 
              sx={{
              fontSize: "0.78rem",
              fontWeight: "500",
              color: "#6B7280",
                alignSelf: "center",
                "& a": {
                color: "#5271FF",
                textDecoration: "none",
                "&:hover": {
                textDecoration: "underline",
                },
                },
              }}>
                Vous avez déjà un compte ?{" "}
              <a
                onClick={() => {navigate("/login", { replace: true });}}
                style={{ cursor: 'pointer' }}
              >
                {" "}Connectez-vous
              </a>
              </Typography>
            </Box>
          </form>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          background: '#f55d00',
          display: { xs: 'none', sm: 'none', md: 'block' },
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography 
          component="h1"
           variant="h5"
            sx={{ 
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#fff",
              // textAlign: "left",
              // alignSelf: "flex-start",
              textAlign: "center",
              mb: 5,
              }}>
              Gérer votre cabinet dentaire n'a jamais
              <br />
              été aussi simple !
          </Typography>
          {/* <Typography
          sx={{
              fontSize: "0.7rem",
              fontWeight: "500",
              color: "#fff",
              marginTop: "0.3rem",
              marginBottom: "0.5rem",
              textAlign: "left",
              alignSelf: "flex-start",
              mb: 5,
              }}
          >
            Gérez votre cabinet en toute simplicité avec 
            <br />
          </Typography> */}
          {/* <img src="" alt="login" style={{ width: '100%', height: 'auto' }} /> */}
        </Box>

        </Grid>
    </Grid>
  )
}

export default Register
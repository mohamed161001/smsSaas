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
import logo from '../../assets/msini.png';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";


const CustomTextField = (props) => {
  return (
    <TextField
      {...props}
      inputProps={{
        style: {
          fontSize: '0.75rem',
          color: '#000',
          fontWeight: '600',
          padding: '1.1rem 0.5rem',
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

const Login = () => {

  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();  

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email est requis'),
    password: yup.string().required('Mot de passe est requis'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async(values) => {
      try {
        await login(values.email, values.password);
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
              display: 'flex',
              flexDirection: 'flex-start',
              ml : 6,
              mt : 3,
          }}
        >
          <img src={logo} alt="logo" style={{ width: '19%', height: 'auto' }} />
        </Box>
        <Box
          sx={{
            my: 9,
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
              Bienvenue,
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
            Entrez vos identifiants pour vous connecter
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
              }}
            >
              Email
            </InputLabel>
            <CustomTextField
            margin="normal"
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
          <Grid item xs={12} sm={12}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "black",
                  marginBottom: "1rem",
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
          <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
            <Typography
             component="div"
              sx={{
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "#6B7280",
                cursor: "pointer",
                "&:hover": {textDecoration: "underline"},
              }}
            >
              <div
                onClick={() => {navigate("/forget_pwd", { replace: true });}}
              >
                Mot de passe oublié ?
              </div> 
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#f55d00",
                color: "#fff",
                borderRadius: "7px",
                boxShadow: "none",
                fontSize: "0.75rem",
                fontWeight: "500",
                padding: "0.75rem 1.7rem",
                textTransform: "none",
                '&:hover': {
                  boxShadow: "none",
                  backgroundColor: "#eb5900",
                },
              }}
            >
              {isLoading ? "Chargement..." : "Se connecter"}
            </Button>
            </Grid>
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
            <Box sx={{ mt: 3 , display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Typography 
            variant="caption" 
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
              Vous n'avez pas de compte ?
              <a
                onClick={() => {navigate("/register", { replace: true });}}
              >
                {" "}S'inscrire
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
          // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          // backgroundColor: (t) =>
          //   t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          background: '#f55d00',
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

export default Login
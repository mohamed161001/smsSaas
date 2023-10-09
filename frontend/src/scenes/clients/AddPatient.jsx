import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Header from '../../components/Header'
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useEffect } from 'react'
import Link from '@mui/material/Link';
import FlexBetween from '../../components/FlexBetween'
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import PersonRounded from '@mui/icons-material/PersonRounded';
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import BusinessRounded from '@mui/icons-material/BusinessRounded'
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IconButton from '@mui/material/IconButton';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useCreatePatientMutation } from '../../state/api'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useLogout } from '../../hooks/useLogout';
import { ArrowBack } from '@mui/icons-material';


const CustomTextField = (props) => {
  return (
    <TextField
      {...props}
      inputProps={{
        style: {
          fontSize: '0.75rem',
          color: '#000',
          fontWeight: '600',
          padding: '0.75rem 0.5rem',
          borderRadius: '20px',
          ...props.inputProps?.style,
        },
      }}
      sx={{
        backgroundColor: '#f2f2f2',
        borderRadius: '8px',
        fontSize: '0.5rem',
        '& .MuiFormHelperText-root': {
          fontSize: '0.65rem',
          fontWeight: '600',
          marginLeft: '0.2rem',
          marginTop: '0.1rem',
        },
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



const AddPatient = () => {

  const { logout } = useLogout()
  
  const navigate = useNavigate()

  const [createPatient, {isLoading,error}] = useCreatePatientMutation()
  const dentist = useSelector((state) => state.reducer.dentist)
  const token = useSelector((state) => state.reducer.token)

  const validationSchema = yup.object({
    firstName: yup.string().required('Le prénom est requis'),
    lastName: yup.string().required('Le nom est requis'),
    // phone number is not required but must have 8 digits
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres'),
    additionalPhoneNumber: yup
      .string()
      .matches(/^[0-9]{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres'),
  });
 

  const formik = useFormik({
      initialValues: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          sex: '',
          address: '',
          city: '',
          phoneNumber: '',
          additionalPhoneNumber: '',
          insuranceType: '',
          matricule: '',
          dentist : dentist,
      },
      validationSchema: validationSchema,
      onSubmit: async(values) => {
         console.log(values)
        const formData = new FormData()
        formData.append('dentist', values.dentist)
        formData.append('firstName', values.firstName)
        formData.append('lastName', values.lastName)
        formData.append('dateOfBirth', values.dateOfBirth)
        formData.append('sex' , values.sex)
        formData.append('address', values.address)
        formData.append('city', values.city)
        formData.append('phoneNumber', values.phoneNumber)
        formData.append('additionalPhoneNumber', values.additionalPhoneNumber)
        formData.append('insuranceType', values.insuranceType)
        formData.append('matricule', values.matricule)
       try {
        const response = await createPatient({
          patient : values,
          token
          // patient : formData,
        })
        console.log(response)
        navigate('/patients')
       }
        catch(error) {
          console.log(error)
        }
      },
  });

  useEffect(() => {
    if (error && error.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [error]);

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        sx={{
          display: "flex",
        }}
      >
          <PersonAddRoundedIcon 
          sx={{ 
            fontSize: '2.2rem',
            color: '#5271FF',
            backgroundColor: '#5271ff1c',
            borderRadius: '50%',
            padding: '0.5rem',
            marginRight: '0.6rem',
            }}/>
            <Box>
              <Typography
              sx={{
                fontWeight:"700",
                color:"#000",
                fontSize:"1rem",
                }}
              >
                Ajouter un patient
              </Typography>
              <Typography
              sx={{
                fontWeight:"600",
                color:"#6B7280",
                fontSize:"0.65rem",
                }}
              >
                Ajouter un nouveau patient
              </Typography>
              </Box>
        </Box>
        {/* <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.75rem', fontWeight: '600', color: '#000', mb: '1rem' }}>
          <Link 
          underline="hover"
          color="inherit"
          >
            Dashboard
          </Link>
          <Link 
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
          >
            <PeopleRoundedIcon sx={{ fontSize: '1rem', mr: '0.5rem' }}/>
            Patients
          </Link>
          <Typography 
          color="text.primary"
          sx={{ fontSize: '0.75rem',
          fontWeight: '600',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          }}
          >
            <PersonAddRoundedIcon sx={{ fontSize: '1rem', mr: '0.5rem' }}/>
            Ajouter un patient
          </Typography>
        </Breadcrumbs> */}
        <form onSubmit={formik.handleSubmit} noValidate enctype="multipart/form-data">
        <Box
            sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "1rem",
                marginTop: "1rem",
                // border: "1px solid #E5E5E5",
            }}
        >
          <Button
            onClick={() => navigate('/patients')}
            sx={{
              backgroundColor: "#fff",
              color: "black",
              borderRadius: "7px",
              boxShadow: "none",
              fontSize: "0.78rem",
              fontWeight: "700",
              padding: "0.1rem 0rem",
              mb : "1rem",
              textTransform: "none",
              '&:hover': {
                backgroundColor: "#fff",
                boxShadow: "none",
                color: "#5271FF",
              },
              // change the font size of the icon
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem',
                color: 'white',
                backgroundColor: '#5271FF',
                borderRadius: '50%',
                padding: '0.3rem',
                '&:hover': {
                  backgroundColor: 'white',
                  color: '#5271FF',
                  border: '1px solid #5271FF',
                },
              },
            }}
            // add icon
            startIcon={<ArrowBackRoundedIcon />}
          >
            Retour
          </Button>
          <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Prénom*
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="firstName"
                    name="firstName"
                    variant="outlined"
                    size="small"
                    placeholder="Entrer le prénom"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Nom*
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="lastName"
                    name="lastName"
                    placeholder="Entrer le nom"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    variant="outlined"
                    size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Date de naissance
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    variant="outlined"
                    size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Gender
                    </InputLabel>
                    <Select
                    fullWidth
                    id="sex"
                    name="sex"
                    variant="outlined"
                    value={formik.values.sex}
                    onChange={formik.handleChange}
                    size="small"
                    sx = {{
                        backgroundColor: "#f2f2f2",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        padding: "0.2rem 0rem",
                        fontWeight: "600",
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: '#f2f2f2',
                        },
                    }}
                    >
                       <MenuItem disabled value="" sx={{ fontSize: '0.8rem',fontWeight:'600' }}>
                            sexe
                        </MenuItem>
                        <MenuItem value="masculin" sx={{ fontSize: '0.8rem',fontWeight:'600' }}>
                            Masculin
                        </MenuItem>
                        <MenuItem value="féminin"sx={{ fontSize: '0.8rem',fontWeight:'600' }}>
                            Féminin
                        </MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Téléphone
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Entrer le numéro de téléphone"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    variant="outlined"
                    size="small"
                    // add icon to the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <LocalPhoneRoundedIcon sx={{ color: '#000', fontSize: '1rem' }} />
                        </InputAdornment>
                        ),
                    }} 
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Téléphone Additonnelle
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="additionalPhoneNumber"
                    name="additionalPhoneNumber"
                    placeholder="Entrer le numéro de téléphone"
                    value={formik.values.additionalPhoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.additionalPhoneNumber && Boolean(formik.errors.additionalPhoneNumber)}
                    helperText={formik.touched.additionalPhoneNumber && formik.errors.additionalPhoneNumber}
                    variant="outlined"
                    size="small"
                    // add icon to the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <LocalPhoneRoundedIcon sx={{ color: '#000', fontSize: '1rem' }} />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Adresse
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="address"
                    name="address"
                    placeholder="Entrer l'adresse"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    variant="outlined"
                    size="small"
                    // add icon to the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <LocationOnRoundedIcon sx={{ color: '#000', fontSize: '1rem' }} />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Ville
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="city"
                    name="city"
                    placeholder="Entrer la ville"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    variant="outlined"
                    size="small"
                    />
                </Grid>
                <Grid item xs={15} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Type d'assurance
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="insuranceType"
                    name="insuranceType"
                    placeholder="Entrer le type d'assurance"
                    value={formik.values.insuranceType}
                    onChange={formik.handleChange}
                    variant="outlined"
                    size="small"
                    // add icon to the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <ShieldRoundedIcon sx={{ color: '#000', fontSize: '1rem' }} />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    < InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                    Mat Num
                    </InputLabel>
                    <CustomTextField
                    required
                    fullWidth
                    id="insuranceNum"
                    name="matricule"
                    placeholder="Entrer le matricule"
                    value={formik.values.matricule}
                    onChange={formik.handleChange}
                    variant="outlined"
                    size="small"
                    />
                </Grid>
            </Grid>
            <Box
              display="flex"
              sx={{
              justifyContent: "flex-end",
              alignItems: "center",
              }}
        >
          
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: "#5271FF",
              color: "#fff",
              borderRadius: "7px",
              boxShadow: "none",
              fontSize: "0.65rem",
              fontWeight: "500",
              padding: "0.6rem 1.7rem",
              textTransform: "none",
              margin: "0.5rem 0rem",
              '&:hover': {
                boxShadow: "none",
              },
            }}
          >
            Ajouter patient
          </Button>
        </Box>
            </Box>
        </form>
    </Box>
  )
}

export default AddPatient
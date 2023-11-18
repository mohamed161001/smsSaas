import React, { useState, useEffect} from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Alert,
} from '@mui/material';
import { 
    Visibility,
    VisibilityOff,
    EmailRounded,
    CallRounded,
 } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useLogout } from '../hooks/useLogout';
import { useAddClientMutation } from '../slices/ClientSlice';
import {useGetGroupsQuery} from '../slices/GroupSlice'

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
  
  
  const AddContactPopup = ({ open, setOpen }) => {
    
    const { logout } = useLogout()
    const [showPassword, setShowPassword] = useState(false);
    const client = useSelector((state) => state.reducer.client)
    
    const token = useSelector((state) => state.reducer.token)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sort , setSort] = useState();
    const { data,isLoading: isLoadingGroups, error: errorGroups } = useGetGroupsQuery({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sort: JSON.stringify(sort),
      clientID: client,
      token
    });


    const [addClient, { isLoading, error }] = useAddClientMutation();

    const [popupError, setPopupError] = useState('');
    
    const validationSchema = yup.object({
        firstName: yup.string().required('Champ obligatoire'),
        lastName: yup.string().required('Champ obligatoire'),
        phoneNumber: yup.string().required('Champ obligatoire').matches(/^[0-9]{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            group : '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const data = {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                client: client,
            }
            if (values.group) {
              data.group = values.group;
          }
            try {
                const response = await addClient({
                    client: data,
                    token
                });
                setOpen(false);
                formik.resetForm();
            } catch (error) {
                console.log(error);
            }
        },
  });

    //take off the error message when the popup gets closed
  React.useEffect(() => {
      if (!open) {
          setPopupError('');
      }
  }, [open]);

  useEffect(() => {
    if (error && error.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [error]);

  return (
    <Dialog
    open={open}
    onClose={() => {
      setOpen(false);
      setPopupError('');
      formik.resetForm();
    }}
    sx = {{
      '& .MuiDialog-paper': {
        width: '30%',
        height: 'fit-content',
        borderRadius: '10px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
    }}
    >
    <DialogTitle>
      <Typography 
      sx={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#000',
      }}
      >
        Ajouter un contact
      </Typography>
    </DialogTitle>
    <DialogContent dividers> 
      <form onSubmit={formik.handleSubmit} autoComplete="off" noValidate enctype="multipart/form-data">
          <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputLabel
                  sx = {{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "black",
                      marginBottom: "0.5rem",
                  }}
                  >
                      Nom
                  </InputLabel>
                  <CustomTextField
                  fullWidth
                  id = "firstName"
                   name="firstName" 
                   value = {formik.values.firstName}
                   onChange = {formik.handleChange}
                   error = {formik.touched.firstName && Boolean(formik.errors.firstName)}
                   helperText = {formik.touched.firstName && formik.errors.firstName}
                  variant="outlined"
                  placeholder="Nom du contact"
                  size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Prénom
                    </InputLabel>
                    <CustomTextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    value = {formik.values.lastName}
                    onChange = {formik.handleChange}
                    error = {formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText = {formik.touched.lastName && formik.errors.lastName}
                    variant="outlined"
                    placeholder="Prénom du contact"
                    size="small"
                    />
                </Grid>
                    <Grid item xs={12} sm={12}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Téléphone
                    </InputLabel>
                    <CustomTextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    value = {formik.values.phoneNumber}
                    onChange = {formik.handleChange}
                    error = {formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText = {formik.touched.phoneNumber && formik.errors.phoneNumber}
                    variant="outlined"
                    size="small"
                    placeholder="Téléphone du contact"
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
                    <Grid item xs={12} sm={12}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Groupe
                    </InputLabel>
                    <Select
                    fullWidth
                    id="group"
                    name="group"
                    value = {formik.values.group}
                    onChange = {formik.handleChange}
                    error = {formik.touched.group && Boolean(formik.errors.group)}
                    helperText = {formik.touched.group && formik.errors.group}
                    variant="outlined"
                    size="small"
                    placeholder="Groupe du contact"
                    sx = {{
                      backgroundColor: "#f2f2f2",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      padding: "0.15rem 0.4rem",
                      '.MuiOutlinedInput-notchedOutline': {
                          borderColor: '#f2f2f2',
                      },
                  }}
                  MenuProps={{
                      // set a max height to the menu list
                      sx: {
                        maxHeight: '300px',
                      },
                    }}
                    >
                        <MenuItem value="" disabled sx={{ fontSize: '0.68rem', fontWeight: '600' }}>Groupe du contact</MenuItem>
                        {data?.groups?.map((group) => (
                          <MenuItem key={group._id} value={group._id} sx={{ fontSize: '0.68rem', fontWeight: '600' }}>
                            {group.name}
                          </MenuItem>
                        ))}
                    </Select>
                    </Grid>
                <Grid item xs={12} sm={12}>
                    {popupError && (
                        <Alert 
                        severity="error"
                        sx={{
                            fontSize: "0.65rem",
                            fontWeight: "600",
                        }}
                        >{popupError}</Alert>
                    )}
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
          variant="outlined"
          // on click set open to false and reset the form
            onClick={() => {
                setOpen(false);
                formik.resetForm();
            }}
          sx={{
            backgroundColor: "#fff",
            color: "#f55d00",
            borderColor: "#f55d00",
            borderRadius: "7px",
            boxShadow: "none",
            fontSize: "0.65rem",
            fontWeight: "500",
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
          Annuler
        </Button>
        <Button
          variant="contained"
          disabled={isLoading}
          type='submit'
          sx={{
            backgroundColor: "#f55d00",
            color: "#fff",
            borderRadius: "7px",
            boxShadow: "none",
            fontSize: "0.65rem",
            fontWeight: "500",
            padding: "0.6rem 1.7rem",
            textTransform: "none",
            margin: "1rem 0rem",
            '&:hover': {
              backgroundColor: "#eb5900",
              boxShadow: "none",
            },
          }}
        >
          Ajouter
        </Button>
      </Box>
      </form>
    </DialogContent> 
    </Dialog>
  )
}

export default AddContactPopup
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
  Autocomplete,
  List,
} from '@mui/material';
import { 
    Visibility,
    VisibilityOff,
    EmailRounded,
    CallRounded,
    SearchRounded,
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
        padding: '0.65rem 0.75rem',
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
        '&.Mui-focused fieldset': {
          // borderColor: 'black',
          borderWidth: '1px',
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
      '&.Mui-focused': {
        '.MuiOutlinedInput-notchedOutline': {
          // borderColor: 'black',
          borderWidth: '1px',
        },
      },
    }}
    />
    );
  };

  const ListboxComponent = React.forwardRef((props, ref) => {
    return (
      <List {...props} ref={ref} sx={{
        width: '100%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        maxHeight: '250px',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.3em',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'black',
          borderRadius: '100px',
        },
      }}>
        {props.children}
      </List>
    );
  });
  
  
  const AddContactPopup = ({ open, setOpen }) => {
    
    const { logout } = useLogout()
    const [showPassword, setShowPassword] = useState(false);
    const client = useSelector((state) => state.reducer.client)
    const [search , setSearch] = useState("");
    
    const token = useSelector((state) => state.reducer.token)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sort , setSort] = useState();
    const { data,isLoading: isLoadingGroups, error: errorGroups,isFetching : isFetchingGroups } = useGetGroupsQuery({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sort: JSON.stringify(sort),
      clientID: client,
      search: search,
      token
    });



    const [addClient, { isLoading, error }] = useAddClientMutation();

    const [popupError, setPopupError] = useState('');
    
    const validationSchema = yup.object({
        firstName: yup.string().required('Champ obligatoire'),
        // lastName: yup.string().required('Champ obligatoire'),
        phoneNumber: yup.string().required('Champ obligatoire').matches(/^[0-9]{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            // lastName: '',
            phoneNumber: '',
            group : [] || '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const data = {
                firstName: values.firstName,
                // lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                client: client,
            }
            if (values.group) {
              data.group = values.group;
          }
          // if the length of the group is 0 return an error saying that the group is required and set the popup error
          if (values.group.length === 0) {
              setPopupError('Le groupe est obligatoire');
              return;
          }
          
            try {

                const response = await addClient({
                    client: data,
                    token
                });
                
                // if the response is an error set the popup error
                if (response.error) {
                  setPopupError(response.error.data.error);
                    return;
                }
                setOpen(false);
                formik.resetForm();
            } catch (error) {
                console.log(error);
                // set the popup error
                setPopupError(response.error.data.error);
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
        // width: '30%',
        maxWidth: '500px',
        width: '350px',
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
      <form onSubmit={formik.handleSubmit} autoComplete="off" noValidate encType="multipart/form-data">
          <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
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
                  // take of the auto complete
                  autoComplete="off"
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
                    autoComplete="off"
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
                        Groupes
                    </InputLabel>
                    <Autocomplete
                    multiple
                    id="group"
                    name="group"
                    value={formik.values.group || []}
                    // search from backend
                    onInputChange={(event, value) => {
                      setSearch(value);
                    }}
                    // add loading
                    loading={isFetchingGroups}
                    noOptionsText={
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',   
                        }}
                      >
                        Aucun groupe trouvé
                      </span>
                    }
                    loadingText={
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        Chargement...
                      </span>
                    }
                    onChange={(event, value) => formik.setFieldValue('group', value)}
                    options={data?.groups || []}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    filterSelectedOptions
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Groupes du contact"
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <SearchRounded sx = {{color: "#000" , fontSize: "1rem"}}/>
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    // do the loading effect
                    renderOption={(props, option) => {
                      return (
                          <MenuItem
                          {...props} key={option?._id} value={option?._id}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            }}
                          >
                            {option.name}
                          </MenuItem>
                      );
                    }}
                    //make it look like the above select
                    sx={{
                      backgroundColor: '#f2f2f2',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      // also make the input look like the above select
                      '& .MuiAutocomplete-inputRoot.MuiInputBase-root': {
                        padding: '0.5rem 0.4rem',
                        borderRadius: '8px',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f2f2f2',
                      },
                      '& .MuiAutocomplete-input': {
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      },
                      '& .MuiAutocomplete-tag': {
                        marginTop: '0.2rem',
                        marginBottom: '0.2rem',
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: '500',
                        height: '1.7rem',
                      },
                      // style the cancel icon
                      '& .MuiChip-root .MuiChip-deleteIcon': {
                        fontSize: '1.15rem',
                      },
                      '& .MuiAutocomplete-inputRoot.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                        borderWidth: '1px',
                    },
                  //   '& .MuiAutocomplete-endAdornment': {
                  //     display: 'none',
                  // },
                    }}
                    ListboxProps={{
                      style: {
                        maxHeight: '150px',
                      },
                    }}
                    ListboxComponent = {ListboxComponent}
                  />
                    </Grid>
                <Grid item xs={12} sm={12}>
                    {popupError && (
                        <Alert 
                        severity="error"
                        // choose the small 
                        sx={{
                            fontSize: "0.68rem",
                            fontWeight: "600",
                            // make the icon and the text align vertically
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "8px",
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
            color: "black",
            borderColor: "black",
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
              borderColor: "#2b2b2b",
              color: "#2b2b2b",
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
              backgroundColor: "#2b2b2b",
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
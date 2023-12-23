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
  Skeleton,
  Autocomplete,
  List,
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
import { useGetClientQuery  , useUpdateClientMutation} from '../slices/ClientSlice';
import { useGetGroupsQuery } from '../slices/GroupSlice';

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
  
  
  const EditContactPopup = ({ open, setOpen,contactId}) => {
    
    const { logout } = useLogout()
    const client = useSelector((state) => state.reducer.client)
    

    
    const token = useSelector((state) => state.reducer.token)
    const [search, setSearch] = useState("");
    
    const { data, isLoading , error , isFetching } = useGetClientQuery({
        token,
        id: contactId
    })


   
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sort , setSort] = useState();
    const { data : groupsData, isLoading : groupsIsLoading , error : groupsError } = useGetGroupsQuery({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sort: JSON.stringify(sort),
      clientID: client,
      search: search,
      token
    });


    const [updateClient, { isLoading : updateClientIsLoading , error : updateClientError }] = useUpdateClientMutation();


    const [popupError, setPopupError] = useState('');
    
    const [firstName, setFirstName] = useState('')
    // const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [group, setGroup] = useState([]);

    useEffect(() => {
        if (open && data) {
            setFirstName(data?.firstName)
            // setLastName(data?.lastName)
            setPhoneNumber(data?.phoneNumber)
            setGroup(data?.group || []);
        }
    }, [data , open])

    const handleSubmit = async (e) => {
      try {
        e.preventDefault();
        const payload = {
            firstName,
            // lastName,
            phoneNumber,
            group,
        };
        console.log('payload',payload);
      const response = await updateClient({
        id : contactId,
        token,
        client : payload
      });
      if (response.error) {
        console.log(response);
        setPopupError(response.error.data.error);
        return;
      }
      setOpen(false);
    } catch (error) {
      setPopupError(err.message);
    }
  };



  //take off the error message when the popup gets closed
  React.useEffect(() => {
      if (!open) {
          setPopupError('');
          setFirstName('');
          // setLastName('');
          setPhoneNumber('');
          setGroup([]);
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
      setFirstName('');
      // setLastName('');
      setPhoneNumber('');
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
        Modifier un contact
      </Typography>
    </DialogTitle>
    <DialogContent dividers> 
    { isFetching || isLoading || groupsIsLoading ? (
      <Box sx={{ width: '100%' }}>
        <Skeleton animation="wave" sx = {{ marginBottom: 1.2 , height: "2rem" }} />
        <Skeleton animation="wave" sx = {{ marginBottom: 1.2, height: "2rem" }} />
        <Skeleton animation="wave" sx = {{ marginBottom: 1.2 , height: "2rem"}} />
        <Skeleton animation="wave" sx = {{ marginBottom: 1.2, height: "2rem" }} />
      </Box>
    ) : (
      <form onSubmit={(e) => handleSubmit(e)} autoComplete="off" noValidate enctype="multipart/form-data">
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
                  value = {firstName}
                  onChange = {(e) => setFirstName(e.target.value)}
                  variant="outlined"
                  placeholder="Nom du contact"
                  size="small"
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
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
                    value = {lastName}
                    onChange = {(e) => setLastName(e.target.value)}
                    variant="outlined"
                    placeholder="Prénom du contact"
                    size="small"
                    />
                </Grid> */}
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
                    value = {phoneNumber}
                    onChange = {(e) => setPhoneNumber(e.target.value)}
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
                    <Autocomplete
                    multiple
                    id="group"
                    name="group"
                    value={group}
                    // search from backend
                    onInputChange={(event, value) => setSearch(value)}
                    // add loading
                    loading={isFetching || groupsIsLoading}
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
                    onChange={(event, value) => setGroup(value)}
                    options={groupsData?.groups || []}
                    getOptionLabel={
                      (option) => 
                      option.name  || 'No Name'
                    }
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    filterSelectedOptions
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Groupe du contact"
                        size="small"
                        autoComplete="off"
                      />
                    )}
                    // do the loading effect
                    renderOption={(props, option) => {
                      return (
                          <MenuItem
                          {...props} key={option._id} value={option._id}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            }}
                          >
                            {option.name}
                          </MenuItem>
                      );
                    }}
                    //disable the option if it is already selected
                    getOptionDisabled={(option) =>
                      group.some((selectedOption) => selectedOption._id === option._id)
                    }
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
                    }}
                    ListboxProps={{
                      style: {
                        maxHeight: '150px',
                      },
                    }}
                    ListboxComponent = {props => {
                      return (
                        <List {...props} sx={{
                          width: '100%', maxWidth: 500, bgcolor: 'background.paper' , maxHeight: '250px', overflow: 'auto',
                          // style for the scrollbar
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
                      )
                    }}
                  />
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
                setFirstName('');
                // setLastName('');
                setPhoneNumber('');
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
          disabled={updateClientIsLoading || isFetching}
          type='submit'
          sx={{
            backgroundColor: "black",
            color: "white",
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
          Modifier
        </Button>
      </Box>
      </form>
    )}
    </DialogContent> 
    </Dialog>
  )
}

export default EditContactPopup
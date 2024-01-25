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
import { useUpdateGroupMutation , useGetGroupQuery } from '../slices/GroupSlice';

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
    }}
    />
    );
  };
  
  
  const EditGroupPopup = ({ open, setOpen , groupToEdit}) => {
    
    const { logout } = useLogout()
    const [showPassword, setShowPassword] = useState(false);
    const client = useSelector((state) => state.reducer.client)
    
    const token = useSelector((state) => state.reducer.token)
    

    const [popupError, setPopupError] = useState('');


  const [updateGroup, { isLoading: isUpdating, error: updateError }] = useUpdateGroupMutation();

    const [name, setName] = useState('');

    useEffect(() => {
        if (open) {
            setName(groupToEdit?.name)
        }
    }, [open])
    
    const handleSubmit = async (e) => {
        try {
          e.preventDefault();
          const payload = {
              name,
          };
          
        const response = await updateGroup({
          id : groupToEdit._id,
          token,
          group : payload
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
      }
  }, [open]);

  useEffect(() => {
    if (updateError && updateError.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [updateError]);

  return (
    <Dialog
    open={open}
    onClose={() => {
      setOpen(false);
      setPopupError('');
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
        Modifier un groupe
      </Typography>
    </DialogTitle>
    <DialogContent dividers> 
      <form onSubmit={(e) => handleSubmit(e)} autoComplete="off" noValidate encType="multipart/form-data">
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
                  id = "name"
                   name="name" 
                   value = {name || ''}
                    onChange = {(e) => setName(e.target.value)}
                  variant="outlined"
                  placeholder="Nom du Group"
                  size="small"
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
          disabled={isUpdating}
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
            Modifier
        </Button>
      </Box>
      </form>
    </DialogContent> 
    </Dialog>
  )
}

export default EditGroupPopup
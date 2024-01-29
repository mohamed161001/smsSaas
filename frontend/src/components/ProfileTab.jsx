import React from 'react'
import {
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Avatar,
    InputLabel,
    InputAdornment,
    IconButton,
    OutlinedInput,
    Snackbar,
    Alert,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    Skeleton,
} from '@mui/material';
import { 
    Visibility,
    VisibilityOff,
    EmailRounded,
    CallRounded,
    DownloadRounded,
    EditRounded,
    DeleteOutlineRounded,
 } from '@mui/icons-material';
 import { useState } from 'react';
import FlexBetween from './FlexBetween';
import { 
  useGetUserQuery,
  useDeleteUserImageMutation,
} from '../state/api';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useUpdateUserMutation } from '../state/api';
import { useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';

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


  const ProfileTab = () => {
    
    const { logout } = useLogout()
    const user = useSelector((state) => state.reducer.user)
    const token = useSelector((state) => state.reducer.token)

    const isUser = user?.role === "user" ? false : true
    // if the user is a dentist the phone number grid will be 3 else 4
    const phoneGridSm = isUser ? 5 : 8

        
    const { data, isLoading, error } = useGetUserQuery({ 
      id: user?._id || "",
      token
    })
    const [updateUser, { isSuccess, isError, isLoading: isUpdating, error: updateError }] = useUpdateUserMutation()
    const [deleteUserImage, { 
      isSuccess: imageSuccess, 
      isError: imageError, 
      isLoading: isDeleting,
      error: deleteError
    }] = useDeleteUserImageMutation()

  // snackbar setup /////////////
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  ////////////////////////////////



    // formik setup //////////
    const formik = useFormik({
        initialValues: {
            firstName: data?.user.firstName || "",
            lastName: data?.user.lastName || "",
            email: data?.user.email || "",
            phoneNumber: data?.user.phoneNumber || "",
        },
        validationSchema: yup.object({
            firstName: yup.string().required('Le nom est requis'),
            lastName: yup.string().required('Le prénom est requis'),
            email: yup.string().email('Email invalide').required('L\'email est requis'),
            phoneNumber: yup.string().required('Le numéro de téléphone est requis'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData()
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('email', values.email)
            formData.append('phoneNumber', values.phoneNumber)
            if (isImageChanged) {
              formData.append('Image', image)
            }
            try {
                const response = await updateUser({ 
                    id: user?._id,
                    user: formData,
                    token
                })
                handleClick()
                setIsImageChanged(false)
            }
            catch (error) {
                console.log(error)
            }
        },
        enableReinitialize: true,
    })
    ///////////////////////

    // badge setup ////////////
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openBadge = Boolean(anchorEl);
    const handleBadgeClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleBadgeClose = () => {
      setAnchorEl(null);
    };
  //////////////////

    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isImageChanged, setIsImageChanged] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
      setImagePreview(`${apiUrl}/${data?.user.image}`);
    }, [data])

    const handleImageChange = (e) => {
      setImage(e.target.files[0])
      setImagePreview(URL.createObjectURL(e.target.files[0]))
      setAnchorEl(null);
      setIsImageChanged(true)
    };

    const handleImageDelete = async () => {
      try {
        const response = await deleteUserImage({
          id: user?._id,
          token
        })
        console.log(response);
        setImage("")
        setImagePreview("")
        setAnchorEl(null);
        setIsImageChanged(true)
      } catch (error) {
        console.log(error);
      }
    }

  useEffect(() => {
    if (error && error.status === 401) {
      logout()
      console.log("unauthorized");
    }
    if (updateError && updateError.status === 401) {
      logout()
      console.log("unauthorized");
    }
    if (deleteError && deleteError.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [error, updateError, deleteError]);

  return (
    <Box >
        <Typography
        component="span"
        sx = {{fontSize:"0.95rem", fontWeight:"700"}}>
            Mes informations
        </Typography>
        {
            isSuccess && (
                <Snackbar 
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                // top right 
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx ={{
                    // put it a little bit down
                    marginTop:"2.5rem",

                }}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' , fontSize:"0.7rem" , fontWeight:"600", borderRadius:"0.5rem"}}>
                        Vos informations ont été modifiées avec succès
                    </Alert>
                </Snackbar>
            )
        }
        <Box sx = {{backgroundColor:"#fff", borderRadius:"1.2rem", mt:"1rem"}}>
        <form onSubmit={formik.handleSubmit} noValidate encType="multipart/form-data">
            { 
                !isLoading ? (
                  <Badge 
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent ={
                        <Box>
                        <IconButton 
                        onClick ={handleBadgeClick}
                        sx = {{
                          backgroundColor: "black",
                          color: "#fff",
                          boxShadow: "none",
                          margin: "1rem 0rem",
                          '&:hover': {
                            backgroundColor: "#2b2b2b",
                            boxShadow: "none",
                          },
                        }}
                        >
                          <EditRounded sx = {{fontSize:"0.85rem"}}/>
                        </IconButton>
                        <Menu
                          id="fade-menu"
                          anchorEl={anchorEl}
                          open={openBadge}
                          onClose={handleBadgeClose}
                          MenuListProps={{
                            'aria-labelledby': 'fade-button',
                          }}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                            overflow: 'visible',
                            // make a light filter 
                            filter: 'drop-shadow(0px 1px 4px rgba(1,1,1,0.18))',
                            mt: 1,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                left: 20,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                            },
                        }}
                        >
                          <label htmlFor="image-upload">
                            <MenuItem onClick={handleBadgeClose}>
                              <ListItemIcon>
                                <DownloadRounded fontSize="small" sx={{ fontSize: '1rem', color: 'black' }} />
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  // style={{ display: 'none' }}
                                  hidden
                                  onChange={handleImageChange}
                                />
                              </ListItemIcon>
                              <Typography  sx={{fontSize:'0.68rem',fontWeight:'600' , color : 'black'}}>Télécharger</Typography>
                            </MenuItem>
                          </label>
                          <MenuItem 
                            onClick={handleImageDelete}
                          >
                            <ListItemIcon>
                              <DeleteOutlineRounded fontSize="small" sx={{fontSize:'1.1rem',color:'#c63232' }}/>
                            </ListItemIcon>
                            <Typography sx={{fontSize:'0.7rem',fontWeight:'500',color:'#c63232'}}>Supprimer</Typography>
                          </MenuItem>
                        </Menu>
                        </Box>
                      }
                    >
                      <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                    <Avatar
                        sx={{ width: 60, height: 60 }}
                        src={imagePreview}
                    />
                  </Badge>
                ) : (
                  <Skeleton
                    variant="circular"
                    width={60}
                    height={60}
                    />
                )
            }
                <Box sx = {{mt:"1.5rem"}}>
                {
                        !isLoading ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
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
                                variant="outlined"
                                placeholder="Nom du membre"
                                size="small"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                                variant="outlined"
                                placeholder="Prénom du membre"
                                size="small"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                    <Grid item xs={12} sm={8}>
                    <InputLabel
                    sx = {{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        marginBottom: "0.5rem",
                    }}
                    >
                        Email
                    </InputLabel>
                    <CustomTextField
                    fullWidth
                    id="email"
                    name="email"
                    variant="outlined"
                    size="small"
                    placeholder="Email du membre"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    // add icon in the input
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <EmailRounded sx = {{color: "#000" , fontSize: "1rem"}}/>
                        </InputAdornment>
                        ),
                    }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={phoneGridSm}>
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
                    variant="outlined"
                    size="small"
                    placeholder="Téléphone du membre"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
                    <Grid item xs={12} sm={8}>
                    <Box
                   display="flex"
                    sx={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                    }}
                    >
                  <Button
                    variant="contained"
                    type='submit'
                    disabled={isUpdating}
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
                </Grid>
              </Grid>
            ) : (
          <>
            <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
            <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
            <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
            <Skeleton
              variant="rounded"
              width="70%"
              height={40}
              sx = {{
                marginBottom: "0.5rem",
              }}
              />
              </>
          )
  }
    </Box>
    </form>
    </Box>
  </Box>
  )
}

export default ProfileTab
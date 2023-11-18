import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DragNDrop from './DragNDrop';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;
    
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
          <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#000',
            }}
            >
          <CloseIcon sx = {{ fontSize: '1.2rem' }} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function ImportMenu({ open, setOpen }) {
    
    const { logout } = useLogout()
    const [ file, setFile ] = React.useState()
    const [ title, setTitle ] = React.useState()
    const { id } = useParams();
    
    const token = useSelector((state) => state.reducer.token)
    
    // const handleSubmit = async () => {
    //     try {
    //         if (!title) {
    //             throw Error("Le titre est obligatoire");
    //         }
    //         if (!file) {
    //             throw Error("L'image est obligatoire");
    //         }

    //         const formData = new FormData();
    //         formData.append('Image', file);
    //         formData.append('title', title);

    //         const response = updatePatient({
    //             id: id,
    //             patient: formData,
    //             token
    //         })
    //         setTitle('');
    //         setFile(null);
    //         setOpen(false);
    //     } catch (error) {
    //         console.log(error.message);   
    //     }
    // }

    // useEffect(() => {
    //     if (error && error.status === 401) {
    //       logout()
    //       console.log("unauthorized");
    //     }
    // }, [error]);
    
    return (
        <BootstrapDialog
            onClose={() => setOpen(false)}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx = {{
                '& .MuiDialog-paper': {
                    borderRadius: '12px',
                },
            }}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
            <Typography 
                    sx={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#000',
                    }}
                    >
                Importer la liste
            </Typography>
            </BootstrapDialogTitle>
            <DialogContent 
             // only the up divider is needed
                dividers = {'true'} 
            >

                {/* <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#000",
                        marginBottom: "0.9rem",
                    }}
                >
                    Titre
                </InputLabel>
                <TextField
                    required
                    type="text"
                    variant="outlined"
                    placeholder="Titre de l'image"
                    fullWidth
                    size='small'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx = {{
                        marginBottom: "0rem",
                        backgroundColor: '#f2f2f2',
                        borderRadius: '8px',
                        fontSize: '0.5rem',
                        fontWeight: '600',
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#F5F5F5',
                        },
                        },
                    }}
                    inputProps={{style: {
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#000",
                        padding: "0.85rem 0.5rem",
                    }}}
                /> */}
                
                <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        // color: "#6B7280",
                        color: "#000",
                        marginBottom: "0.9rem",
                    }}
                >
                   Liste des contacts
                </InputLabel>

                <DragNDrop setFile={setFile} />

            </DialogContent>
            <DialogActions>
                <Button 
                    autoFocus 
                    // onClick={() => handleSubmit()}
                    variant="contained"
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
                        margin: "0.5rem 0rem",
                        '&:hover': {
                          backgroundColor: "#eb5900",
                          boxShadow: "none",
                        },
                      }}
                >
                    Importer
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const ConfirmDelete = ({ open, onClose, onConfirm,isLoading }) => {
  return (
    <Dialog 
    open={open}
    onClose={onClose}
    sx = {{
        '& .MuiDialog-paper': {
            borderRadius: "10px",
        },
    }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <WarningAmberRoundedIcon 
            sx={{ 
            color: "#ff1b1b",
            fontSize: "3.5rem",
            backgroundColor: "transparent",
            borderRadius: "50%",
            padding: "0.6rem",
            }} />
        </Box>

            <DialogTitle textAlign="center">
              <Typography sx={{ fontWeight: "700", fontSize: "1.1rem", color: 'black' }}>
                Confirmation de suppression
              </Typography>
            </DialogTitle>


        <DialogContent>
            <Typography variant="body1" 
              sx={{ 
                fontWeight: "600" ,
                fontSize: "0.75rem",
                color : "#6b6b6b",
            }}
              >
                Êtes-vous sûr de vouloir supprimer cet élément ?
            </Typography>
        </DialogContent>

        <DialogActions style={{ justifyContent: 'center' }}>
            <Button 
                onClick={onClose} 
                variant='outlined'
                sx={{
                    backgroundColor: "#fff",
                    color: "black",
                    borderColor: "transparent",
                    borderRadius: "7px",
                    boxShadow: "none",
                    fontSize: "0.6rem",
                    fontWeight: "600",
                    padding: "0.6rem 1.5rem",
                    textTransform: "none",
                    '&:hover': {
                      backgroundColor: "#fff",
                      boxShadow: "none",
                      borderColor: "black",
                    },
                  }}
            >
                Annuler
            </Button>
            <Button 
                onClick={onConfirm} 
                variant='contained'
                color="error" 
                autoFocus
                disabled={isLoading}
                sx={{
                    backgroundColor: "black",
                    color: "#fff",
                    borderRadius: "7px",
                    boxShadow: "none",
                    fontSize: "0.6rem",
                    fontWeight: "600",
                    padding: "0.6rem 1.5rem",
                    textTransform: "none",
                    '&:hover': {
                      backgroundColor: "#2b2b2b",
                      boxShadow: "none",
                    },
                  }}
            >
                {isLoading ? "Suppression..." : "Oui, supprimer"}
            </Button>
        </DialogActions>

    </Dialog>
  );
};

export default ConfirmDelete;
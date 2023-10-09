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
    <Dialog open={open} onClose={onClose}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <WarningAmberRoundedIcon 
            sx={{ 
            color: "#d32f2f",
            fontSize: "3.5rem",
            backgroundColor: "#ffefef",
            borderRadius: "50%",
            padding: "0.6rem",
            }} />
        </Box>

        <DialogTitle textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: "700" , fontSize: "1.1rem" }}>
                Confirmation de suppression
            </Typography>
        </DialogTitle>

        <DialogContent>
            <Typography variant="body1" 
              sx={{ 
                fontWeight: "500" ,
                fontSize: "0.85rem",
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
                    color: "#d32f2f",
                    borderColor: "#d32f2f",
                    borderRadius: "7px",
                    boxShadow: "none",
                    fontSize: "0.6rem",
                    fontWeight: "500",
                    padding: "0.6rem 1.5rem",
                    textTransform: "none",
                    '&:hover': {
                      backgroundColor: "#fff",
                      boxShadow: "none",
                      borderColor: "#d32f2f",
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
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    borderRadius: "7px",
                    boxShadow: "none",
                    fontSize: "0.6rem",
                    fontWeight: "500",
                    padding: "0.6rem 1.5rem",
                    textTransform: "none",
                    '&:hover': {
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
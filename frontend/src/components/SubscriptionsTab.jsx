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
    Alert,
    Skeleton,
    Chip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FlexBetween from './FlexBetween';
import { 
    Visibility,
    VisibilityOff,
    EmailRounded,
    CallRounded,
    KeyRounded,
    AccountBalanceRounded,
    CheckCircleRounded,
    AccessTimeFilledRounded,
 } from '@mui/icons-material';
 import { useState, useEffect } from 'react';


const SubscriptionsTab = () => {


 const columns = [
    { 
    field: 'date',
    headerName: 'Date de paiement',
    width: 110 
    },
    { 
    field: 'date',
    headerName: 'Date de fin',
    width: 130 
    },
    { 
    field: 'amount',
    headerName: 'Montant',
    width: 130
    },
    { 
    field: 'paymentMethod',
    headerName: 'Méthode de paiement',
    width: 170,
    renderCell: (params) => (
        <FlexBetween
            gap = '0.5rem'
        >
            <AccountBalanceRounded sx={{fontSize:"0.9rem", color:"black"}}/>
            <Typography sx={{fontSize:"0.7rem", fontWeight:"600",}}>
                {params.value}
            </Typography>
        </FlexBetween>
    )
    },
    { 
    field: 'status',
    headerName: 'Statut',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
            // <CheckCircleRounded sx={{fontSize:"0.9rem", color:"#00A650"}}/>
            <>
            {params.value === "Payé" ? (
                <CheckCircleRounded sx={{fontSize:"0.9rem", color:"#00A650"}}/>
            ) : (
                <AccessTimeFilledRounded sx={{fontSize:"0.9rem", color:"#ffa518"}}/>
            )}
            </>
    )
    },
  ];

    const rows = [
    { id: 1, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'En cours' },
    { id: 2, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'Payé' },
    { id: 3, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'Payé' },
    { id: 4, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'Payé' },
    { id: 5, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'Payé' },
    { id: 6, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'Payé' },
    { id: 7, date: '16/09/2021', amount: '22 DT', paymentMethod: 'Transfert Bancaire', status: 'Payé' },
      ];

    // choose a fixed random date
    const expirationDate = '2024-02-02'; // Example expiration date
    
    // Calculate today's date
    const today = new Date();
    
    // Calculate the expiration date as a Date object
    const expiration = new Date(expirationDate);

    // Calculate the difference in milliseconds between today and expiration date
    const timeDiff = expiration.getTime() - today.getTime();
    
    // Calculate the difference in days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check if the subscription is expired or close to expiration
    const isExpired = daysDiff < 0;
    const isCloseToExpiration = daysDiff <= 2 && !isExpired;

  return (
    <Box>
        <Typography sx = {{fontSize:"0.95rem", fontWeight:"700",}}>
            Abonnements
        </Typography>
        <Typography sx = {{fontSize:"0.7rem", fontWeight:"500", mt:"0.3rem"}}>
             Choisissez votre abonnement
        </Typography>
        <Grid container spacing={2} sx={{mt:"0.5rem"}}>
            <Grid item xs={12} sm={5.5}>
                <Box 
                sx={{
                    // position:"relative",
                    borderRadius:"0.6rem",
                    // border:"1px solid black",
                    // make a light shadow
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    p:"1rem",
                    display:"flex",
                    flexDirection:"column",
                    // alignItems:"center",
                    // '&:hover': {
                    //     boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    //     cursor: "pointer",
                    //     border:"1px solid black",
                    // },
                    }}
                >
                    {/* <CheckCircleRounded 
                       sx={{
                        position: "absolute",
                        top: "0.2rem",
                        right: "0.2rem",
                        fontSize: "1.1rem", // Adjust the font size as needed
                        color: "#00A650",
                      }}
                    /> */}
                    <FlexBetween
                        gap = '1.7rem'
                    >
                    <Typography sx={{fontSize:"0.85rem", fontWeight:"700",}}>
                        Abonnement Actuel- Mensuel
                    </Typography>
                    <Chip
                        // if it's expired make it red and the label is "Expiré"
                        label={isExpired ? "Expiré" : "Actif"}
                        sx={{
                            backgroundColor: "#d3ffe8",
                            color: "#00A650",
                            fontSize: "0.55rem",
                            fontWeight: "700",
                            borderRadius: "2rem",
                            border: "1px solid #00A650",
                            height: "25px",
                            textTransform: "none",
                        }}
                    />
                    {/* <Typography 
                    sx={{
                        fontSize:"0.9rem",
                        fontWeight:"800",
                        color:"#FF6100",
                        mt:"0.3rem"
                    }}
                    >
                        22 DT <Typography sx={{fontSize:"0.65rem", fontWeight:"600", display:"inline",color:"#6B7280"}}>/ mois</Typography>

                    </Typography> */}
                    </FlexBetween>
                    <FlexBetween
                        gap = '2rem'
                    >
                    <Typography 
                    sx={{
                        fontSize:"0.98rem",
                        fontWeight:"800",
                        // color:"#FF6100",
                        color : 'black',
                        mt:"0.3rem"
                    }}
                    >
                        22 DT <Typography sx={{fontSize:"0.65rem", fontWeight:"600", display:"inline",color:"#6B7280"}}>/ mois</Typography>
                    </Typography>
                    <Typography 
                    sx={{
                        fontSize:"0.7rem",
                        fontWeight:"700",
                        mt:"0.3rem",
                        // when the date is 2 days before expiration or after expiration make it red
                        color: isCloseToExpiration || isExpired ? "#FF0000" : "#6B7280",
                        // take it to the left
                        textAlign:"left",
                    }}>
                        Expire le {expirationDate}
                    </Typography>
                    </FlexBetween>
                    <Button 
                    onClick={() => {
                        window.open("https://api.konnect.network/H-N0WupFV", "_blank")
                    }}
                      // open it when it's expired or close to expiration
                      disabled={!isCloseToExpiration && !isExpired}
                      sx={{
                        backgroundColor: "black",
                        color: "#fff",
                        borderRadius: "7px",
                        boxShadow: "none",
                        fontSize: "0.67rem",
                        fontWeight: "600",
                        width: "100%",
                        mt: "0.8rem",
                        padding: "0.6rem 1.7rem",
                        textTransform: "none",
                        '&:hover': {
                          backgroundColor: "#2b2b2b",
                          boxShadow: "none",
                        },
                        // when disabled
                        '&.Mui-disabled': {
                            backgroundColor: "#E0E0E0",
                            color: "#6B7280",
                            boxShadow: "none",
                            cursor: "not-allowed",
                          },
                      }}
                    >
                        payer
                    </Button>
                </Box>
            </Grid>
            {/* <Grid item xs={12} sm={5}>
                <Box sx={{
                    borderRadius:"0.6rem",
                    border:"1px solid #E0E0E0",
                    // make a light shadow
                    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    p:"1rem",
                    display:"flex",
                    flexDirection:"column",
                    // on hover
                    '&:hover': {
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        cursor: "pointer",
                        border:"1px solid black",
                    },
                    }}>
                    <FlexBetween
                        gap = '2rem'
                    >
                    <Typography sx={{fontSize:"0.8rem", fontWeight:"700",}}>
                        Abonnement Annuel
                    </Typography>
                    <Typography 
                    sx={{
                        fontSize:"0.8rem",
                        fontWeight:"700",
                        color:"#FF6100",
                        mt:"0.3rem"}}>
                        16 DT / mois
                    </Typography>
                    </FlexBetween>
                    <Typography
                    sx={{
                        fontSize:"0.7rem",
                        fontWeight:"600",
                        mt:"0.3rem",
                        // make it grey
                        color:"#6B7280",
                        // take it to the left
                        textAlign:"left",
                    }}>
                        Vous économisez 25% 
                    </Typography>
                    <Button 
                     onClick={() => {
                        window.open("https://api.konnect.network/LUm7B2DEn", "_blank")
                    }}
                      sx={{
                        backgroundColor: "black",
                        color: "#fff",
                        borderRadius: "7px",
                        boxShadow: "none",
                        fontSize: "0.67rem",
                        fontWeight: "600",
                        width: "100%",
                        mt: "1rem",
                        padding: "0.6rem 1.7rem",
                        textTransform: "none",
                        '&:hover': {
                          backgroundColor: "#2b2b2b",
                          boxShadow: "none",
                        },
                      }}
                    >
                        Choisir
                    </Button>
                </Box>
            </Grid> */}
            </Grid>

            <Typography sx = {{
                fontSize:"0.95rem",
                fontWeight:"700",
                mt:"1rem",
                }}>
                Historique des paiements
            </Typography>

            <Box
                mt="8px"
                // height="90vh"
                height="268px"
                backgroundColor="white"
                sx={{
                    "& .MuiDataGrid-root": {
                    // border : "1px solid rgb(241, 241, 241)",
                    border : "1px solid white",
                    borderRadius: "10px",
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={35}
                    columnHeaderHeight={35}
                    sx = {{
                        boxShadow: 0,
                        "& .MuiDataGrid-virtualScroller": {
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
                            "&::-webkit-scrollbar": {
                            width: "5px",
                            },
                            "&::-webkit-scrollbar-track": {
                            backgroundColor: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "3px",
                            },
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom : " 1px solid rgb(241, 241, 241)",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            fontSize: "0.7rem",
                            // color : "#6B7280",
                            color : "#111827",
                            backgroundColor: "#F9FAFB",
                            borderBottom : " 1px solid rgb(241, 241, 241)",
                            borderRadius: "10px",
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: '700',
                        },
                        "& .MuiDataGrid-cellContent": {
                            fontSize: "0.7rem",
                            color : "#111827",
                            fontWeight: "600",
                        },
                        "& .MuiTablePagination-displayedRows": {
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color : "#111827",
                        },  
                        // style no rows message
                        "& .MuiDataGrid-overlay": {
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color : "#111827",
                        },       
                        // pointer on row hover
                        "& .MuiDataGrid-row": {
                            cursor: "pointer",
                        },
                        "& .MuiTablePagination-select": {
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color : "#111827",
                          },
                          "& .MuiTablePagination-selectLabel": {
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color : "#111827",
                          },
                          // change the border color of the footer
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid white",
                            },
                        }}
                    />
            </Box>

    
  </Box>
  )
}

export default SubscriptionsTab
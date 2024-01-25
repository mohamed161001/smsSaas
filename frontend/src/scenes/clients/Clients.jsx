import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import FlexBetween from '../../components/FlexBetween'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Button,
  Select,
  Typography,
  MenuItem,
  Menu,
  Avatar,
  IconButton,
  InputBase,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material'
import {
  SearchRounded,
  DeleteOutline,
  EditRounded,
  RemoveRedEyeRounded,
  DownloadRounded,
  AddRounded,
 } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ConfirmDelete from '../../components/ConfirmDeletePopup';
import { useLogout } from '../../hooks/useLogout';
import AddContactPopup from '../../components/AddContactPoupup';
import EditContactPopup from '../../components/EditContactPopup'
import { useGetClientsQuery , useDeleteClientMutation } from '../../slices/ClientSlice'
import ImportListPopup from '../../components/ImportListPopup';


const Clients = () => {

  const { logout } = useLogout()

  const navigate = useNavigate()
  const clientId = useSelector((state) => state.reducer.client)
  const token = useSelector((state) => state.reducer.token)
  // console.log(dentistId)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sort , setSort] = useState();
  const [search , setSearch] = useState("");

  // handling the add contact popup
  const [open, setOpen] = useState(false);

  // handling the import menu popup
  const [openImport, setOpenImport] = useState(false);


  const [clientToDelete, setClientToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { data, error, isLoading , isFetching } = useGetClientsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort: JSON.stringify(sort),
    clientID: clientId,
    search: search,
    token
  });



  //handling the delete
  const [deleteClient, { isLoading: isDeleting, error: deleteError }] = useDeleteClientMutation();

  const handleDeleteClick = (id) => {
    setClientToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDialogClose = () => {
    setShowConfirmDelete(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteClient({
        id : clientToDelete,
        token
      });
      // console.log(res);
      // close when the loading is done
      {
        !isDeleting && handleConfirmDialogClose();
      }
    } catch (err) {
      handleConfirmDialogClose();
    }
  }

  // handling the edit contact popup
  const [openEdit, setOpenEdit] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  const handleEditClick = (contact) => {
    setContactToEdit(contact);
    setOpenEdit(true);
  };

  // handling the snackbar message
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message,setMessage] = useState('')
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };



  const columns = [
    { 
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 0.7,
      valueFormatter: (params) => {
        const date = new Date(params.value)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const fullDate = `${year}-${month}-${day}`
        return fullDate
      }
     },
    { 
      field: 'firstName',
      headerName: 'Nom Complet',
      flex: 1,
    },
    { 
      field: 'phoneNumber', 
      headerName: 'Téléphone', 
      flex: 0.8
    },
    {
      field: 'group',
      headerName: 'Groupes',
      flex: 0.7,
      renderCell: (params) => {
        // group is an array of objects with name and id
        const group = params.row.group
        // console.log(group)
        return (
          <Tooltip title={group.map((item) => item.name).join(", ")} arrow>
          <Box
          key={params.row._id}
          sx = {{
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          >
            {group.map((item, index) => {
              return (
                <Typography
                key={item._id}
                sx = {{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "#111827",
                }}
                >{item.name}{index !== group.length - 1 && ", "}</Typography>
              )
            })}
          </Box>
          </Tooltip>
        )
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 0.6,
      align: 'center',
      headerAlign : 'center',
      renderCell: (params) => {
        return (
          <>
              {/* <IconButton >
                <RemoveRedEyeRounded
                  sx = {{
                    // color: "#5271FF",
                    color: "#6B7280",
                    fontSize: "1.1rem",
                  }}
                />
              </IconButton> */}
              <IconButton
                onClick = {() => handleEditClick(params.row)}
              >
                <EditRounded
                  sx = {{
                    color: "#6B7280",
                    fontSize: "1.1rem",
                  }}
                />
              </IconButton>
              <IconButton
                onClick = {() => handleDeleteClick(params.row._id)}
              >
                <DeleteOutline
                  sx = {{
                    // color: "#ff4848",
                    color: "#6B7280",
                    fontSize: "1.1rem",
                  }}
                />
              </IconButton>
            </>
        )
      }
    },
  ];

  const localeText = {
    // Root
    rootGridLabel: 'root',
    noRowsLabel: 'Aucun contact',
    errorOverlayDefaultLabel: 'Une erreur est survenue.',
    // Rows selected footer text
    footerRowSelected: (count) =>
      count !== 1
        ? `${count.toLocaleString()} lignes sélectionnées`
        : `${count.toLocaleString()} ligne sélectionnée`,
    // Total rows footer text
    footerTotalRows: 'Total de lignes :',
    // footer pagination text
    footerPaginationRowsPerPage: 'Lignes par page:',
    footerPaginationOf: 'sur',
    // Total visible rows footer text
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Sélection par case à cocher',
    // Boolean cell text
    booleanCellTrueLabel: 'vrai',
    booleanCellFalseLabel: 'faux',
    MuiTablePagination: {
      selectlabel: 'Lignes par page:',
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}-${to} sur ${count !== -1 ? count : `plus que ${to}`}`,
      labelrowsperpage: 'Lignes par page:',
      previousarialabel: 'Page précédente',
      previoustooltip: 'Page précédente',
      nextarialabel: 'Page suivante',
      nexttooltip: 'Page suivante',
      lastarialabel: 'Dernière page',
      lasttooltip: 'Dernière page',
    },
  };

  

  useEffect(() => {
    if (error && error.status === 401) {
      logout()
    }
    if (deleteError && deleteError.status === 401) {
      logout()
    }
  }, [error, deleteError]);


  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
      <Header title="Contacts" subtitle="Liste des contacts"/>
                <Snackbar 
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                // top right 
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx ={{
                    // put it a little bit down
                    marginTop:"2.5rem",
                }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' , fontSize:"0.7rem" , fontWeight:"600", borderRadius:"0.5rem",backgroundColor:"rgb(193 255 193)"}}>
                        {message}
                    </Alert>
                </Snackbar>
      <ConfirmDelete
        open={showConfirmDelete}
        onClose={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <ImportListPopup open={openImport} setOpen={setOpenImport} setSnackbarOpen={setSnackbarOpen} setMessage={setMessage} />
      <AddContactPopup  open={open} setOpen={setOpen}/>
      <EditContactPopup open={openEdit} setOpen={setOpenEdit} contact={contactToEdit}/>
      <Button 
      onClick={() => setOpen(true)}
      variant="contained"
      size="medium"
      startIcon={<AddRounded/>}
      sx = {{
        // backgroundColor: "#f55d00",
        backgroundColor: "black",
        color: "white",
        borderRadius: "7px",
        textTransform: "none",
        fontSize: "0.65rem",
        fontWeight : "600",
        padding: "0.61rem 0.9rem",
        boxShadow: "none",  
        '&:hover': {
              backgroundColor: "#2b2b2b",
              boxShadow: "none",
            },
      }}
      >Ajouter un contact</Button>
      </FlexBetween>
      <Box
           sx = {{
            mt: "1rem",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "1rem",
          }}
      >
        <FlexBetween>
          <FlexBetween gap=".5rem">
            <FlexBetween 
                backgroundColor="#E5E5E5"
                borderRadius="8px"
                padding="0.1rem 1rem"
                >
                  <InputBase
                    placeholder="Rechercher un contact"
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{color:"#000", fontSize:"0.7rem", fontWeight:"600"}}
                  />
                  <IconButton>
                    <SearchRounded sx={{color:"#000", fontSize:"1rem",}}/>
                  </IconButton>
                </FlexBetween>
                </FlexBetween>
                <Button
                variant="contained"
                onClick={() => setOpenImport(true)}
                size="medium"
                startIcon={
                <DownloadRounded/>
              }
                sx = {{
                  backgroundColor: "white",
                  color: "#f55d00",
                  border : "1px solid #f55d00",
                  borderRadius: "0.5rem",
                  textTransform: "none",
                  fontSize: "0.65rem",
                  fontWeight: "600",
                  padding: "0.45rem 1.3rem",
                  boxShadow: "none",  
                  '&:hover': {
                    boxShadow: "none",
                    backgroundColor: "white",
                  },
                  // make the icon smaller
                  '& .MuiSvgIcon-root': {
                    fontSize: "0.95rem",
                  },
                }}
                >Importer</Button>
            </FlexBetween>
      <Box
      mt="8px"
      height="90vh"
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
        // set the rows
        rows={data && data.contacts || []}
        columns={columns}
        getRowId={(row) => row._id}
        loading={isFetching}
        rowCount={data && data.totalcontacts || 0}
        pagination
        paginationModel={paginationModel}
        paginationMode="server"
        sortingMode="server"
        pageSizeOptions={[10, 20, 50, 100]}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={(newSortModel) => setSort(...newSortModel)}
        columnHeaderHeight={47}
        // rowsPerPageOptions={[10]}
        localeText={localeText}
        disableColumnMenu
        disableRowSelectionOnClick 
        sx={{
          boxShadow: 0,
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
            "&::-webkit-scrollbar": {
              width: "6px",
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
            fontSize: "0.75rem",
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
            fontSize: "0.72rem",
            color : "#111827",
            fontWeight: "600",
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: "0.8rem",
            fontWeight: "600",
            color : "#111827",
          },
          // style the pagination select label
          "& .MuiTablePagination-selectLabel": {
            fontSize: "0.75rem",
            fontWeight: "600",
            color : "#111827",
          },
          // style the pagination MenuItem
          "& .MuiTablePagination-select": {
            fontSize: "0.75rem",
            fontWeight: "600",
            color : "#111827",
          },
          // style the mui menu item of the table pagination
          "& .MuiMenuItem-root": {
            fontSize: "0.75rem",
            fontWeight: "600",
            color : "#111827",
          },
          "& .MuiDataGrid-overlay": {
            fontSize: "0.75rem",
            fontWeight: "600",
            color : "#111827",
          }, 
          // style the loading spinner
          "& .MuiCircularProgress-root": {
            color: "black",
            // make the spinner smaller
            width: "1.7rem !important",
            height: "1.7rem !important",
          },
          // take off the focus color of the cells
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
         }}
        />
        </Box>
        </Box>
    </Box>
  )
}

export default Clients
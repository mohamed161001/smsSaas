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
} from '@mui/material'
import {
  SearchRounded,
  DeleteOutline,
  EditRounded,
  RemoveRedEyeRounded,
  DownloadRounded,
 } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ConfirmDelete from '../../components/ConfirmDeletePopup';
import { useLogout } from '../../hooks/useLogout';
import AddGroupPopup from '../../components/AddGroupPopup'
import { useGetGroupsQuery , useDeleteGroupMutation } from '../../slices/GroupSlice'
import ImportListPopup from '../../components/ImportListPopup';
import EditGroupPopup from '../../components/EditGroupPopup'


const Groups = () => {

  const { logout } = useLogout()

  const navigate = useNavigate()
  const clientId = useSelector((state) => state.reducer.client)
  const token = useSelector((state) => state.reducer.token)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sort , setSort] = useState();
  const [search , setSearch] = useState("");

  // handling the add contact popup
  const [open, setOpen] = useState(false);

  // handling the import menu popup
  const [openImport, setOpenImport] = useState(false);


  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { data, error, isLoading , isFetching } = useGetGroupsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort: JSON.stringify(sort),
    clientID: clientId,
    search: search,
    token
  });

 //handling the delete
 const [deleteGroup, { isLoading: isDeleting, error: deleteError }] = useDeleteGroupMutation();

 const handleDeleteClick = (id) => {
    setGroupToDelete(id);
   setShowConfirmDelete(true);
 };

 const handleConfirmDialogClose = () => {
   setShowConfirmDelete(false);
    setGroupToDelete(null);
 };

 const handleConfirmDelete = async () => {
   try {
     const res = await deleteGroup({
       id : groupToDelete,
       token
     });
     // console.log(res);
     // close when the loading is done
     {
       !isDeleting && handleConfirmDialogClose();
     }
   } catch (err) {
     console.log(err);
     handleConfirmDialogClose();
   }
 }

 // handling the edit Group Popup
 const [openEdit,setOpenEdit] = useState(false);
 const [groupToEdit, setGroupToEdit] = useState(null);

 const handleEditClick = (id) => {
    setGroupToEdit(id);
    setOpenEdit(true);
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
      field: 'name',
      headerName: 'Nom',
      flex: 1,
    },
    { 
      field: 'numberOfContacts',
      headerName: 'Nombre de contacts', 
      flex: 0.8
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.6,
      renderCell: (params) => {
        return (
          <>
              <IconButton >
                <RemoveRedEyeRounded
                  sx = {{
                    // color: "#5271FF",
                    color: "#6B7280",
                    fontSize: "1.1rem",
                  }}
                />
              </IconButton>
              <IconButton
                onClick = {() => handleEditClick(params.row._id)}
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
    noRowsLabel: 'Aucun group',
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

 

  

  // useEffect(() => {
  //   if (error && error.status === 401) {
  //     logout()
  //     console.log("unauthorized");
  //   }
  //   if (deleteError && deleteError.status === 401) {
  //     logout()
  //     console.log("unauthorized");
  //   }
  // }, [error, deleteError]);


  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
      <Header title="Groupes" subtitle="Liste des groupes"/>
      <ConfirmDelete
        open={showConfirmDelete}
        onClose={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <ImportListPopup open={openImport} setOpen={setOpenImport}/>
      <AddGroupPopup  open={open} setOpen={setOpen}/>
      <EditGroupPopup open={openEdit} setOpen={setOpenEdit} groupToEdit={groupToEdit}/>
      <Button 
      onClick={() => setOpen(true)}
      variant="contained"
      size="medium"
      startIcon={<AddCircleOutlineRoundedIcon/>}
      sx = {{
        backgroundColor: "#f55d00",
        color: "white",
        borderRadius: "30px",
        textTransform: "none",
        fontSize: "0.7rem",
        padding: "0.7rem 1.2rem",
        boxShadow: "none",  
        '&:hover': {
          boxShadow: "none",
          // make it the same color but a bit darker
          backgroundColor: "#eb5900",
        },
      }}
      >Ajouter un groupe</Button>
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
                    placeholder="Rechercher un groupe"
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{color:"#000", fontSize:"0.7rem", fontWeight:"600"}}
                  />
                  <IconButton>
                    <SearchRounded sx={{color:"#000", fontSize:"1rem",}}/>
                  </IconButton>
                </FlexBetween>
                </FlexBetween>
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
        rows={data && data.groups || []}
        columns={columns}
        getRowId={(row) => row._id}
        loading={isLoading || isFetching}
        rowCount={data && data.totalgroups || 0}
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
         }}
        />
        </Box>
        </Box>
    </Box>
  )
}

export default Groups
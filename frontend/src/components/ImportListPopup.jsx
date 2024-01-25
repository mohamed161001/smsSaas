import * as React from 'react';
import { useEffect , useState } from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Alert  from '@mui/material/Alert';
import List from '@mui/material/List';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar  from '@mui/material/Snackbar';
import * as XLSX from 'xlsx';
import { SearchRounded } from '@mui/icons-material';
import {useGetGroupsQuery} from '../slices/GroupSlice'
import { useSelector } from 'react-redux';
import DragNDrop from './DragNDrop';
import { useParams } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAddClientsMutation } from '../slices/ClientSlice';

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

export default function ImportMenu({ open, setOpen, setSnackbarOpen, setMessage }) {
    
    const [ file, setFile ] = React.useState()
    const [ title, setTitle ] = React.useState()

    const { id } = useParams();
    
    const token = useSelector((state) => state.reducer.token)
    const { logout } = useLogout()
    const client = useSelector((state) => state.reducer.client)
    const [search , setSearch] = useState("");
    const [groups, setGroups] = useState([] || null);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [uploadedContacts, setUploadedContacts] = useState([]);
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


      // import the contacts from the excel file they have name and phone number
      const importContacts = (file) => {
        const reader = new FileReader();
      
        reader.onload = (event) => {
          const bstr = event.target.result;
          const workBook = XLSX.read(bstr, { type: "binary" });
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
      
          const contacts = [];

          // make sure that A1 and B1 are the name and phone number
          const nameHeader = workSheet["A1"]?.v;
          const phoneHeader = workSheet["B1"]?.v;

          if (nameHeader !== "name" || phoneHeader !== "phone") {
            setPopupError('Le fichier doit contenir les colonnes "name" et "phone"');
            return;
          }
          // Assuming that "A1" contains the name and "A2" contains the phone number
          for (let i = 2; ; i++) {
            // Start from the second row
            const nameCell = workSheet[`A${i}`];
            const phoneCell = workSheet[`B${i}`];
      
            // Break the loop if either of the cells is undefined (no more data)
            if (!nameCell || !phoneCell) {
              break;
            }
      
            // Extract the name and phone number from the cells
            const firstName = nameCell.v;
            const phoneNumber = phoneCell.v;
      
            // Push the data into the contacts array
            contacts.push({ firstName, phoneNumber });
          }
      
          // Log the extracted data in the specified format
          setUploadedContacts(contacts);
        };
      
        // Start reading the file as a binary string
        reader.readAsBinaryString(file);
      };
      
      //use the importContacts function when a file is dropped
      useEffect(() => {
        if (file?.type === 'application/vnd.ms-excel' || file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file?.type === 'text/csv') {
          importContacts(file);
        } else {
          console.log('Invalid file type. Please choose a CSV or XLSX file.');
        }
      }, [file]);

      useEffect(() => {
        if (file) {
            setPopupError('');
        }
    }, [file]);

      
      // adding the contacts
      const [addClients, { isLoading: isAddingClients , error,isSuccess}] = useAddClientsMutation();
      const handleSubmit = async () => {
        const data = {
          client: client,
          group : groups,
          contacts : uploadedContacts
        }
        if (groups.length === 0) {
          setPopupError('Le groupe est obligatoire');
          return;
        }
        if (!(file?.type === 'application/vnd.ms-excel' || file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file?.type === 'text/csv')){
          setPopupError('Le type de fichier doit être CSV ou XLSX.');
          return;
        }
        try {
        const response = await addClients({
            clients: data,
            token
        });
        if (response.error) {
          setPopupError(response.error.data.error);
            return;
        }
        setMessage(response?.data?.message)
        setSnackbarOpen(true)
        setOpen(false)
        } catch (error) {
          console.log(error);
          setPopupError(response.error.data.error);
        }
      }

      console.log(uploadedContacts);

    // handling the error popup
    const [popupError, setPopupError] = useState('');

    useEffect(() => {
      if (!open) {
          setPopupError('');
          setFile(null);
          setGroups([]);
          setUploadedContacts([]);
      }
    }, [open]);

    useEffect(() => {
        if (errorGroups && errorGroups.status === 401) {
          logout()
          console.log("unauthorized");
        }
    }, [errorGroups]);


    useEffect(() => {
        if (open) {
            setFile(null);
            setGroups([]);
        }
    }, [open])

    
    return (
        <BootstrapDialog
            onClose={() => {
                setFile(null);
                setOpen(false);
                setGroups([]); 
            }}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx = {{
                '& .MuiDialog-paper': {
                    borderRadius: '12px',
                },
                // make the width fixed
                '& .MuiDialog-paperWidthSm': {
                    maxWidth: '500px',
                    width: '340px',
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
                dividers
            >
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
                <Typography
                variant="body1"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: '500',
                  color: '#000',
                  mb: '0.5rem',
                }}
              >
                Télécharger un fichier d'exemple avant d'importer <a href={`${import.meta.env.VITE_FRONTEND_URL}/src/assets/Contacts_Sample.xlsx`} download="Contacts_Sample.xlsx" target="_blank" rel="noopener noreferrer" style={{color: "#FF6100", textDecoration: "underline"}}> cliquez ici</a>
              </Typography>
                <DragNDrop setFile={setFile} />
                <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        // color: "#6B7280",
                        color: "#000",
                        marginBottom: "0.9rem",
                        marginTop: "0.9rem",
                    }}
                >
                    Groupe de contacts
                </InputLabel>
                <Autocomplete
                    multiple
                    id="group"
                    name="group"
                    value={groups}
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
                    
                    onChange={(event, value) => {
                      setGroups(value);
                      setSelectedGroups(value.map((group) => group._id));
                    }}
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
                    }}
                    ListboxProps={{
                      style: {
                        maxHeight: '150px',
                      },
                    }}
                    ListboxComponent = {ListboxComponent}
                  />
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
                            mt :'1rem',
                        }}
                        >{popupError}</Alert>
                    )}
            </DialogContent>
            <DialogActions>
                <Button 
                    autoFocus 
                    onClick={() => handleSubmit()}
                    disabled = {isAddingClients}
                    variant="contained"
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
                        margin: "0.5rem 0rem",
                        '&:hover': {
                            backgroundColor: "#2b2b2b",
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
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
import List from '@mui/material/List';
import InputAdornment from '@mui/material/InputAdornment';

import { SearchRounded } from '@mui/icons-material';
import {useGetGroupsQuery} from '../slices/GroupSlice'
import { useSelector } from 'react-redux';
import DragNDrop from './DragNDrop';
import { useParams } from 'react-router-dom';
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

export default function ImportMenu({ open, setOpen }) {
    
    const [ file, setFile ] = React.useState()
    const [ title, setTitle ] = React.useState()
    const { id } = useParams();
    
    const token = useSelector((state) => state.reducer.token)
    const { logout } = useLogout()
    const client = useSelector((state) => state.reducer.client)
    const [search , setSearch] = useState("");
    const [campaignGroup, setCampaignGroup] = useState([] || null);
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

    useEffect(() => {
        if (errorGroups && errorGroups.status === 401) {
          logout()
          console.log("unauthorized");
        }
    }, [errorGroups]);


    useEffect(() => {
        if (open) {
            setFile(null);
            setCampaignGroup([]);
        }
    }, [open])

    
    return (
        <BootstrapDialog
            onClose={() => {
                setFile(null);
                setOpen(false);
                setCampaignGroup([]); 
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
                    value={campaignGroup}
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
                        setCampaignGroup(value);
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
                  //   '& .MuiAutocomplete-endAdornment': {
                  //     display: 'none',
                  // },
                    }}
                    ListboxProps={{
                      style: {
                        maxHeight: '150px',
                      },
                    }}
                    ListboxComponent = {ListboxComponent}
                  />

            </DialogContent>
            <DialogActions>
                <Button 
                    autoFocus 
                    // onClick={() => handleSubmit()}
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
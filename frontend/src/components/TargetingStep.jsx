import React , { useState } from 'react'
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Grid,
    InputLabel,
    Avatar,
    Chip,
    IconButton,
    Select,
    MenuItem,
    Autocomplete,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    InputAdornment,
    FormControl,
    Input,
    InputBase,
    FormHelperText,

} from '@mui/material';
import {
    MoodRounded,
    AutoFixHighRounded ,
    SearchRounded,
    AddRounded,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Phone from '../assets/Phone.png'
import FlexBetween from '../components/FlexBetween';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import {useGetGroupsQuery} from '../slices/GroupSlice'

const CustomTextField = (props) => {
    return (
      <TextField
      {...props}
      inputProps={{
        style: {
          fontSize: '0.74rem',
          color: '#000',
          fontWeight: '600',
          padding: '0.65rem 0.65rem',
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

const TargetingStep = ({campaignName, setCampaignName, campaignGroup, setCampaignGroup}) => {

  const { logout } = useLogout()
    const client = useSelector((state) => state.reducer.client)
    const [search , setSearch] = useState("");
    
    const token = useSelector((state) => state.reducer.token)
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

    

  return (
    <Box>
          <Grid container spacing={2}>
            {/* Left side - Inputs */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <InputLabel
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "black",
                    }}
                  >
                    Nom
                  </InputLabel>
                  <CustomTextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Nom de la campagne"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    fullWidth
                    sx={{
                      mt: "0.4rem",
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={7}>
                    <InputLabel
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "black",
                        mb : "0.5rem"
                    }}
                    >
                        Groupe de contacts
                    </InputLabel>
                    <Autocomplete
                    id="group"
                    name="group"
                    value={campaignGroup}
                    onInputChange={(event, value) => {
                      setSearch(value);
                    }}
                    disablePortal
                    freeSolo
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
                    options={[...data?.groups || []]}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => 
                      option._id === value._id
                    }
                    // filterSelectedOptions
                    // disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Rechercher un groupe"
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
                            // disable the options if it has 0 contacts
                            disabled={option?.numberOfContacts === 0}

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
                        padding: '0.5rem 0.5rem',
                        borderRadius: '8px',
                        minHeight: '2.5rem',
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
                </Grid>

                        

                {/* Add more inputs as needed */}
              </Grid>
            </Grid>
          </Grid>
        </Box>   
  )
}

export default TargetingStep
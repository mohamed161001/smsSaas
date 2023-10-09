import React, { useEffect } from 'react'
import { 
    InputBase,
    MenuItem,
    List,
    TextField,
    Avatar,
    ListItemAvatar,
 } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useGetPatientsQuery } from '../state/api'
import { useSelector } from 'react-redux'
import {
    SearchRounded,
}from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';


const NavbarSearch = () => {
  
  const { logout } = useLogout()
  const navigate = useNavigate()

  const dentist = useSelector((state) => state.reducer.dentist)
  const token = useSelector((state) => state.reducer.token)

  const [search, setSearch] = React.useState('')

  // autocomplete
  const { data, isLoading, error } = useGetPatientsQuery({ 
    dentistID: dentist,
    search: search,
    token
  });

  //  console.log('data',data);

  useEffect(() => {
    if (error && error.status === 401) {
      logout()
      console.log("unauthorized");
    }
  }, [error]);

  return (
    <div>
            <Autocomplete
              id="combo-box-demo"
              disablePortal
              fullWidth
              onInputChange={(event, newInputValue) => {
                console.log('newInputValue',newInputValue);
                setSearch(newInputValue);
              }}
              getOptionLabel={
                (option) => option?.firstName + ' ' + option?.lastName
              }
              // customize the no options message
              noOptionsText={isLoading ? 'Chargement...' : 'Aucun patient trouvé'}
              options={data?.patients || []}
              renderOption={(props, data) => (
                <MenuItem 
                {...props} key={data?._id} value={data?._id}
                sx={{ fontSize: '0.75rem',fontWeight:'600' }}
                onClick={() => {
                  navigate(`/patients/view/${data?._id}`)
                }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx = {{
                        bgcolor: "#E5E7EB",
                        color: "#5271FF",
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        width: '1.85rem',
                        height: '1.85rem',
                      }}
                    >{data?.firstName?.charAt(0).toUpperCase()}{data?.lastName?.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  {data?.firstName} {data?.lastName}
                </MenuItem>
              )}
              sx={{ 
                width: 220,
                backgroundColor:"#E5E5E5",
                borderRadius:"8px",
                '& .MuiInputBase-root': {
                    color: '#000',
                    fontSize:"0.7rem",
                    fontWeight:"600",
                },
                '& .MuiAutocomplete-inputRoot': {
                    padding: '0.1rem 1rem',
                },
                '& .MuiAutocomplete-input': {
                    padding: '0.6rem 1rem',
                },
                '& .MuiAutocomplete-endAdornment': {
                    display: 'none',
                },
                '& .MuiAutocomplete-input:first-child': {
                    paddingLeft: '0.5rem',
                },
                '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
                    padding: '0.1rem 1rem',
                    '& .MuiAutocomplete-input:first-child': {
                        paddingLeft: '0.5rem',
                    },
                },
                '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
                    paddingLeft: '0.5rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                },
                '& .MuiAutocomplete-popupIndicator': {
                    display: 'none',
                },
                '& .MuiAutocomplete-clearIndicator': {
                    display: 'none',
                },
             }}
              
              // style the scrollbar of the autocomplete options list
              ListboxComponent = {props => {
                return (
                  <List {...props} sx={{
                    width: '100%', maxWidth: 500, bgcolor: 'background.paper' , maxHeight: '250px', overflow: 'auto',
                    // style for the scrollbar
                    '&::-webkit-scrollbar': {
                      width: '0.3em',
                  },
                  '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,.1)',
                      borderRadius: '100px',
                  },
                    }}>
                    {props.children}
                  </List>
                )
              }}
              renderInput={(params) => 
              <TextField 
                {...params}
                placeholder="Recherhe..." 
                sx={{color:"#000",
                fontSize:"0.7rem",
                fontWeight:"600"
                }} 
                // add the search icon
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                        <SearchRounded sx={{color:"#000", fontSize:"1rem",}}/>
                        {params.InputProps.startAdornment}
                        </>
                    ),
                }}

            />}
            />
</div>
  )
}

export default NavbarSearch
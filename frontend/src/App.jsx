import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './scenes/login/Login';
import Register from './scenes/register/Register';
import Dashboard from './scenes/dashboard/dashboard';
import Layout from './scenes/layout/layout';
import Clients from './scenes/clients/Clients';
import Groups from './scenes/groups/Groups';
import Settings from './scenes/settings/Settings';
import ForgetPassword from './scenes/forget-password/ForgetPassword';
import Campaigns from './scenes/campaigns/Campaigns';
import { useSelector } from 'react-redux';

function App() {

  const isAuth = Boolean(useSelector((state) => state.reducer.token))

  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  });
  
  
  return (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Routes>
          <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/forget_pwd" element={!isAuth ? <ForgetPassword /> : <Navigate to="/dashboard" />} />
          <Route element={<Layout/>}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        </ThemeProvider>
      </BrowserRouter>
    
  );
}

export default App;

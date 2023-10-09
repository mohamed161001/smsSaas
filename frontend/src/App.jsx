import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './scenes/login/Login';
import Dashboard from './scenes/dashboard/dashboard';
import Layout from './scenes/layout/layout';
import Clients from './scenes/clients/Clients';
import Sms from './scenes/sms/Sms';
import Settings from './scenes/settings/Settings';
import ForgetPassword from './scenes/forget-password/ForgetPassword';
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
          <Route path="/forget_pwd" element={!isAuth ? <ForgetPassword /> : <Navigate to="/dashboard" />} />
          <Route element={<Layout/>}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/sms" element={<Sms />} />
          <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        </ThemeProvider>
      </BrowserRouter>
    
  );
}

export default App;

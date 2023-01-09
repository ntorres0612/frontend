// import Header from './components/Views/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// import alert from './assets/sounds/alert.mp3'

// import useSound from 'use-sound';
// import PrivateRoute from './components/Utils/PrivateRoute';
// import PublicRoute from './components/Utils/PublicRoute';

import { Fragment } from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { red } from '@mui/material/colors';


const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

const App = _ => {
  // const [play, {stop}] = useSound(alert);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {
          localStorage.getItem('token') === null
            ? <Login />
            : <Dashboard />
        }
      </Router>
    </ThemeProvider>
  );
}

export default App;

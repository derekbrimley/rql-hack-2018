import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

ReactDOM.render(
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>, document.getElementById('root'));

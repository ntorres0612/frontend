
import React, { useState, Fragment, useEffect } from 'react'

import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { CiEdit, CiTrash } from 'react-icons/ci';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import { listCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../api/customer.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc'
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function Customers() {

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customer, setCustomer] = useState({});
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [fullname, setFullname] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");

  const [errorFullname, setErrorFullname] = useState(false)
  const [errorTextFullname, setErrorTextFullname] = useState('')

  const [errorDocumentNumber, setErrorDocumentNumber] = useState(false)
  const [errorTextDocumentNumber, setErrorTextDocumentNumber] = useState('')

  const [errorDocumentnumber, setErrorDocumentnumber] = useState(false)
  const [errorTextDocumentnumber, setErrorTextDocumentnumber] = useState('')

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let data = { page: newPage, size: rowsPerPage }
    listCustomers(data).then(response => {
      setCustomers(response.customers);
      setTotalCustomers(response.totalItems);
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeFullname = event => {
    setFullname(event.target.value)
    validateFullname(event.target.value);
  }

  const onChangeDocumentNumber = event => {
    setDocumentNumber(event.target.value)
    validateDocumentNumber(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEditCustomer = customer => () => {
    setCustomerId(customer.id)
    setFullname(customer.fullname)
    setDocumentNumber(customer.documentNumber)
    handleClickOpen()
  };

  const validateFullname = (value) => {
    let text = value !== undefined ? value : fullname

    if (text == null || text.toString().trim() === '') {
      setErrorFullname(true)
      setErrorTextFullname('Este campo es requerido')
      return 1
    }
    else {
      setErrorFullname(false)
      setErrorTextFullname('')
      return 0
    }
  }

  const validateDocumentNumber = (value) => {
    let text = value !== undefined ? value : fullname

    if (text == null || text.toString().trim() === '') {
      setErrorDocumentNumber(true)
      setErrorTextDocumentNumber('Este campo es requerido')
      return 1
    }
    else {
      setErrorDocumentNumber(false)
      setErrorTextDocumentNumber('')
      return 0
    }
  }

  const onDeleteCustomer = customer => () => {
    setCustomer(customer)
    setOpenDelete(true);
  };
  const onConfirmDeleteCustomer = () => {
    deleteCustomer(customer.id).then(response => {
      handleCloseDelete()
      setCustomer({})
      toast.info('Delete successfull', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const newCustomers = customers.filter((currentCustomer) => customer.id !== currentCustomer.id)
      setCustomers(newCustomers)
    });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const onSaveCustomer = () => {
    let errors = validateFullname()
    errors += validateDocumentNumber()
    if (errors == 0) {
      if (customerId == null) {
        createCustomer({ fullname, documentNumber }).then(response => {
          if (response.id) {

            setCustomers(customers => [...customers, response]);
            handleClose()
            setFullname("")
            setDocumentNumber("")
            toast.info('Registrado exitosamente', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      } else {
        updateCustomer({
          id: customerId,
          fullname,
          documentNumber
        }).then(response => {
          if (response.id) {
            const newCustomers = customers.map(currentCustomer => {
              if (currentCustomer.id == response.id) {
                currentCustomer = response
              }
              return currentCustomer
            });
            setCustomers(newCustomers);

            handleClose()
            setCustomerId(null)
            setFullname("")
            setDocumentNumber("")
            toast.info('Actualizado exitosamente', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      }
    }
  }

  useEffect(() => {
    let data = { page: 0, size: rowsPerPage }
    listCustomers(data).then(response => {
      setCustomers(response.customers);
      setTotalCustomers(response.totalItems);
    });
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid xs={8}>
          <Button variant="contained" onClick={handleClickOpen}>
            Add Customer
          </Button>
        </Grid>
        <Grid xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Número de documento</TableCell>
                  <TableCell colSpan={4}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  customers.map(customer => {
                    return (
                      <TableRow key={customer._id}>
                        <TableCell>{customer.fullname} </TableCell>
                        <TableCell>{customer.documentNumber} </TableCell>

                        <TableCell style={{ width: 24 }} align="right" className='icon'>
                          <CiEdit size={24} onClick={onEditCustomer(customer)} />
                        </TableCell>
                        <TableCell style={{ width: 24 }} align="right" className='icon'>
                          <CiTrash size={24} onClick={onDeleteCustomer(customer)} />
                        </TableCell>

                      </TableRow>)
                  }
                  )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={totalCustomers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>


        <Dialog
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <DialogTitle>Add customer</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nombre"
              type="text"
              fullWidth
              variant="standard"
              value={fullname}
              onChange={onChangeFullname}
              error={errorFullname}
              helperText={errorTextFullname}
              autoComplete={'off'}
            />

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Número de documento"
              type="text"
              fullWidth
              variant="standard"
              value={documentNumber}
              onChange={onChangeDocumentNumber}
              error={errorDocumentnumber}
              helperText={errorTextDocumentnumber}
              autoComplete={'off'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onSaveCustomer}>{customerId ? "Update" : "Save"}</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDelete}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Delete customer</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`Are you sure delete: ${customer.name}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Disagree</Button>
            <Button onClick={onConfirmDeleteCustomer}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Grid>

    </React.Fragment>
  );
}

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
import { listTrucks, createTruck, updateTruck, deleteTruck } from '../../api/truck.api';
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

function createData(name, calories, fat) {
  return { name, calories, fat };
}



export default function Trucks() {

  const [open, setOpen] = React.useState(false);

  const [openDelete, setOpenDelete] = React.useState(false);



  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalTrucks, setTotalTrucks] = useState(0);
  const [truck, setTruck] = useState({});
  const [trucks, setTrucks] = useState([]);
  const [truckId, setTruckId] = useState(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [errorLicensePlate, setErrorLicensePlate] = useState(false)
  const [errorTextLicensePlate, setErrorTextLicensePlate] = useState('')


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let data = { page: (newPage * rowsPerPage), size: rowsPerPage }
    listTrucks(data).then(response => {
      setTrucks(response.trucks);
      setTotalTrucks(response.totalItems);
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeLicensePlate = event => {
    setLicensePlate(event.target.value)
    validateLicensePlate(event.target.value);
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEditTruck = truck => () => {
    setTruckId(truck.id)
    setLicensePlate(truck.licensePlate)
    handleClickOpen()
  };

  const validateLicensePlate = (value) => {
    let text = value !== undefined ? value : licensePlate

    if (text == null || text.toString().trim() === '') {
      setErrorLicensePlate(true)
      setErrorTextLicensePlate('Este campo es requerido')
      return 1
    }
    else {
      setErrorLicensePlate(false)
      setErrorTextLicensePlate('')
      return 0
    }
  }
  const onDeleteTruck = truck => () => {
    setTruck(truck)
    setOpenDelete(true);
  };
  const onConfirmDeleteTruck = () => {
    deleteTruck(truck.id).then(response => {
      handleCloseDelete()
      setTruck({})
      toast.info('Delete successfull', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const newTrucks = trucks.filter((currentTruck) => truck.id !== currentTruck.id)
      setTrucks(newTrucks)
    });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const onSaveTruck = () => {
    let errors = validateLicensePlate()
    if (errors == 0) {
      if (truckId == null) {
        createTruck({ licensePlate }).then(response => {
          if (response.id) {
            setTrucks(trucks => [...trucks, response]);

            handleClose()
            setLicensePlate("")
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
        updateTruck({ id: truckId, licensePlate }).then(response => {
          if (response.id) {
            const newTrucks = trucks.map(currentTruck => {
              if (currentTruck.id == response.id) {
                currentTruck = response
              }
              return currentTruck
            });
            setTrucks(newTrucks)
            handleClose()
            setLicensePlate("")
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
    listTrucks(data).then(response => {
      console.log(response)
      setTrucks(response.trucks);
      setTotalTrucks(response.totalItems);
    });
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid xs={8}>
          <Button variant="contained" onClick={handleClickOpen}>
            Add Truck
          </Button>
        </Grid>
        <Grid xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell colSpan={4}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  trucks.map(truck => {
                    return (
                      <TableRow key={truck._id}>
                        <TableCell>{truck.licensePlate} </TableCell>

                        <TableCell style={{ width: 24 }} align="right" className='icon'>
                          <CiEdit size={24} onClick={onEditTruck(truck)} />
                        </TableCell>
                        <TableCell style={{ width: 24 }} align="right" className='icon'>
                          <CiTrash size={24} onClick={onDeleteTruck(truck)} />
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
                    count={totalTrucks}
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
          <DialogTitle>Add truck</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="License plate"
              type="text"
              fullWidth
              variant="standard"
              value={licensePlate}
              onChange={onChangeLicensePlate}
              error={errorLicensePlate}
              helperText={errorTextLicensePlate}
              autoComplete={'off'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onSaveTruck}>{truckId ? "Update" : "Save"}</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDelete}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`Are you sure delete: ${truck.licensePlate}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Disagree</Button>
            <Button onClick={onConfirmDeleteTruck}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Grid>

    </React.Fragment>
  );
}
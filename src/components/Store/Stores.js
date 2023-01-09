
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
import { listStores, createStore, updateStore, deleteStore } from '../../api/store.api';
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




export default function Stores() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);



    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const [totalStores, setTotalStores] = useState(0);
    const [store, setStore] = useState({});
    const [stores, setStores] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [name, setName] = useState("");
    const [errorName, setErrorName] = useState(false)
    const [errorTextName, setErrorTextName] = useState('')


    const handleChangePage = (_, newPage) => {
        setPage(newPage);
        let data = { page: newPage, size: rowsPerPage }
        listStores(data).then(response => {
            setStores(response.stores);
            setTotalStores(response.totalItems);
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onChangeName = event => {
        setName(event.target.value)
        validateName(event.target.value);
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onEditStore = store => () => {
        setStoreId(store.id)
        setName(store.name)
        handleClickOpen()
    };

    const validateName = (value) => {
        let text = value !== undefined ? value : name

        if (text == null || text.toString().trim() === '') {
            setErrorName(true)
            setErrorTextName('Este campo es requerido')
            return 1
        }
        else {
            setErrorName(false)
            setErrorTextName('')
            return 0
        }
    }
    const onDeleteStore = store => () => {
        setStore(store)
        setOpenDelete(true);
    };
    const onConfirmDeleteStore = () => {
        deleteStore(store.id).then(response => {
            handleCloseDelete()
            setStore({})
            toast.info('Delete successfull', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            const newStores = stores.filter((currentStore) => store.id !== currentStore.id)
            setStores(newStores)
        });
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const onSaveStore = () => {
        let errors = validateName()
        if (errors == 0) {
            if (storeId == null) {
                createStore({ name }).then(response => {
                    if (response.id) {
                        setStores(stores => [...stores, response]);
                        handleClose()
                        setName("")
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
                updateStore({ id: storeId, name }).then(response => {
                    if (response.id) {
                        const newStores = stores.map(currentStore => {
                            if (currentStore.id == response.id) {
                                currentStore = response
                            }
                            return currentStore
                        });
                        setStores(newStores)
                        handleClose()
                        setName("")
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
        listStores(data).then(response => {
            console.log(response)
            setStores(response.stores);
            setTotalStores(response.totalItems);
        });
    }, []);

    return (
        <React.Fragment>
            <ToastContainer />
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <Button variant="contained" onClick={handleClickOpen}>
                        Add Store
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
                                    stores.map(store => {
                                        return (
                                            <TableRow key={store._id}>
                                                <TableCell>{store.name} </TableCell>

                                                <TableCell style={{ width: 24 }} align="right" className='icon'>
                                                    <CiEdit size={24} onClick={onEditStore(store)} />
                                                </TableCell>
                                                <TableCell style={{ width: 24 }} align="right" className='icon'>
                                                    <CiTrash size={24} onClick={onDeleteStore(store)} />
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
                                        count={totalStores}
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
                    <DialogTitle>Add store</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="License plate"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={onChangeName}
                            error={errorName}
                            helperText={errorTextName}
                            autoComplete={'off'}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={onSaveStore}>{storeId ? "Update" : "Save"}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openDelete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Delete store"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {`Are you sure delete: ${store.name}`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Disagree</Button>
                        <Button onClick={onConfirmDeleteStore}>Agree</Button>
                    </DialogActions>
                </Dialog>
            </Grid>

        </React.Fragment>
    );
}
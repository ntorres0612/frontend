
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { CiEdit, CiTrash } from 'react-icons/ci';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import { listDeliveries, deleteDelivery } from '../../api/delivery.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeliveryForm from './DeliveryForm';

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




export default function Delivery() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);



    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const [totalDeliveries, setTotalDeliveries] = useState(0);
    const [delivery, setDelivery] = useState({});
    const [deliveries, setDeliveries] = useState([]);
    const [deliveryId, setDeliveryId] = useState(null);


    const handleChangePage = (_, newPage) => {
        setPage(newPage);
        let data = { page: newPage, size: rowsPerPage }
        listDeliveries(data).then(response => {
            setDeliveries(response.deliveries);
            setTotalDeliveries(response.totalItems);
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onEditDelivery = delivery => () => {
        setDeliveryId(delivery.id)
        handleClickOpen()
    };


    const onDeleteDelivery = delivery => () => {
        setDelivery(delivery)
        setOpenDelete(true);
    };
    const onConfirmDeleteDelivery = () => {
        deleteDelivery(delivery.id).then(response => {
            handleCloseDelete()
            setDelivery({})
            toast.info('Delete successfull', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            const newDeliveries = deliveries.filter((currentDelivery) => delivery.id !== currentDelivery.id)
            setDeliveries(newDeliveries)
        });
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };


    useEffect(() => {
        let data = { page: 0, size: rowsPerPage }
        listDeliveries(data).then(response => {
            console.log(response)
            setDeliveries(response.deliveries);
            setTotalDeliveries(response.totalItems);
        });
    }, []);

    return (
        <React.Fragment>
            <ToastContainer />
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <Button variant="contained" onClick={handleClickOpen}>
                        Add Delivery
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
                                    deliveries.map(delivery => {
                                        return (
                                            <TableRow key={delivery.id}>
                                                <TableCell>{delivery.price} </TableCell>

                                                <TableCell style={{ width: 24 }} align="right" className='icon'>
                                                    <CiEdit size={24} onClick={onEditDelivery(delivery)} />
                                                </TableCell>
                                                <TableCell style={{ width: 24 }} align="right" className='icon'>
                                                    <CiTrash size={24} onClick={onDeleteDelivery(delivery)} />
                                                </TableCell>

                                            </TableRow>)
                                    }
                                    )}
                            </TableBody>

                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={totalDeliveries}
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
                    </TableContainer>
                </Grid>


                <Dialog
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <DialogTitle>Add </DialogTitle>
                    <DialogContent>
                        <DeliveryForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openDelete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Delete delivery"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {`Are you sure delete: ${delivery.price}`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Disagree</Button>
                        <Button onClick={onConfirmDeleteDelivery}>Agree</Button>
                    </DialogActions>
                </Dialog>
            </Grid>

        </React.Fragment>
    );
}
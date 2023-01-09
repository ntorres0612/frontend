import config from '../config';
import axios from 'axios';

const prefix = 'api/';


const listTrucks = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {

        axios.get(
            `${config.host}${prefix}truck/findAll?page=${data.page}&size=${data.size}`, headers
        ).then((response) => {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

const listByLicensePlate = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {

        axios.get(
            `${config.host}${prefix}truck/findByLicensePlate?licensePlate=${data.licensePlate}`, headers
        ).then((response) => {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
const createTruck = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(`${config.host}${prefix}truck/create`, data, headers).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
const updateTruck = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {
        axios.put(`${config.host}${prefix}truck/update`, data, headers).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
const deleteTruck = id => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {
        axios.delete(`${config.host}${prefix}truck/delete/${id}`, headers).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
export {
    listTrucks,
    listByLicensePlate,
    createTruck,
    updateTruck,
    deleteTruck
}
import config from '../config';
import axios from 'axios';

const prefix = 'api/store/';


const listStores = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {

        axios.get(
            `${config.host}${prefix}findAll?page=${data.page}&size=${data.size}`, headers
        ).then((response) => {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
const createStore = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(`${config.host}${prefix}create`, data, headers).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
const updateStore = data => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {
        axios.put(`${config.host}${prefix}update`, data, headers).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
const deleteStore = id => {
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        }
    }
    return new Promise((resolve, reject) => {
        axios.delete(`${config.host}${prefix}delete/${id}`, headers).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
export {
    listStores,
    createStore,
    updateStore,
    deleteStore
}
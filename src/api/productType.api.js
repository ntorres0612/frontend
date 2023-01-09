import config from '../config';
import axios from 'axios';

const prefix = 'api/product-type/';


const listProductTypes = data => {
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
const createProductType = data => {
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
const updateProductType = data => {
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
const deleteProductType = id => {
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
    listProductTypes,
    createProductType,
    updateProductType,
    deleteProductType
}
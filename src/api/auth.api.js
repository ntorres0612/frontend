import config from '../config';
import axios from 'axios';

const prefix = 'api/store/';

const authenticate = data => {

    return new Promise((resolve, reject) => {
        axios.post(`${config.host}${prefix}auth/login`, {
            email: data.email,
            password: data.password,
        }).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}
export { authenticate }
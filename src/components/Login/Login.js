import React, { useState, useRef, useEffect } from 'react';
import './login.css';
import { Fragment } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { FcUnlock } from 'react-icons/fc';
import { openNotification } from '../../config/utils';
import { authenticate } from '../../api/auth.api';



// toast.configure()

// TweenMax.set($("div.cardBack"));

const Login = (props) => {

    const [email, setEmail] = useState('nelsonperlaza@gmail.com');
    const [password, setPassword] = useState('admin');
    const [roles, setRoles] = useState([]);
    const [shake, setShake] = useState(false);



    const [token, setToken] = useState('');

    useEffect(() => {
        // props.history.push('/');
    }, []);


    const onLogin = async () => {

        authenticate({ email, password, }).then(response => {

            if (response.token) {
                localStorage.setItem("token", response.token);
                setToken(response.token);
                window.location.reload()
            } else {
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                }, 1000);
            }
        }).catch((_) => {
            setShake(true);
            setTimeout(() => {
                setShake(false);
            }, 1000);
            openNotification('Error al iniciar sesión', 'Verifique que los datos ingresados sean correctos');
        });
    }
    const onChangePassword = e => {
        setPassword(e.target.value)
    }
    const onChangeEmail = e => {
        setEmail(e.target.value)
    }
    return (
        <Fragment>
            <div className='circle-left'></div>
            <div className='circle-right-1'></div>
            <div className='circle-right-2'></div>


            <div className='login-wrapper'>
                <div className='login'>
                    <div className='header'>INICIAR SESION</div>
                    <div className='body'>
                        <input
                            className={shake ? `shake` : null}
                            id="email"
                            type='text'
                            value={email}
                            onChange={onChangeEmail}
                            autoComplete={'off'}
                        />
                        <input
                            className={shake ? `shake` : null}
                            id="password"
                            type='text'
                            value={password}
                            onChange={onChangePassword}
                            autoComplete={'off'}
                        />

                        <button onClick={() => onLogin()} >INGRESAR</button>
                    </div>
                    <div className='footer'>
                        <div className='text'>Olvidaste tu contraseña</div>
                        <div className='icon'><IoIosArrowForward /></div>
                    </div>
                </div>
            </div>
        </Fragment >
    );
};

export default Login;
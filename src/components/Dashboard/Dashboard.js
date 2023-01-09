import React, { Fragment, useEffect, useState } from 'react';
import { isLogin } from '../Utils/isLogin';


import user_test from '../../assets/images/user__test.png';

import { AiOutlineCalculator } from 'react-icons/ai';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';
import { BsHouse } from 'react-icons/bs';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsChatSquareDots } from 'react-icons/bs';
import jwt_decode from "jwt-decode";
import Menu from "../Menu/Menu.js";

import {
    Routes,
    Route,
    useLocation
} from "react-router-dom";
import Delivery from '../Delivery/Delivery';
import Customers from '../Customer/Customers';
import Trucks from '../Trucks/Trucks';
import Stores from '../Store/Stores';
import ProductTypes from '../ProductType/ProductTypes';



const Dashboard = props => {

    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');
    const [menus, setMenus] = useState([{
        title: "Home",
        icon: "CiHome",
        route: "/",
    }, {
        title: "Deliveries",
        icon: "CiPaperplane",
        route: "/deliveries",
    }, {
        title: "Customers",
        icon: "CiUser",
        route: "/customers"
    }, {
        title: "Trucks",
        icon: "CiDeliveryTruck",
        route: "/trucks"
    }, {
        title: "Stores",
        icon: "CiAlignBottom",
        route: "/stores"
    }, {
        title: "Products type",
        icon: "CiBoxes",
        route: "/products-type"
    },
    ]);

    useEffect(() => {
        if (isLogin) {
            // let token = jwt_decode(localStorage.getItem('token'));
            // let role = JSON.parse(localStorage.getItem('role'));
            // setFullname(`${token.first_name} ${token.first_last_nameº1}`);
            // setRole(role);


        } else {
            props.history.push('/');
        }
    }, [props.history]);


    const onLogout = _ => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // $('body').addClass('logout');
        // props.history.push('/');
        window.location.reload();
    }
    return (
        <div id="container">
            <div id="wrapper__header">

                <div id="header__breadcrumbs">
                    <div id='header__breadcrumbs__items'>
                        {/* {
                            props.breadcrumbs.map((breadcrumb, index) => {
                                return (
                                    breadcrumb.beforeHasArrow ?
                                        <Fragment key={index}>
                                            <div className="item arrow"></div>
                                            <div className="item title">{breadcrumb.title}</div>
                                        </Fragment>
                                        :
                                        <div className="item title" key={index}>{breadcrumb.title}</div>
                                )
                            })
                        } */}
                        <div className="item title">Servicios</div>

                    </div>
                </div>
                {/* <div id="header__info__date">
                    <div id="date_info">Viernes 12 mayo</div>
                    <div id="time_info">14:22 PM</div>
                </div> */}
                <div id="header__options">

                    <div id="header__option" onClick={onLogout}>
                        <BiLogOutCircle className="logout" />
                    </div>

                </div>
            </div>
            <div id="wrapper__content">
                <div id="content__left">
                    <div id="wrapper__user">
                        <div id="user__left">
                            <div id="user_photo">
                                <img src={user_test} alt={'User'} />
                            </div>
                        </div>
                        <div id="user__right">
                            <div id="user_name">{fullname}</div>
                            <div id="role_name">{role ? role.role : ''}</div>
                        </div>
                    </div>
                    <div id="sidebar">
                        <Menu menus={menus} />
                    </div>
                    <div id="copyright">Maxigiros copyright 2021</div>
                </div>
                <div id="content_right">
                    <div id="content">
                        <Routes>
                            <Route element={<Delivery />} path="/deliveries" />
                            <Route element={<Customers />} path="/customers" />
                            <Route element={<Trucks />} path="/trucks" />
                            <Route element={<Stores />} path="/stores" />
                            <Route element={<ProductTypes />} path="/products-type" />

                            <Route path={`/rendering`}>
                                Hola Rendering
                            </Route>
                        </Routes>
                    </div>


                    {/* <div id="footer">
                        <div className='frequent__options__left' onClick={onScrollLeft}>
                            <IoIosArrowBack />
                        </div>
                        <div className='frequent__options'>
                            {
                                frecuent_submenus.map((frecuent_submenu, index) => {
                                    return (
                                        <div className='frequent__option' key={index}>
                                            <div className='frequent__option__title'>{frecuent_submenu.title}</div>
                                            <div className='frequent__option__icon'>{frecuent_submenu.icon}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className='frequent__options__right' onClick={onScrollRight}>
                            <IoIosArrowForward />
                        </div>
                    </div> */}

                </div>
            </div>
        </div >
    );
}



export default Dashboard;

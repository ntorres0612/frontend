import Icon from '../Utils/Icon';
import './menu.css';

import { useNavigate } from 'react-router-dom';

const Menu = props => {
    const navigate = useNavigate();


    // const [menus, setMenus] = useState(props.menus);

    // useEffect(() => {
    //     // console.log('props.menus', props.menus)
    //     // console.log('props.menus', props.menus)
    //     // setMenus(props.menus);
    // }, []);

    const onSelectMenu = menu => _ => {

        navigate(menu.route)

        // if (menu.submenus) {
        // console.log('menu.submenus', menu)
        // props.onOpenMenu(true);
        // props.onSetSubmenus(menu.submenus);

        // props.onSetFirstBreadcrumb([{
        //     title: menu.title,
        //     beforeHasArrow: false
        // }]);

        // props.history.push(menu.route);
        // setTimeout(() => {
        //     // props.onOpenMenu(false);
        // }, 300);
        // }
        // } else if (menu.route !== null) {
        //     props.history.push(menu.route);
        // }
    }

    return (
        <div className="menu">
            <div className="menu__background"></div>
            {
                props.menus.map((menu, key) => {
                    return (
                        <div className="menu__item" key={key} onClick={onSelectMenu(menu)} >
                            <div className="menu__item__icon">
                                <Icon icon={menu.icon} />
                            </div>
                            <div className="menu__item__text">{menu.title}</div>
                        </div>
                    )
                })
            }
        </div>
    )
};


export default Menu;
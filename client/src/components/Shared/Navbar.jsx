import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useThemeContext } from '../../context/themeContext';
import { themes } from '../../constants/themes';
import Modal from './Model';
import { useShoppingCart } from '../../context/ShoppingCartContext';
// Import icons
import { FaShoppingCart, FaUser, FaSignInAlt, FaCog, FaPalette, FaSignOutAlt, FaChartBar } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartItemsCount, getCartTotal } = useShoppingCart();

    return (
        <div className="navbar bg-base-100 z-40">
            {/* Navbar start (unchanged) */}
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="logo" className='w-full h-full'/>
                </Link>
            </div>

            {/* Navbar center (unchanged) */}
            <div className="navbar-center min-w-96 hidden md:flex">
                <label className="input group focus-within:outline-none focus-within:ring-0 focus-within:border-primary bg-base-200 flex items-center gap-2 w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                    </svg>
                    <input type="text" className="grow " placeholder="Search" />
                </label>
            </div>

            {/* Navbar end */}
            <div className="navbar-end">
                {/* Cart (with icon) */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <FaShoppingCart className="h-5 w-5" />
                            <span className="badge badge-sm indicator-item">{getCartItemsCount()}</span>
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
                        <div className="card-body">
                        <span className="text-lg font-bold">{getCartItemsCount()} Items</span>
                        <span className="text-info">Subtotal: ${getCartTotal().toFixed(2)}</span>
                        <div className="card-actions">
                            <Link to="/cart" className="btn btn-primary btn-block">
                                <FaShoppingCart className="mr-2" />
                                View cart
                            </Link>
                        </div>
                        </div>
                    </div>
                </div>

                {/* User Icon or Login Button */}
                {
                    user ? 
                    <UserIcon user={user} logout={logout}/>
                    : 
                    <Link to="/login" className='btn btn-primary'>
                        <FaSignInAlt className="mr-2" />
                        Login
                    </Link>
                }
            </div>
        </div>
    )
}

const UserIcon = ({user, logout}) => {
    const themeContext = useThemeContext()
    const getThemes = () => {
        return (
            <div className='max-h-56 overflow-y-scroll'>
                {themes.map((theme, index) => (
                    <div 
                        onClick={()=>{themeContext.setTheme(theme)}} 
                        key={index} 
                        className={`${themeContext.theme == theme ? "bg-base-200" : ""} flex flex-row items-center justify-between py-2 px-4 cursor-pointer w-full hover:bg-base-200 rounded-lg`}
                    >
                        <span className='capitalize text-base-content font-normal text-sm'>
                            {theme}
                        </span>
                        <div className='bg-none w-2/5 flex flex-row justify-between'>
                            <div data-theme={theme} className="p-2 rounded-xl bg-base-100"></div>
                            <div data-theme={theme} className="p-2 rounded-xl bg-base-content"></div>
                            <div data-theme={theme} className="p-2 rounded-xl bg-primary"></div>
                            <div data-theme={theme} className="p-2 rounded-xl bg-secondary"></div>
                            <div data-theme={theme} className="p-2 rounded-xl bg-accent"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return(
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="User Avatar"
                    src="https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-2048x2048-ssmbv1ou.png" />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50">
                <li className='font-bold text-lg p-2'>{user.profile.fullName}</li>
                <div className='divider !p-0 !m-0'></div>
                <li>
                    <a className="flex items-center"><FaUser className="mr-2" /> Profile</a>
                </li>
                <li>
                    <Link to="/dashboard" className="flex items-center">
                        <FaChartBar className="mr-2" /> Dashboard
                    </Link>
                </li>
                <li>
                    <a className="flex items-center"><FaCog className="mr-2" /> Settings</a>
                </li>
                <li>
                    <div className="flex items-center">
                        <FaPalette className="mr-2" />
                        <Modal 
                            title="Themes" 
                            content={getThemes()}
                            className="w-full flex items-center" 
                        >
                            <FaPalette className="mr-2" /> Themes
                        </Modal>
                    </div>
                </li>
                <li><button onClick={logout} className="flex items-center"><FaSignOutAlt className="mr-2" /> Logout</button></li>
            </ul>
        </div>
    )
}

export default Navbar

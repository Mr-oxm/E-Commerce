import { useContext } from 'react';
import Footer from './components/Shared/Footer';
import Navbar from './components/Shared/Navbar';
import { useThemeContext } from './context/themeContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const Layout = ({children}) => {
    const { user, needsOnboarding } = useContext(AuthContext);
    const navigate = useNavigate();

    if(user && needsOnboarding){
        navigate('/profile');
    }

    return (
        <div className='flex flex-col h-screen min-h-screen selection:bg-primary selection:text-base-content' data-theme={useThemeContext().theme}>
            <Navbar className="sticky top-0 z-50" />
            <div className='flex-1 overflow-y-auto bg-base-200 h-[calc(100vh-66px-8px)]'>
                {children}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;

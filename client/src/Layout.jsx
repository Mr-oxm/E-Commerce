import { useContext } from 'react';
import Footer from './components/Shared/Footer';
import Navbar from './components/Shared/Navbar';
import { useThemeContext } from './context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const Layout = ({children}) => {
    const { user, needsOnboarding } = useContext(AuthContext);
    const navigate = useNavigate();

    if(user && needsOnboarding){
        navigate('/onboarding');
    }

    return (
        <div className='flex flex-col h-screen min-h-screen w-screen overflow-hidden selection:bg-primary selection:text-base-content' data-theme={useThemeContext().theme}>
            <Navbar className="sticky top-0 z-50" />
            <div className='flex-1 flex flex-col  justify-between overflow-y-auto bg-base-200 h-[calc(100vh-66px-8px)]'>
                {children}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import UserProfile from './components/Auth/UserProfile';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './AuthPage';
import Layout from './Layout';
import SellerDashboard from './components/Dashboards/SellerDashboard';
import LandingPage from './LandingPage';
import ProductDetails from './ProductDetails';
import { ThemeContextProvider } from './context/themeContext';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import ShoppingCartPage from './ShoppingCartPage';

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ShoppingCartProvider>
          <Router>
            <Routes>
              <Route path="/signup" element={<AuthPage children={<Signup />}/>} />
              <Route path="/login" element={<AuthPage children={<Login />}/>} />
              <Route path="/profile" element={<AuthPage children={<UserProfile />}/>} />
              <Route path="/" element={<Layout children={<LandingPage/>}/>} />
              <Route path="/product/:id" element={<Layout children={<ProductDetails/>}/>} />
              <Route
                path="/seller/*"
                element={
                  <Layout children={<SellerDashboard/>}/>
                }
              />
              <Route path="/cart" element={<Layout children={<ShoppingCartPage />} />} />
              {/* Add other routes */}
            </Routes>
          </Router>
        </ShoppingCartProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;

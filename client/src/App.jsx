import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import OnBoarding from './components/Auth/OnBoarding';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage/AuthPage';
import Layout from './Layout';
import SellerDashboard from './pages/SellerDashboard/SellerDashboard';
import LandingPage from './pages/LandingPage/LandingPage';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import { ThemeContextProvider } from './context/themeContext';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import ShoppingCartPage from './pages/Cart/ShoppingCartPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ThankYouPage from './pages/Order/ThankYouPage';
import OrderDetails from './components/Order/OrderDetails';
import OrderHistory from './pages/Order/OrderHistory';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ShoppingCartProvider>
          <Router>
            <Routes>
              <Route path="/signup" element={<AuthPage children={<Signup />}/>} />
              <Route path="/login" element={<AuthPage children={<Login />}/>} />
              <Route path="/onboarding" element={<AuthPage children={<OnBoarding />}/>} />
              <Route path="/profile/:id" element={<Layout children={<ProfilePage />} />} />
              <Route path="/" element={<Layout children={<LandingPage/>}/>} />
              <Route path="/product/:id" element={<Layout children={<ProductDetails/>}/>} />
              <Route
                path="/dashboard/*"
                element={
                  <Layout children={<SellerDashboard/>}/>
                }
              />
              <Route path="/cart" element={<Layout children={<ShoppingCartPage />} />} />
              <Route path="/search" element={<Layout children={<SearchPage />} />} />
              <Route path="/thank-you" element={<Layout children={<ThankYouPage />} />} />
              <Route path="/order/:id" element={<Layout children={<OrderDetails />} />} />
              <Route path="/order-history" element={<Layout children={<OrderHistory />} />} />
              <Route path="/settings" element={<Layout children={<SettingsPage />} />} />
            </Routes>
          </Router>
        </ShoppingCartProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;

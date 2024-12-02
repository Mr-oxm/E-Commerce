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
import { ThemeContextProvider } from './context/ThemeContext';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import ShoppingCartPage from './pages/Cart/ShoppingCartPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ThankYouPage from './pages/Order/ThankYouPage';
import OrderDetails from './components/Order/OrderDetails';
import OrderHistory from './pages/Order/OrderHistory';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ChangePasswordPage from './pages/ChangePassword/ChangePasswordPage';
import ProtectedRoute from './components/Shared/ProtectedRoute';

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
                  <ProtectedRoute children={<Layout children={<SellerDashboard/>}/>} />
                }
              />
              <Route path="/cart" element={<Layout children={<ShoppingCartPage />} />} />
              <Route path="/search" element={<Layout children={<SearchPage />} />} />
              <Route path="/thank-you" element={<ProtectedRoute children={<Layout children={<ThankYouPage />} />} />} />
              <Route path="/order/:id" element={<ProtectedRoute children={<Layout children={<OrderDetails />} />} />} />
              <Route path="/order-history" element={<ProtectedRoute children={<Layout children={<OrderHistory />} />} />} />
              <Route path="/settings" element={<ProtectedRoute children={<Layout children={<SettingsPage />} />} />} />
              <Route path="/change-password" element={<ProtectedRoute children={<Layout children={<ChangePasswordPage />} />} />} />
            </Routes>
          </Router>
        </ShoppingCartProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;

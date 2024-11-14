import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaPlus, FaShoppingCart, FaChartBar, FaBars } from 'react-icons/fa';
import ProductList from '../../components/SellerDashboard/ProductList';
import AddEditProduct from '../../components/SellerDashboard/AddEditProduct';
import OrderList from '../../components/SellerDashboard/OrderList';
import SalesSummary from '../../components/SellerDashboard/SalesSummary';
import routes from '../../constants/routes';
import Drawer from '../../components/Shared/Drawer';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(routes.product.sellerProducts);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    // try {
    //   const response = await axios.get(routes.order.viewSales);
    //   setOrders(response.data.data);
    // } catch (error) {
    //   console.error('Error fetching orders:', error);
    // }
  };

  const handleProductSaved = () => {
    fetchProducts();
    navigate('/dashboard');
  };


  return (
    <div className="flex h-max min-h-screen">
      <div className='min-h-full lg:py-4 lg:pl-4'>
        <Drawer sidebarContent={<SellerNav/>} label={<FaBars/>} labelStyles={"hidden"}/>
      </div>
      <div className="flex flex-col flex-1 overflow-auto">

        <div className="navbar bg-base-100 lg:hidden">
          <div className="flex-1">
            <div className='block lg:hidden z-10'>
              <Drawer sidebarContent={<SellerNav/>} label={<FaBars/>} labelStyles={""}/>
            </div>
            <a className="btn btn-ghost normal-case text-xl">Seller Dashboard</a>
          </div>
        </div>

        <div className="p-4 flex-1">
          <Routes>
            <Route index element={<ProductList products={products} onProductUpdate={fetchProducts}/>} />
            <Route path="add-product" element={<AddEditProduct onProductSaved={handleProductSaved} />} />
            <Route path="edit-product/:id" element={<AddEditProduct onProductSaved={handleProductSaved}/>} />
            <Route path="orders" element={<OrderList orders={orders} />} />
            <Route path="sales" element={<SalesSummary orders={orders} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const SellerNav = () => {
  return (
    <>
      <li>
        <Link to="/dashboard"><FaBox className="mr-2" /> Products</Link>
      </li>
      <li>
        <Link to="/dashboard/add-product"><FaPlus className="mr-2" /> Add Product</Link>
      </li>
      <li>
        <Link to="/dashboard/orders"><FaShoppingCart className="mr-2" /> Orders</Link>
      </li>
      <li>
        <Link to="/dashboard/sales"><FaChartBar className="mr-2" /> Sales</Link>
      </li>
    </>
  );
};

export default SellerDashboard;

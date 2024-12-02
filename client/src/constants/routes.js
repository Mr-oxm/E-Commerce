// routes.js
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const routes = {
  auth: {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    changePassword: `${API_BASE_URL}/auth/changepassword`,
    getUserData: `${API_BASE_URL}/auth/user`,
    getUserById: (userId) => `${API_BASE_URL}/auth/user/${userId}`,
    updateUserData: `${API_BASE_URL}/auth/updateuser`
  },
  order: {
    createOrder: `${API_BASE_URL}/orders`,
    getOrderById: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
    cancelOrder: (orderId) => `${API_BASE_URL}/orders/${orderId}/cancel`,
    getOrderHistory: `${API_BASE_URL}/orders/history`,
    updateOrderStatus: (orderId) => `${API_BASE_URL}/orders/${orderId}/status`,
    viewSales: `${API_BASE_URL}/orders/sales`,
    returnOrder: (orderId) => `${API_BASE_URL}/orders/${orderId}/return`,
  },
  product: {
    getAllProducts: `${API_BASE_URL}/products`,
    getProductById: (productId) => `${API_BASE_URL}/products/${productId}`,
    create: `${API_BASE_URL}/products/create`,
    edit: (productId) => `${API_BASE_URL}/products/edit/${productId}`,
    remove: (productId) => `${API_BASE_URL}/products/remove/${productId}`,
    sellerProducts: `${API_BASE_URL}/products/seller/products`,
    getSellerProductsById: (sellerId) => `${API_BASE_URL}/products/seller/products/${sellerId}`,
    search: `${API_BASE_URL}/products/search`,
    filter: `${API_BASE_URL}/products/filter`,
  },
  review: {
    create: `${API_BASE_URL}/reviews`,
    update: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}`,
    delete: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}`
  },
  upload: {
    uploadImage: `${API_BASE_URL}/uploadthing`,
  },
  payment: {
    createPayPalPayment: `${API_BASE_URL}/payment/create-paypal-payment`,
    executePayPalPayment: (paymentId, PayerID) => 
      `${API_BASE_URL}/payment/execute-paypal-payment?paymentId=${paymentId}&PayerID=${PayerID}`,
  },
};

export default routes;

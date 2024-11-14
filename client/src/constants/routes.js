// routes.js
const API_BASE_URL = 'http://localhost:4226/api'; // Base URL for your APIs

const routes = {
  auth: {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    forgotPassword: `${API_BASE_URL}/auth/forgotpassword`,
    resetPassword: (resetToken) => `${API_BASE_URL}/auth/resetpassword/${resetToken}`,
    verifyEmail: `${API_BASE_URL}/auth/verifyemail`,
    changePassword: `${API_BASE_URL}/auth/changepassword`,
    getUserData: `${API_BASE_URL}/auth/user`,
    updateUserData: `${API_BASE_URL}/auth/updateuser`
  },
  order: {
    createOrder: `${API_BASE_URL}/order`,
    getOrderById: (orderId) => `${API_BASE_URL}/order/${orderId}`,
    cancelOrder: (orderId) => `${API_BASE_URL}/order/${orderId}/cancel`,
    getOrderHistory: `${API_BASE_URL}/order/history`,
    updateOrderStatus: (orderId) => `${API_BASE_URL}/order/${orderId}/status`,
    getShippingDetails: (orderId) => `${API_BASE_URL}/order/${orderId}/shipping`,
    viewSales: `${API_BASE_URL}/order/sales`,
    viewOrdersForProduct: (productId) => `${API_BASE_URL}/order/product/${productId}`,
    shipOrder: (orderId) => `${API_BASE_URL}/order/${orderId}/ship`
  },
  product: {
    getAllProducts: `${API_BASE_URL}/products`,
    getProductById: (productId) => `${API_BASE_URL}/products/${productId}`,
    getFeaturedProducts: `${API_BASE_URL}/products/featured`,
    getRecommendedProducts: `${API_BASE_URL}/products/recommended`,
    calculatePrice: `${API_BASE_URL}/products/calculate-price`,
    create: `${API_BASE_URL}/products/create`,
    edit: (productId) => `${API_BASE_URL}/products/edit/${productId}`,
    remove: (productId) => `${API_BASE_URL}/products/remove/${productId}`,
    sellerProducts: `${API_BASE_URL}/products/seller/products`,
    manageInventory: `${API_BASE_URL}/products/inventory`
  },
  review: {
    create: `${API_BASE_URL}/review`,
    update: (reviewId) => `${API_BASE_URL}/review/${reviewId}`,
    delete: (reviewId) => `${API_BASE_URL}/review/${reviewId}`
  }
};

export default routes;

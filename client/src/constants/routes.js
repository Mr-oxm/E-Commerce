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
    getUserById: (userId) => `${API_BASE_URL}/auth/user/${userId}`,
    updateUserData: `${API_BASE_URL}/auth/updateuser`
  },
  order: {
    createOrder: `${API_BASE_URL}/orders`,
    getOrderById: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
    cancelOrder: (orderId) => `${API_BASE_URL}/orders/${orderId}/cancel`,
    getOrderHistory: `${API_BASE_URL}/orders/history`,
    updateOrderStatus: (orderId) => `${API_BASE_URL}/orders/${orderId}/status`,
    getShippingDetails: (orderId) => `${API_BASE_URL}/orders/${orderId}/shipping`,
    viewSales: `${API_BASE_URL}/orders/sales`,
    viewOrdersForProduct: (productId) => `${API_BASE_URL}/orders/product/${productId}`,
    shipOrder: (orderId) => `${API_BASE_URL}/orders/${orderId}/ship`,
    returnOrder: (orderId) => `${API_BASE_URL}/orders/${orderId}/return`,
    approveReturn: (orderId) => `${API_BASE_URL}/orders/${orderId}/approve-return`,
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
    getSellerProductsById: (sellerId) => `${API_BASE_URL}/products/seller/products/${sellerId}`,
    manageInventory: `${API_BASE_URL}/products/inventory`,
    search: `${API_BASE_URL}/products/search`,
    filter: `${API_BASE_URL}/products/filter`,
  },
  review: {
    create: `${API_BASE_URL}/reviews`,
    update: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}`,
    delete: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}`
  }
};

export default routes;

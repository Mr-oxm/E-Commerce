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
  buyer: {
    browseProducts: `${API_BASE_URL}/buyer/products`,
    viewProductDetails: (productId) => `${API_BASE_URL}/buyer/products/${productId}`,
    addToCart: `${API_BASE_URL}/buyer/cart/add`,
    removeFromCart: `${API_BASE_URL}/buyer/cart/remove`,
    checkout: `${API_BASE_URL}/buyer/checkout`,
    viewOrder: (orderId) => `${API_BASE_URL}/buyer/orders/${orderId}`,
    rateProduct: `${API_BASE_URL}/buyer/rate`,
    viewOrderHistory: `${API_BASE_URL}/buyer/orders`,
    cancelOrder: (orderId) => `${API_BASE_URL}/buyer/orders/${orderId}/cancel`
  },
  order: {
    createOrder: `${API_BASE_URL}/order`,
    getOrderById: (orderId) => `${API_BASE_URL}/order/${orderId}`,
    cancelOrder: (orderId) => `${API_BASE_URL}/order/${orderId}/cancel`,
    getOrderHistory: `${API_BASE_URL}/order`,
    updateOrderStatus: (orderId) => `${API_BASE_URL}/order/${orderId}/status`,
    getShippingDetails: (orderId) => `${API_BASE_URL}/order/${orderId}/shipping`
  },
  search: {
    searchProducts: `${API_BASE_URL}/search`,
    filterProducts: `${API_BASE_URL}/search/filter`
  },
  seller: {
    listNewProduct: `${API_BASE_URL}/seller/products`,
    editProductDetails: (productId) => `${API_BASE_URL}/seller/products/${productId}`,
    removeProduct: (productId) => `${API_BASE_URL}/seller/products/${productId}`,
    getproducts: `${API_BASE_URL}/seller/getproducts`,
    viewSales: `${API_BASE_URL}/seller/sales`,
    viewOrdersForProduct: (productId) => `${API_BASE_URL}/seller/orders/${productId}`,
    shipOrder: (orderId) => `${API_BASE_URL}/seller/orders/${orderId}/ship`,
    manageInventory: `${API_BASE_URL}/seller/inventory`
  },
  product: {
    getAllProducts: `${API_BASE_URL}/products`,
    getProductById: (productId) => `${API_BASE_URL}/products/${productId}`,
    getFeaturedProducts: `${API_BASE_URL}/products/featured`,
    getRecommendedProducts: `${API_BASE_URL}/products/recommended`,
    calculatePrice: `${API_BASE_URL}/products/calculate-price`
  }
};

export default routes;

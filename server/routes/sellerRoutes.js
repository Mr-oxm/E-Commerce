// routes/sellerRoutes.js
const express = require('express');
const { listNewProduct, editProductDetails, removeProduct, viewSales, viewOrdersForProduct, shipOrder, manageInventory, getSellerProducts } = require('../controllers/sellerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/products', listNewProduct);
router.put('/products/:id', editProductDetails);
router.delete('/products/:id', removeProduct);
router.get('/getproducts', getSellerProducts);
router.get('/sales', viewSales);
router.get('/orders/:productId', viewOrdersForProduct);
router.put('/orders/:orderId/ship', shipOrder);
router.put('/inventory', manageInventory);

module.exports = router;
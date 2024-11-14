const express = require('express');
const { protect } = require('../middleware/auth');
const {
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

router.use(protect);

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
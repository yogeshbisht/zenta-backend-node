const express = require('express');
const { userAuth } = require('../middlewares/auth');

const categoryController = require('../controllers/category');

const router = express.Router();

router.use(userAuth);

router.post('/', categoryController.createCategory);

router.patch('/:id', categoryController.updateCategory);

module.exports = router;

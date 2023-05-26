const express = require('express');
const { userAuth } = require('../middlewares/auth');
const transactionController = require('../controllers/transaction');

const router = express.Router();

router.use(userAuth);

router.post('/', transactionController.createTransaction);

module.exports = router;

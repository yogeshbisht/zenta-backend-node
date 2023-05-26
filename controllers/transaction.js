const Transaction = require('../models/Transaction');
const AppError = require('../utils/AppError');
const { wrapPromiseResponse } = require('../utils/helpers');

const createTransaction = wrapPromiseResponse(async (req) => {
  const transaction = await Transaction.create(req.body);

  if (!transaction) {
    throw new AppError('Failed to create the transaction entry', 500);
  }

  return {
    status: 'success',
    data: transaction,
  };
});

module.exports = {
  createTransaction,
};

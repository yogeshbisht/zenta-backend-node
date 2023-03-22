const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    scenario: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a transaction scenario'],
      ref: 'Scenario',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a transaction category'],
      ref: 'Category',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;

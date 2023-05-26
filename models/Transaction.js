const moment = require('moment');
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
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: 5,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide transaction start date'],
      default: () => moment().format(),
    },
    amount: {
      type: Number,
      required: [true, 'Please provide a transaction amount'],
      validate: {
        validator: (el) => el !== 0,
        message: 'Please enter a non-zero value for amount',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;

const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide debt entry name'],
      minlength: 3,
    },
    scenario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scenario',
      required: [true, 'Please provide scenario id'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
    },
    opening: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    date: { type: Date, required: [true, 'Please provide start date'] },
    end: Date,
    rate: { type: Number, required: [true, 'Please provide rate of interest'] },
    entry: {
      type: {
        type: String,
        required: [true, 'Please provide the currency symbol of account'],
      },
    },
    schedules: Array,
    interest: Number,
    numMonth: Number,
    balloon: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Debt = mongoose.model('Debt', DebtSchema);

module.exports = Debt;

const mongoose = require('mongoose');
const { DEFAULT_CURRENCY_UNIT } = require('../constants');

const ScenarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for scenario'],
      minlength: 3,
    },
    opening: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    currency: { type: String, default: DEFAULT_CURRENCY_UNIT },
    accountId: { type: String, default: '' },
    accountName: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Scenario = mongoose.model('Scenario', ScenarioSchema);

module.exports = Scenario;

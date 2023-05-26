const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      minlength: 3,
    },
    scenario: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide the scenario for this category'],
      ref: 'Scenario',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    order: { type: Number, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;

const CategoryService = require('../services/Category');
const { wrapPromiseResponse } = require('../utils/helpers');

// controller to create a new category for a specific scenario
const createCategory = wrapPromiseResponse(async (req) => {
  const data = await CategoryService.createCategory(req.body);

  return {
    status: 201,
    data,
  };
});

// controller to update category details
const updateCategory = wrapPromiseResponse(async (req) => {
  const data = await CategoryService.updateCategory(req.params.id, req.body);

  return {
    status: 200,
    data,
  };
});

module.exports = {
  createCategory,
  updateCategory,
};

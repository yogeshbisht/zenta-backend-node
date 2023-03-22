const Category = require('../models/Category');
const AppError = require('../utils/AppError');

const createCategory = async (categoryData) => {
  const { name, scenario } = categoryData;

  if (!name || !scenario) {
    throw new AppError('Please provide all credentials', 400);
  }

  const isCategoryExist = await Category.findOne({ name, scenario });

  if (isCategoryExist) {
    throw new AppError(
      'A category with same name already exists for this scenario',
      400
    );
  }

  const scenarioCategoryCount = await Category.countDocuments({ scenario });

  const category = await Category.create({
    ...categoryData,
    order: scenarioCategoryCount + 1,
  });

  if (!category) {
    throw new AppError('Failed to create new category', 500);
  }

  return {
    status: 'success',
    data: category,
  };
};

const updateCategory = async (categoryId, categoryData) => {
  if (!categoryId) {
    throw new AppError('Please provide category to be updated', 400);
  }

  const oldCategoryData = await Category.findById(categoryId);

  const { scenario } = oldCategoryData;

  if (categoryData.name) {
    const isCategoryExist = await Category.findOne({
      name: categoryData.name,
      scenario,
      _id: { $ne: categoryId },
    });

    if (isCategoryExist) {
      throw new AppError(
        'A category with same name already exists for this scenario',
        400
      );
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    categoryData,
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    throw new AppError('Failed to create new category', 500);
  }

  return {
    status: 'success',
    data: updatedCategory,
  };
};

module.exports = {
  createCategory,
  updateCategory,
};

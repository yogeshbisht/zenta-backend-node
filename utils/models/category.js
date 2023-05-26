const Category = require('../../models/Category');

const getOrderedCategories = async (scenarioId) =>
  await Category.find({ scenario: scenarioId }).sort({ order: 1 });

const refineCategoryOrder = async (scenarioId) => {
  const scenarioCategories = await getOrderedCategories(scenarioId);
  scenarioCategories.forEach(async (category, index) => {
    await Category.findByIdAndUpdate(category.id, {
      $set: { order: index + 1 },
    });
  });
};

module.exports = {
  refineCategoryOrder,
  getOrderedCategories,
};

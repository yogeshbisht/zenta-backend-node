/* eslint-disable no-await-in-loop */
const Category = require('../models/Category');
const Debt = require('../models/Debt');
const Scenario = require('../models/Scenario');
const AppError = require('../utils/AppError');
const { refineCategoryOrder } = require('../utils/models/category');

const getAllScenarios = async () => {
  const scenarios = await Scenario.find({});

  // TODO pagination
  return {
    status: 'success',
    data: scenarios,
  };
};

const getScenarios = async (userId) => {
  const scenarios = await Scenario.find({ user: userId });

  if (!scenarios) {
    throw new AppError('No scenarios found this user', 404);
  }

  return {
    status: 'success',
    data: scenarios,
  };
};

const getScenarioCategories = async (scenarioId) => {
  if (!scenarioId) {
    throw new AppError('Please provide the scenario id', 400);
  }

  const scenarioCategories = await Category.find({ scenario: scenarioId });

  return {
    status: 'success',
    data: scenarioCategories,
  };
};

const createScenario = async (userId, scenarioData) => {
  const { name } = scenarioData;

  const isScenarioExist = await Scenario.findOne({ user: userId, name });

  if (isScenarioExist) {
    throw new AppError('Scenario name already exists', 400);
  }

  const scenario = await Scenario.create({ ...scenarioData, user: userId });

  if (!scenario) {
    throw new AppError('Failed to create new Scenario', 500);
  }

  return {
    status: 'success',
    data: scenario,
  };
};

const updateActiveScenarios = async (userId, scenarioData) => {
  const { activeIds } = scenarioData;

  // TODO make remaining as non-active
  await Scenario.updateMany(
    { user: userId, _id: { $in: activeIds } },
    { $set: { active: true } },
    { new: true, runValidators: true }
  );

  await Debt.updateMany(
    { user: userId, _id: { $in: activeIds } },
    { $set: { active: true } },
    { new: true, runValidators: true }
  );

  return {
    status: 'success',
  };
};

const updateScenario = async (userId, scenarioId, scenarioData) => {
  const { name, currency } = scenarioData;

  const isScenarioExist = await Scenario.findOne({
    user: userId,
    _id: { $ne: scenarioId },
    name,
  });

  if (isScenarioExist) {
    throw new AppError('Scenario with that name already exists', 400);
  }

  const updatedScenario = await Scenario.findByIdAndUpdate(
    scenarioId,
    scenarioData,
    {
      new: true,
      runValidators: true,
    }
  );

  // Update currencies of any assets/liabilities that exists under this scenario
  await Debt.updateMany(
    { scenario: scenarioId },
    { $set: { currency } },
    { new: true, runValidators: true }
  );

  return {
    status: 'success',
    data: updatedScenario,
  };
};

const deleteScenario = async (scenarioId) => {
  const deletedScenario = await Scenario.findByIdAndDelete(scenarioId);

  if (!deletedScenario) {
    throw new AppError('Failed to delete that scenario', 500);
  }

  // Delete all assets/liabilities associated with this scenario
  await Debt.deleteMany({ scenario: scenarioId });

  // // Delete all Transactions associated with this scenario
  // await Transaction.deleteMany({ scenario: scenarioId });
};

const deleteScenarioCategory = async (scenarioId, categoryId) => {
  const hasSubCategories = await Category.findOne({ parent: categoryId });

  if (hasSubCategories) {
    throw new AppError(
      "This category has sub-categories and can't be deleted",
      400
    );
  }

  const categoryToDelete = await Category.findOneAndDelete({
    _id: categoryId,
    scenario: scenarioId,
  });

  if (!categoryToDelete) {
    throw new AppError(
      'Failed to delete that category. Make sure that it exists',
      500
    );
  }

  const scenarioCategories = await Category.find({
    scenario: scenarioId,
  }).sort({ order: 1 });
  await refineCategoryOrder(scenarioId, scenarioCategories);
};

// TODO search for some method way to handle this type of queries
const orderCategories = async (scenarioId, categoryList) => {
  const scenarioCategories = await Category.find({ scenario: scenarioId });

  if (scenarioCategories.length !== categoryList.length) {
    throw new AppError('Invalid category list data', 400);
  }

  for (let i = 0; i < categoryList.length; i += 1) {
    const category = categoryList[i];
    const { id, order } = category;
    await Category.findByIdAndUpdate(id, { $set: { order } });
  }

  return await Category.find({ scenario: scenarioId });
};

module.exports = {
  getAllScenarios,
  getScenarios,
  getScenarioCategories,
  createScenario,
  updateActiveScenarios,
  updateScenario,
  deleteScenario,
  deleteScenarioCategory,
  orderCategories,
};

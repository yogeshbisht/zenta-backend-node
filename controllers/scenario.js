const { wrapPromiseResponse } = require('../utils/helpers');

const ScenarioService = require('../services/Scenario');

// controller to create a new scenario
const getScenarios = wrapPromiseResponse(async (req) => {
  const data = await ScenarioService.getScenarios(req.user);

  return {
    status: 200,
    data,
  };
});

// controller to create a new scenario
const createScenario = wrapPromiseResponse(async (req) => {
  const data = await ScenarioService.createScenario(req.user.id, req.body);

  return {
    status: 201,
    data,
  };
});

// controller to change active scenarios and debts
const updateActiveScenarios = wrapPromiseResponse(async (req) => {
  const data = await ScenarioService.updateActiveScenarios(
    req.user.id,
    req.body
  );

  return {
    status: 200,
    data,
  };
});

// controller to update scenario details
const updateScenario = wrapPromiseResponse(async (req) => {
  const data = await ScenarioService.updateScenario(
    req.user.id,
    req.params.id,
    req.body
  );

  return {
    status: 200,
    data,
  };
});

// controller to delete a scenario
const deleteScenario = wrapPromiseResponse(async (req) => {
  await ScenarioService.deleteScenario(req.params.id);

  return {
    status: 204,
    data: {
      status: 'success',
      data: null,
    },
  };
});

// admin route - get all scenarios
const getAllScenarios = wrapPromiseResponse(async () => {
  const data = await ScenarioService.getAllScenarios();

  return {
    status: 200,
    data,
  };
});

module.exports = {
  getScenarios,
  createScenario,
  updateActiveScenarios,
  updateScenario,
  deleteScenario,
  getAllScenarios,
};
const express = require('express');
const scenarioController = require('../controllers/scenario');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

router.use(userAuth);

router
  .route('/')
  .get(scenarioController.getScenarios)
  .post(scenarioController.createScenario);

router.patch('/active', scenarioController.updateActiveScenarios);

router
  .route('/:id')
  .patch(scenarioController.updateScenario)
  .delete(scenarioController.deleteScenario);

router.get('/all', scenarioController.getAllScenarios);

module.exports = router;

const express = require('express');
const scenarioController = require('../controllers/scenario');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

router.use(userAuth);
router.get('/all', scenarioController.getAllScenarios);
router.get('/:id/categories', scenarioController.getScenarioCategories);

router.post('/:id/categories/order', scenarioController.orderCategories);

router.delete(
  '/:id/category/:categoryId',
  scenarioController.deleteScenarioCategory
);

router
  .route('/')
  .get(scenarioController.getScenarios)
  .post(scenarioController.createScenario);

router.patch('/active', scenarioController.updateActiveScenarios);

router
  .route('/:id')
  .patch(scenarioController.updateScenario)
  .delete(scenarioController.deleteScenario);

module.exports = router;

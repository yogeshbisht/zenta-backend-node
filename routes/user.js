const express = require('express');
const userController = require('../controllers/user');

const { userAuth, restrictTo } = require('../middlewares/auth');
const { getMe } = require('../middlewares/user');

const router = express.Router();

router.post('/check/email', userController.checkEmail);

router.use(userAuth);

router.get('/me', getMe, userController.getUserById);
router.patch('/updateMe', userController.updateMe);

router.use(restrictTo('admin'));
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

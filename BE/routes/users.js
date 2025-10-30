var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
const {verifyUser, verifyAdmin} = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/createAdmin', verifyUser, verifyAdmin, UserController.createAdmin);
router.post('/logout', verifyUser, UserController.logout);

router.get('/', verifyUser, verifyAdmin, UserController.getAll);
router.get('/:id', verifyUser, verifyAdmin, UserController.getOne);
router.put('/:id', verifyUser, verifyAdmin, UserController.update);
router.delete('/:id', verifyUser, verifyAdmin, UserController.delete);

module.exports = router;

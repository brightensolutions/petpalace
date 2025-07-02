// server/routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/check-phone', UserController.checkPhoneExists);

module.exports = router;

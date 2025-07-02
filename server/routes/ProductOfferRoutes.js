const express = require('express');
const router = express.Router();
const ctrl   = require('../controllers/ProductOfferController');

router.get('/', ctrl.getAll);

module.exports = router;

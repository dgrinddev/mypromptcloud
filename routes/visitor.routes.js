const express = require('express');
const visitorController = require('../controllers/visitor.controller');
const router = express.Router();

// Omdiriger roden ("/") til "/forside"
router.get('/', visitorController.redirectRootToForside);

// andre visitor-sider
router.get('/forside', visitorController.getForside);
router.get('/pris', visitorController.getPrisSide);
router.get('/funktioner', visitorController.getFunktionerSide);
router.get('/brugsbetingelser', visitorController.getBrugsbetingelserSide);
router.get('/privatlivspolitik', visitorController.getPrivatlivspolitikSide);
router.get('/om', visitorController.getOmSide);

module.exports = router;
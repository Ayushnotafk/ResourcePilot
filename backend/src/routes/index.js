const express = require('express');
const authRoutes = require('./auth.routes');
const assetRoutes = require('./asset.routes');
const assignmentRoutes = require('./assignment.routes');
const masterRoutes = require('./master.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/', masterRoutes);

module.exports = router;

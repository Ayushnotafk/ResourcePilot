const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { PERMISSIONS } = require('../constants/permissions');
const assignmentController = require('../controllers/assignment.controller');
const {
  createRequestValidator,
  approveRequestValidator,
  returnAssignmentValidator,
} = require('../validators/assignment.validator');

const router = express.Router();

router.use(authenticate);

router.get('/requests', requirePermission(PERMISSIONS.ASSIGNMENT_READ), assignmentController.listRequests);
router.post('/requests', requirePermission(PERMISSIONS.ASSIGNMENT_REQUEST), createRequestValidator, validate, assignmentController.createRequest);
router.post('/requests/:id/approve', requirePermission(PERMISSIONS.ASSIGNMENT_APPROVE), approveRequestValidator, validate, assignmentController.approveRequest);
router.post('/requests/:id/reject', requirePermission(PERMISSIONS.ASSIGNMENT_APPROVE), assignmentController.rejectRequest);
router.get('/', requirePermission(PERMISSIONS.ASSIGNMENT_READ), assignmentController.listAssignments);
router.get('/my', assignmentController.myAssignments);
router.post('/:id/return', requirePermission(PERMISSIONS.ASSIGNMENT_RETURN), returnAssignmentValidator, validate, assignmentController.returnAssignment);

module.exports = router;

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/response');
const assignmentService = require('../services/assignment.service');

exports.listRequests = asyncHandler(async (req, res) => {
  const result = await assignmentService.listRequests(req.query, req.user);
  sendSuccess(res, result.requests, result.meta);
});

exports.createRequest = asyncHandler(async (req, res) => {
  const request = await assignmentService.createRequest(req.body, req.user, req);
  sendCreated(res, request);
});

exports.approveRequest = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.approveRequest(
    req.params.id,
    req.user,
    req.body,
    req
  );
  sendSuccess(res, assignment, null, 'Request approved');
});

exports.rejectRequest = asyncHandler(async (req, res) => {
  const request = await assignmentService.rejectRequest(
    req.params.id,
    req.user,
    req.body.rejectionReason,
    req
  );
  sendSuccess(res, request, null, 'Request rejected');
});

exports.listAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.listAssignments(req.query);
  sendSuccess(res, assignments);
});

exports.myAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.listAssignments({ userId: req.user.id, ...req.query });
  sendSuccess(res, assignments);
});

exports.returnAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.returnAssignment(
    req.params.id,
    req.user,
    req.body,
    req
  );
  sendSuccess(res, assignment, null, 'Asset returned');
});

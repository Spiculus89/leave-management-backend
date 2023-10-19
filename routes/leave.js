const express = require("express");

// Import the authentication middleware
const auth = require("../middleware/auth.js");

// Import the leave request controller functions
const {
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  getLeaveRequests,
} = require("../controllers/leave.controller.js");

// Create a new router object
const router = express.Router();

// Create a new leave request
router.route("/leave-request").post(auth, createLeaveRequest);

// Update an existing leave request
router.route("/leave-request/:leaveRequestId").put(auth, updateLeaveRequest);

// Delete an existing leave request
router.route("/leave-request/:leaveRequestId").delete(auth, deleteLeaveRequest);

// Get all leave requests created by the user
router.route("/leave-requests").get(auth, getLeaveRequests);

// Export the router
module.exports = router;

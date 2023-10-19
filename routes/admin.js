const express = require("express");

// Import the authentication middleware
const auth = require("../middleware/auth.js");

// Import the leave request controller functions
const {
  getAllLeaveRequests,
  updateLeaveRequestStatus,
  createLeaveReport,
} = require("../controllers/leave.controller.js");

// Create a new router object
const router = express.Router();

// Change the leave status to Approved or Declined
router.route("/update/:leaveRequestId").put(auth, updateLeaveRequestStatus);

// Create a leave report
router.route("/create-report").post(auth, createLeaveReport);

// Get all leave requests
router.route("/getall").get(auth, getAllLeaveRequests);

module.exports = router;

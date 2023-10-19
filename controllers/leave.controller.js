const { isObjectIdOrHexString } = require("mongoose");
const LeaveRequest = require("../models/Leave");
const ObjectId = require("mongodb").ObjectId;
const _ = require("lodash");

exports.createLeaveRequest = async (req, res) => {
  try {
    // Validate the request payload
    if (!req.body.reason || !req.body.startDate || !req.body.endDate) {
      return res.status(400).send({
        message:
          "Leave request must include a reason, start date, and end date",
      });
    }

    // Create a new leave request
    const leaveRequest = new LeaveRequest({
      user: req.userId,
      reason: req.body.reason,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      leaveType: req.body.leaveType,
      workingDays: req.body.workingDays,
      status: "Pending",
      username: req.body.username,
    });

    // Save the leave request to the database
    const savedLeaveRequest = await leaveRequest.save();
    res.send(savedLeaveRequest);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateLeaveRequest = async (req, res) => {
  try {
    // Find the leave request to be updated
    const leaveRequest = await LeaveRequest.findById(req.params.leaveRequestId);

    // Ensure that the leave request exists
    if (!leaveRequest) {
      return res.status(404).send({
        message: "Leave request not found",
      });
    }

    // Update the leave request with the new information
    leaveRequest.user = req.body.user;
    leaveRequest.reason = req.body.reason;
    leaveRequest.startDate = req.body.startDate;
    leaveRequest.endDate = req.body.endDate;
    leaveRequest.leaveType = req.body.leaveType;
    leaveRequest.workingDays = req.body.workingDays;

    // Save the updated leave request to the database
    const savedLeaveRequest = await leaveRequest.save();
    res.send(savedLeaveRequest);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteLeaveRequest = async (req, res) => {
  try {
    // Find the leave request to be deleted
    const leaveRequest = await LeaveRequest.findById(req.params.leaveRequestId);

    // Ensure that the leave request exists
    if (!leaveRequest) {
      return res.status(404).send({
        message: "Leave request not found",
      });
    }

    // Ensure that the user has permission to delete the leave request
    if (leaveRequest.user.toString() !== req.userId) {
      return res.status(401).send({
        message: "Unauthorized to delete this leave request",
      });
    }

    // Delete the leave request from the database
    await leaveRequest.remove();
    res.send({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getLeaveRequests = async (req, res) => {
  const user = req.userId;
  try {
    // Find all leave requests created by the user
    const leaveRequests = await LeaveRequest.find({ user: ObjectId(user) });
    res.send(leaveRequests);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    // Find all leave requests of all users
    const leaveRequests = await LeaveRequest.find({});
    res.send(leaveRequests);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.leaveRequestId);
    // Check if the leave request exists
    if (!leaveRequest) {
      return res.status(404).send({
        message: "Leave request not found",
      });
    }
    leaveRequest.status = req.body.status;
    const savedLeaveRequest = await leaveRequest.save();
    res.send(savedLeaveRequest);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createLeaveReport = async (req, res) => {
  try {
    const { startDate, endDate, interval } = req.body;

    const leaveRequests = await LeaveRequest.find({
      status: "Approved",
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    });

    const groupedLeaveRequests = _.groupBy(leaveRequests, "username");

    const report = {};

    for (const username in groupedLeaveRequests) {
      report[username] = {};
      switch (interval) {
        case "day":
          report[username].leaves = _.sumBy(
            groupedLeaveRequests[username],
            "workingDays"
          );
          break;
        case "week":
          report[username].leaves = _.sumBy(
            groupedLeaveRequests[username],
            (leaveRequest) => {
              return leaveRequest.workingDays / 7;
            }
          );
          break;
        case "month":
          report[username].leaves = _.sumBy(
            groupedLeaveRequests[username],
            (leaveRequest) => {
              return leaveRequest.workingDays / 30;
            }
          );
          break;
        default:
          report[username].leaves = _.sumBy(
            groupedLeaveRequests[username],
            "workingDays"
          );
      }
    }

    res.send(report);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

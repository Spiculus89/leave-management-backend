const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ["Vacation", "Sick", "Other"],
  },
  workingDays: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Approved", "Cancelled"],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);

const StudentDetail = require("../models/studentDetailModel");
const { sendWhatsAppMessage } = require("../services/whatsappService");

function isValidTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""));
}

function formatTime(value) {
  if (!isValidTime(value)) return "";
  const [hour, minute] = value.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatBatchTime(student) {
  const start = formatTime(student.batchStartTime);
  const end = formatTime(student.batchEndTime);
  return start && end ? `${start} - ${end}` : student.batchTime || "—";
}

function validateBatchTimes(batchStartTime, batchEndTime) {
  if (!isValidTime(batchStartTime) || !isValidTime(batchEndTime)) {
    return "Choose valid batch start and end times.";
  }
  if (batchStartTime >= batchEndTime) {
    return "Batch end time must be later than batch start time.";
  }
  return null;
}

/**
 * Format Date helper for messages (e.g. "25 Sep 2026")
 */
function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * GET /student-detail/my-details
 * Retrieve authenticated student's profile details
 */
exports.getMyDetails = async (req, res) => {
  try {
    const student = await StudentDetail.findOne({ userId: req.user.id });
    return res.status(200).json({
      success: true,
      data: student || null,
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student details",
      error: error.message,
    });
  }
};

/**
 * POST /student-detail/submit
 * Student initial submission of their details
 */
exports.submitStudentDetails = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      whatsappNumber,
      course,
      mentor,
      courseStartDate,
      courseDuration,
      batchStartTime,
      batchEndTime,
      fee,
    } = req.body;

    if (!name?.trim() || !fatherName?.trim() || !whatsappNumber?.trim() || !course?.trim() || !mentor?.trim() || !courseStartDate || !batchStartTime || !batchEndTime) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields, including batch start and end times.",
      });
    }

    const batchTimeError = validateBatchTimes(batchStartTime, batchEndTime);
    if (batchTimeError) return res.status(400).json({ success: false, message: batchTimeError });
    const batchTime = `${formatTime(batchStartTime)} - ${formatTime(batchEndTime)}`;

    let existing = await StudentDetail.findOne({ userId: req.user.id });

    if (existing && existing.isLockedForStudent) {
      return res.status(403).json({
        success: false,
        message: "Your details have already been submitted and are locked for editing. Please contact administration for any modifications.",
      });
    }

    if (existing) {
      existing.name = name.trim();
      existing.fatherName = fatherName.trim();
      existing.whatsappNumber = whatsappNumber.trim();
      existing.course = course.trim();
      existing.mentor = mentor.trim();
      existing.courseStartDate = new Date(courseStartDate);
      existing.courseDuration = courseDuration?.trim() || "";
      existing.batchTime = batchTime;
      existing.batchStartTime = batchStartTime;
      existing.batchEndTime = batchEndTime;
      existing.fee = Number(fee) || 0;
      existing.isLockedForStudent = true;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Your details have been updated successfully!",
        data: existing,
      });
    }

    const newRecord = await StudentDetail.create({
      userId: req.user.id,
      name: name.trim(),
      fatherName: fatherName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      course: course.trim(),
      mentor: mentor.trim(),
      courseStartDate: new Date(courseStartDate),
      courseDuration: courseDuration?.trim() || "",
      batchTime,
      batchStartTime,
      batchEndTime,
      fee: Number(fee) || 0,
      isLockedForStudent: true,
    });

    // Notify Zint Institute on WhatsApp
    const instituteNumber = process.env.WATSAPPNUMBER?.trim();
    if (instituteNumber) {
      const msg = [
        "📋 *New Student Details Submitted*",
        "",
        `*Student Name:* ${newRecord.name}`,
        `*Father's Name:* ${newRecord.fatherName}`,
        `*WhatsApp:* ${newRecord.whatsappNumber}`,
        `*Course:* ${newRecord.course}`,
        `*Mentor:* ${newRecord.mentor}`,
        `*Batch Time:* ${newRecord.batchTime}`,
        `*Course Start Date:* ${formatDate(newRecord.courseStartDate)}`,
        `*Course Fee:* ₹${newRecord.fee || 0}`,
        "",
        "Please check the Admin Dashboard to review and verify.",
      ].join("\n");

      sendWhatsAppMessage(instituteNumber, msg).catch((err) =>
        console.error("Failed to send admin notification for student details:", err.message)
      );
    }

    return res.status(201).json({
      success: true,
      message: "Your details have been submitted successfully!",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error submitting student details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit details",
      error: error.message,
    });
  }
};

/**
 * GET /student-detail/admin/all
 * Admin: List all student details with search & filter
 */
exports.getAllStudentDetailsAdmin = async (req, res) => {
  try {
    const { search, course, mentor, courseStartDate } = req.query;
    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { fatherName: regex },
        { whatsappNumber: regex },
        { course: regex },
        { mentor: regex },
        { batchTime: regex },
        { batchStartTime: regex },
        { batchEndTime: regex },
      ];
    }

    if (course && course.trim()) {
      query.course = new RegExp(course.trim(), "i");
    }

    if (mentor && mentor.trim()) {
      query.mentor = new RegExp(mentor.trim(), "i");
    }

    // The date picker submits YYYY-MM-DD. Use an inclusive UTC day range so
    // every student whose course began on that calendar date is returned.
    if (courseStartDate && /^\d{4}-\d{2}-\d{2}$/.test(courseStartDate)) {
      const start = new Date(`${courseStartDate}T00:00:00.000Z`);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      query.courseStartDate = { $gte: start, $lt: end };
    }

    const students = await StudentDetail.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Admin fetch student details error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student details",
      error: error.message,
    });
  }
};

/**
 * GET /student-detail/admin/:id
 * Admin: Get single student detail by ID
 */
exports.getStudentDetailByIdAdmin = async (req, res) => {
  try {
    const student = await StudentDetail.findById(req.params.id).populate(
      "userId",
      "firstName lastName email"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get student details",
      error: error.message,
    });
  }
};

/**
 * PUT /student-detail/admin/:id
 * Admin: Edit all student details, notes, next fee date & amount
 */
exports.updateStudentDetailAdmin = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      whatsappNumber,
      course,
      mentor,
      courseStartDate,
      courseDuration,
      batchStartTime,
      batchEndTime,
      fee,
      notes,
      nextFeeDate,
      nextFeeAmount,
      isAllFeeSubmitted,
      isLockedForStudent,
      isVerifiedByAdmin,
    } = req.body;

    const student = await StudentDetail.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    if (name !== undefined) student.name = name.trim();
    if (fatherName !== undefined) student.fatherName = fatherName.trim();
    if (whatsappNumber !== undefined) student.whatsappNumber = whatsappNumber.trim();
    if (course !== undefined) student.course = course.trim();
    if (mentor !== undefined) student.mentor = mentor.trim();
    if (courseStartDate !== undefined) student.courseStartDate = new Date(courseStartDate);
    if (courseDuration !== undefined) student.courseDuration = courseDuration.trim();
    if (batchStartTime !== undefined || batchEndTime !== undefined) {
      const nextStartTime = batchStartTime ?? student.batchStartTime;
      const nextEndTime = batchEndTime ?? student.batchEndTime;
      const batchTimeError = validateBatchTimes(nextStartTime, nextEndTime);
      if (batchTimeError) return res.status(400).json({ success: false, message: batchTimeError });
      student.batchStartTime = nextStartTime;
      student.batchEndTime = nextEndTime;
      student.batchTime = `${formatTime(nextStartTime)} - ${formatTime(nextEndTime)}`;
    }
    if (fee !== undefined) student.fee = Number(fee) || 0;
    if (notes !== undefined) student.notes = notes; // No word limit
    if (nextFeeDate !== undefined) student.nextFeeDate = nextFeeDate ? new Date(nextFeeDate) : null;
    if (nextFeeAmount !== undefined) student.nextFeeAmount = Number(nextFeeAmount) || 0;
    if (isAllFeeSubmitted !== undefined) student.isAllFeeSubmitted = Boolean(isAllFeeSubmitted);
    if (isLockedForStudent !== undefined) student.isLockedForStudent = Boolean(isLockedForStudent);
    if (isVerifiedByAdmin !== undefined) student.isVerifiedByAdmin = Boolean(isVerifiedByAdmin);

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully!",
      data: student,
    });
  } catch (error) {
    console.error("Admin update student detail error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update student details",
      error: error.message,
    });
  }
};

/**
 * PATCH /student-detail/admin/:id/toggle-fee-status
 * Admin: Quick toggle "All Fee Submitted" flag
 */
exports.toggleAllFeeSubmittedAdmin = async (req, res) => {
  try {
    const student = await StudentDetail.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    // If specific value is passed in req.body, use that; otherwise toggle boolean
    if (typeof req.body.isAllFeeSubmitted === "boolean") {
      student.isAllFeeSubmitted = req.body.isAllFeeSubmitted;
    } else {
      student.isAllFeeSubmitted = !student.isAllFeeSubmitted;
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: student.isAllFeeSubmitted
        ? `Marked "${student.name}" as All Fee Submitted ✅`
        : `Marked "${student.name}" as Fee Pending ⏳`,
      data: student,
    });
  } catch (error) {
    console.error("Toggle fee status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle fee status",
      error: error.message,
    });
  }
};

/**
 * DELETE /student-detail/admin/:id
 * Admin: Delete a student detail record
 */
exports.deleteStudentDetailAdmin = async (req, res) => {
  try {
    const deleted = await StudentDetail.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete student record",
      error: error.message,
    });
  }
};

/**
 * POST /student-detail/admin/:id/send-manual-reminder
 * Admin: Trigger manual WhatsApp fee or batch reminder to student & institute
 */
exports.sendManualWhatsAppReminder = async (req, res) => {
  try {
    const { type } = req.body; // 'fee' or 'batch'
    const student = await StudentDetail.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    const instituteNumber = process.env.WATSAPPNUMBER?.trim();
    let studentMsg = "";
    let adminMsg = "";

    if (type === "fee") {
      studentMsg = [
        "📢 *Fee Reminder — Zint Computer Education Institute*",
        "",
        `Dear *${student.name}*,`,
        `This is a reminder regarding your upcoming fee installment of *₹${student.nextFeeAmount || student.fee || 0}* due on *${formatDate(student.nextFeeDate)}* for *${student.course}*.`,
        "",
        `*Mentor:* ${student.mentor}`,
        `*Batch Timing:* ${formatBatchTime(student)}`,
        "",
        "Kindly submit your fees on or before the due date. Feel free to reply here if you have any questions.",
        "",
        "Best regards,",
        "Zint Institute Administration",
      ].join("\n");

      adminMsg = [
        "🔔 *Fee Follow-up Alert (Manual Trigger)*",
        "",
        `*Student Name:* ${student.name}`,
        `*Father's Name:* ${student.fatherName}`,
        `*WhatsApp:* ${student.whatsappNumber}`,
        `*Course:* ${student.course}`,
        `*Batch Time:* ${formatBatchTime(student)}`,
        `*Mentor:* ${student.mentor}`,
        `*Due Date:* ${formatDate(student.nextFeeDate)}`,
        `*Fee Due:* ₹${student.nextFeeAmount || 0}`,
      ].join("\n");
    } else {
      // Batch Reminder
      studentMsg = [
        "⏰ *Batch Class Reminder — Zint Institute*",
        "",
        `Hello *${student.name}*,`,
        `Your *${student.course}* batch is scheduled today at *${formatBatchTime(student)}* with mentor *${student.mentor}*.`,
        "",
        "Please be ready and on time for your class.",
        "",
        "Best regards,",
        "Zint Institute",
      ].join("\n");

      adminMsg = [
        "⏰ *Batch Reminder Alert (Manual Trigger)*",
        "",
        `*Student Name:* ${student.name}`,
        `*Father's Name:* ${student.fatherName}`,
        `*WhatsApp:* ${student.whatsappNumber}`,
        `*Course:* ${student.course}`,
        `*Batch Time:* ${formatBatchTime(student)}`,
        `*Mentor:* ${student.mentor}`,
      ].join("\n");
    }

    // Send to Student
    const studentSend = await sendWhatsAppMessage(student.whatsappNumber, studentMsg);

    // Send to Admin
    let adminSend = null;
    if (instituteNumber) {
      adminSend = await sendWhatsAppMessage(instituteNumber, adminMsg);
    }

    return res.status(200).json({
      success: true,
      message: `WhatsApp ${type === "fee" ? "Fee" : "Batch"} reminder sent successfully!`,
      studentSend,
      adminSend,
    });
  } catch (error) {
    console.error("Manual WhatsApp reminder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp reminder",
      error: error.message,
    });
  }
};

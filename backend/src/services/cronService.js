const cron = require("node-cron");
const TrainingRegistration = require("../models/trainingRegistrationModel");
const StudentDetail = require("../models/studentDetailModel");
const { sendWhatsAppMessage } = require("./whatsappService");

const MONTHS = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  const match = String(value || "").match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return "";
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? "PM" : "AM"}`;
}

function getTodayAndTomorrowIST() {
  const nowIst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const todayStr = `${nowIst.getFullYear()}-${pad(nowIst.getMonth() + 1)}-${pad(nowIst.getDate())}`;

  const tomorrowIst = new Date(nowIst.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowStr = `${tomorrowIst.getFullYear()}-${pad(tomorrowIst.getMonth() + 1)}-${pad(tomorrowIst.getDate())}`;

  return { nowIst, todayStr, tomorrowStr };
}

/**
 * Parses timetable date ("18 Sep 2026", "2026-09-18", "23 july 2026")
 * and time ("6:00 PM", "02 : 30", "9:15 AM (IST)") as Asia/Kolkata.
 */
function parseSessionDateTime(dateStr, timeStr) {
  try {
    if (!dateStr || !timeStr) return null;

    const rawDate = String(dateStr).trim();
    let year;
    let month;
    let day;

    const iso = rawDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    const named = rawDate.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    const dmy = rawDate.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);

    if (iso) {
      year = Number(iso[1]);
      month = Number(iso[2]) - 1;
      day = Number(iso[3]);
    } else if (named) {
      const monthIndex = MONTHS[named[2].toLowerCase()];
      if (monthIndex === undefined) return null;
      day = Number(named[1]);
      month = monthIndex;
      year = Number(named[3]);
    } else if (dmy) {
      day = Number(dmy[1]);
      month = Number(dmy[2]) - 1;
      year = Number(dmy[3]);
    } else {
      return null;
    }

    let cleanTime = String(timeStr).replace(/\(.*?\)/g, "").trim();
    const isPM = /pm/i.test(cleanTime);
    const isAM = /am/i.test(cleanTime);
    const timeDigits = cleanTime.replace(/am|pm/gi, "").replace(/\s+/g, "");
    const [rawHour, rawMin] = timeDigits.split(":");
    let hour = parseInt(rawHour, 10);
    let min = parseInt(rawMin || "0", 10);

    if (isNaN(hour) || hour < 0 || hour > 23) return null;
    if (isNaN(min) || min < 0 || min > 59) min = 0;

    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;

    const isoIst = `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(min)}:00+05:30`;
    const dateObj = new Date(isoIst);
    return Number.isNaN(dateObj.getTime()) ? null : dateObj;
  } catch {
    return null;
  }
}

/**
 * Parses a stored start time for today in IST. New records use `HH:mm` from the
 * native time picker; the legacy text format is retained as a fallback.
 */
function parseBatchTimeToday(batchTimeStr) {
  try {
    if (!batchTimeStr) return null;
    const timeOnly = String(batchTimeStr).match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (timeOnly) {
      const nowIst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      return new Date(nowIst.getFullYear(), nowIst.getMonth(), nowIst.getDate(), Number(timeOnly[1]), Number(timeOnly[2]), 0, 0);
    }
    const firstPart = String(batchTimeStr).split(/[-–to]/i)[0].trim();
    const isPM = /pm/i.test(firstPart);
    const isAM = /am/i.test(firstPart);
    const timeDigits = firstPart.replace(/am|pm/gi, "").replace(/\s+/g, "");
    const parts = timeDigits.split(":");
    let hour = parseInt(parts[0], 10);
    let min = parseInt(parts[1] || "0", 10);

    if (isNaN(hour) || hour < 0 || hour > 23) return null;
    if (isNaN(min) || min < 0 || min > 59) min = 0;

    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;

    const nowIst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    return new Date(nowIst.getFullYear(), nowIst.getMonth(), nowIst.getDate(), hour, min, 0, 0);
  } catch {
    return null;
  }
}

function buildReminderMessage(reg, minutesUntil) {
  const mins = Math.max(1, Math.round(minutesUntil));
  const joinLine = reg.meetingLink
    ? `🔗 *Join now:* ${reg.meetingLink}`
    : "🔗 Meeting link will be shared shortly.";

  return (
    `⏰ *Meeting starts in half an hour!* ⏰\n\n` +
    `Hello *${reg.name}*,\n\n` +
    `Your *${reg.course}* online session with mentor *${reg.faculty}* starts in *${mins} minutes*.\n\n` +
    `📅 *Date:* ${reg.date}\n` +
    `⏰ *Time:* ${reg.time}\n` +
    `${joinLine}\n\n` +
    `Please be ready on time.\n\n` +
    `Best regards,\n*Zint Institute Team*`
  );
}

// ── 1. Training Registration 30-min Reminder ─────────────────────────────
async function checkAndSendReminders() {
  try {
    const pendingRegistrations = await TrainingRegistration.find({ reminderSent: false });
    if (!pendingRegistrations.length) return;

    const now = Date.now();

    for (const reg of pendingRegistrations) {
      const sessionDate = parseSessionDateTime(reg.date, reg.time);
      if (!sessionDate) continue;

      const diffMinutes = (sessionDate.getTime() - now) / (1000 * 60);

      // ~30 minutes before start (20–40 min window)
      if (diffMinutes < 20 || diffMinutes > 40) continue;

      console.log(`[Cron] Sending 30-min reminder to ${reg.phoneNumber} for "${reg.course}"...`);

      const sendResult = await sendWhatsAppMessage(reg.phoneNumber, buildReminderMessage(reg, diffMinutes));
      if (!sendResult.success) {
        console.warn(`[Cron] Reminder not marked sent for ${reg.phoneNumber}: ${sendResult.error}`);
        continue;
      }

      reg.reminderSent = true;
      await reg.save();
    }
  } catch (error) {
    console.error("[Cron] Error running reminder job:", error.message);
  }
}

// ── 2. Student Fee Reminder (1 Day Before `nextFeeDate`) ────────────────────
async function checkAndSendStudentFeeReminders() {
  try {
    const { nowIst, tomorrowStr } = getTodayAndTomorrowIST();
    const instituteNumber = process.env.WATSAPPNUMBER?.trim();

    // Find students with a nextFeeDate set who haven't paid all fees and haven't received reminder for tomorrow's date
    const students = await StudentDetail.find({
      nextFeeDate: { $ne: null },
      isAllFeeSubmitted: { $ne: true },
      lastFeeReminderSentDate: { $ne: tomorrowStr },
    });

    for (const student of students) {
      if (!student.nextFeeDate) continue;

      const feeDateIst = new Date(new Date(student.nextFeeDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const feeDateStr = `${feeDateIst.getFullYear()}-${pad(feeDateIst.getMonth() + 1)}-${pad(feeDateIst.getDate())}`;

      // Check if fee is due tomorrow
      if (feeDateStr === tomorrowStr) {
        console.log(`[Cron] Sending 1-day-before Fee Reminder for student: ${student.name} (${student.whatsappNumber})`);

        // Message for Student
        const studentMsg = [
          "📢 *Fee Reminder — Zint Computer Education Institute*",
          "",
          `Dear *${student.name}*,`,
          `This is a gentle reminder that your upcoming fee installment of *₹${student.nextFeeAmount || 0}* is due tomorrow (*${formatDate(student.nextFeeDate)}*) for the *${student.course}* course.`,
          "",
          `*Mentor:* ${student.mentor}`,
          `*Batch Time:* ${student.batchTime}`,
          "",
          "Kindly submit your fees on or before the due date. For any assistance or questions, please feel free to reply to this message.",
          "",
          "Thank you,",
          "Zint Institute Administration",
        ].join("\n");

        // Message for Zint Institute Admin
        const adminMsg = [
          "🔔 *Admin Alert: Student Fee Due Tomorrow*",
          "",
          `*Student Name:* ${student.name}`,
          `*Father's Name:* ${student.fatherName}`,
          `*WhatsApp Number:* ${student.whatsappNumber}`,
          `*Course:* ${student.course}`,
          `*Batch Time:* ${student.batchTime}`,
          `*Mentor:* ${student.mentor}`,
          `*Next Fee Due:* ₹${student.nextFeeAmount || 0}`,
          `*Due Date:* ${formatDate(student.nextFeeDate)}`,
          "",
          "Please follow up with the student for fee collection.",
        ].join("\n");

        // Send to Student
        await sendWhatsAppMessage(student.whatsappNumber, studentMsg);

        // Send to Institute
        if (instituteNumber) {
          await sendWhatsAppMessage(instituteNumber, adminMsg);
        }

        student.lastFeeReminderSentDate = tomorrowStr;
        await student.save();
      }
    }
  } catch (error) {
    console.error("[Cron] Error running student fee reminder job:", error.message);
  }
}

// ── 3. Fee-Due-Day Batch Reminder (1 Hour Before `batchStartTime`) ─────────
async function checkAndSendStudentBatchReminders() {
  try {
    const { nowIst, todayStr } = getTodayAndTomorrowIST();
    const instituteNumber = process.env.WATSAPPNUMBER?.trim();

    // Send only on the scheduled fee due date, not on every class day.
    const students = await StudentDetail.find({
      nextFeeDate: { $ne: null },
      isAllFeeSubmitted: { $ne: true },
      lastBatchReminderSentDate: { $ne: todayStr },
    });

    const nowMs = nowIst.getTime();

    for (const student of students) {
      const feeDateIst = new Date(new Date(student.nextFeeDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const feeDateStr = `${feeDateIst.getFullYear()}-${pad(feeDateIst.getMonth() + 1)}-${pad(feeDateIst.getDate())}`;
      if (feeDateStr !== todayStr) continue;

      const batchDate = parseBatchTimeToday(student.batchStartTime || student.batchTime);
      if (!batchDate) continue;

      const diffMinutes = (batchDate.getTime() - nowMs) / (1000 * 60);

      // Check if batch is starting in ~45 to 75 minutes (approx 1 hour before)
      if (diffMinutes >= 45 && diffMinutes <= 75) {
        const batchTime = student.batchStartTime && student.batchEndTime
          ? `${formatTime(student.batchStartTime)} - ${formatTime(student.batchEndTime)}`
          : student.batchTime;
        console.log(`[Cron] Sending fee-due-day 1-hour batch reminder for student: ${student.name} (${batchTime})`);

        // Message for Student
        const studentMsg = [
          "⏰ *Class Reminder — Zint Institute*",
          "",
          `Hello *${student.name}*,`,
          `Your fee is due today. Your *${student.course}* class starts in approximately 1 hour at *${batchTime}* with mentor *${student.mentor}*.`,
          "",
          "Please be ready and on time for your class.",
          "",
          "Best regards,",
          "Zint Institute",
        ].join("\n");

        // Message for Institute
        const adminMsg = [
          "⏰ *Student Class Starting in 1 Hour*",
          "",
          `*Student Name:* ${student.name}`,
          `*Father's Name:* ${student.fatherName}`,
          `*WhatsApp Number:* ${student.whatsappNumber}`,
          `*Course:* ${student.course}`,
          `*Batch Time:* ${batchTime}`,
          `*Mentor:* ${student.mentor}`,
        ].join("\n");

        await sendWhatsAppMessage(student.whatsappNumber, studentMsg);
        if (instituteNumber) {
          await sendWhatsAppMessage(instituteNumber, adminMsg);
        }

        student.lastBatchReminderSentDate = todayStr;
        await student.save();
      }
    }
  } catch (error) {
    console.error("[Cron] Error running student batch reminder job:", error.message);
  }
}

function initCronJobs() {
  // Every 2 minutes: Training 30-min reminder
  cron.schedule(
    "*/2 * * * *",
    () => {
      checkAndSendReminders();
    },
    { timezone: "Asia/Kolkata" }
  );

  // Every 15 minutes: Fee-due-day batch reminder & 1-day-before fee check
  cron.schedule(
    "*/15 * * * *",
    () => {
      checkAndSendStudentBatchReminders();
      checkAndSendStudentFeeReminders();
    },
    { timezone: "Asia/Kolkata" }
  );

  console.log("[Cron] All WhatsApp reminder jobs scheduled (Training, Fee Dues, Fee-Due-Day Batch Times - IST).");
}

module.exports = {
  initCronJobs,
  checkAndSendReminders,
  checkAndSendStudentFeeReminders,
  checkAndSendStudentBatchReminders,
  parseSessionDateTime,
  parseBatchTimeToday,
};

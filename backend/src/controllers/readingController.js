
import pool from "../config/db.js";

const VALID_SLOTS = [
  "morning",
  "after_breakfast",
  "after_lunch",
  "after_dinner",
];


const isValidDate = (date) => {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};

const validateReading = (reading_date, time_slot, glucose_value) => {
  if (!reading_date || !time_slot || glucose_value === undefined || glucose_value === null || glucose_value === "") {
    return "Date, time slot and glucose value are required.";
  }

  if (!isValidDate(reading_date)) {
    return "Please enter a valid date.";
  }

  if (!VALID_SLOTS.includes(time_slot)) {
    return "Please select a valid time slot.";
  }

  if (
    !Number.isInteger(glucose_value) ||
    glucose_value < 40 ||
    glucose_value > 600
  ) {
    return "Value must be a whole number between 40 and 600 mg/dL.";
  }

  return null;
};

// CREATE READING
const addReading = async (req, res) => {
  const client = await pool.connect();
//   console.log("Client connected for adding reading",client);
// console.log("Request body:", req.body);
  try {
    const { reading_date, time_slot, glucose_value } = req.body;
    const userId = req.userId;

    // 1. Validate input
    const validationError = validateReading(
      reading_date,
      time_slot,
      glucose_value
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await client.query("BEGIN");
console.log("userid: ",userId)
    // 2. Lock user row to serialize daily reading creation
    const user = await client.query(
      "SELECT id FROM users WHERE id = $1 FOR UPDATE",
      [userId]
    );

    if (user.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 3. Check future date
    const futureCheck = await client.query(
      "SELECT $1::date > CURRENT_DATE AS is_future",
      [reading_date]
    );

    if (futureCheck.rows[0].is_future) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Date cannot be in the future.",
      });
    }

    // 4. Check daily limit
    const countResult = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM readings
       WHERE user_id = $1 AND reading_date = $2`,
      [userId, reading_date]
    );

    if (countResult.rows[0].total >= 4) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "You can add only 4 readings per day.",
      });
    }

    // 5. Insert reading
    const result = await client.query(
      `INSERT INTO readings
       (user_id, reading_date, time_slot, glucose_value)
       VALUES ($1, $2, $3, $4)
       RETURNING id, reading_date, time_slot, glucose_value`,
      [userId, reading_date, time_slot, glucose_value]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Glucose reading added successfully.",
      reading: result.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "You already have a reading for this slot on this date.",
      });
    }

    console.error("Add reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  } finally {
    client.release();
  }
};


const getReadings = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;
    console.log('req,query: ',req.query);

    if (date && !isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid date.",
      });
    }

    const result = await pool.query(
      `SELECT id, reading_date, time_slot,
              glucose_value, created_at, updated_at
       FROM readings
       WHERE user_id = $1
       AND ($2::date IS NULL OR reading_date = $2::date)
       ORDER BY reading_date DESC,
       CASE time_slot
         WHEN 'morning' THEN 1
         WHEN 'after_breakfast' THEN 2
         WHEN 'after_lunch' THEN 3
         WHEN 'after_dinner' THEN 4
       END`,
      [userId, date || null]
    );

    return res.status(200).json({
      success: true,
      total: result.rows.length,
      readings: result.rows,
    });

  } catch (error) {
    console.error("Get readings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



 const updateReading = async (req, res) => {
  const client = await pool.connect();
  

  try {
    const userId = req.userId;
    const readingId = Number(req.params.id);

    const { reading_date, time_slot, glucose_value } = req.body;

    if (!Number.isSafeInteger(readingId) || readingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading ID.",
      });
    }

    const validationError = validateReading(
      reading_date,
      time_slot,
      glucose_value
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await client.query("BEGIN");

    // Lock the user's row
    await client.query(
      "SELECT id FROM users WHERE id = $1 FOR UPDATE",
      [userId]
    );

    // Check reading ownership
    const existing = await client.query(
      `SELECT id FROM readings
       WHERE id = $1 AND user_id = $2
       FOR UPDATE`,
      [readingId, userId]
    );

    if (existing.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Reading not found.",
      });
    }

    // Check future date
    const futureCheck = await client.query(
      "SELECT $1::date > CURRENT_DATE AS is_future",
      [reading_date]
    );

    if (futureCheck.rows[0].is_future) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Date cannot be in the future.",
      });
    }

    // Check other readings on target date
    const countResult = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM readings
       WHERE user_id = $1
       AND reading_date = $2
       AND id <> $3`,
      [userId, reading_date, readingId]
    );

    if (countResult.rows[0].total >= 4) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "You can add only 4 readings per day.",
      });
    }

    // Update reading
    const result = await client.query(
      `UPDATE readings
       SET reading_date = $1,
           time_slot = $2,
           glucose_value = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING id, reading_date, time_slot, glucose_value`,
      [reading_date, time_slot, glucose_value, readingId, userId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Reading updated successfully.",
      reading: result.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "You already have a reading for this slot on this date.",
      });
    }

    console.error("Update reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  } finally {
    client.release();
  }
};



const deleteReading = async (req, res) => {
  try {
    const userId = req.userId;
    const readingId = Number(req.params.id);

    if (!Number.isSafeInteger(readingId) || readingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading ID.",
      });
    }

    const result = await pool.query(
      `DELETE FROM readings
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [readingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reading not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reading deleted successfully.",
    });

  } catch (error) {
    console.error("Delete reading error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};





export { addReading, getReadings, updateReading, deleteReading };

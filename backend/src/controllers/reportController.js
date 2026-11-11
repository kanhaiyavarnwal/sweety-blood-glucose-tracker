import pool from "../config/db.js";

const isValidDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};

const getDailyReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    if (!date || !isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date (YYYY-MM-DD).",
      });
    }

    const statsResult = await pool.query(
      `SELECT
          MAX(glucose_value) AS highest,
          MIN(glucose_value) AS lowest,
          ROUND(AVG(glucose_value)::numeric, 1) AS average,
          COUNT(*)::int AS total
       FROM readings
       WHERE user_id = $1
       AND reading_date = $2`,
      [userId, date],
    );

    const readingsResult = await pool.query(
      `SELECT
          id,
          reading_date,
          time_slot,
          glucose_value
       FROM readings
       WHERE user_id = $1
       AND reading_date = $2
       ORDER BY
          CASE time_slot
            WHEN 'morning' THEN 1
            WHEN 'after_breakfast' THEN 2
            WHEN 'after_lunch' THEN 3
            WHEN 'after_dinner' THEN 4
          END`,
      [userId, date],
    );

    const stats = statsResult.rows[0];

    return res.status(200).json({
      success: true,
      report: {
        date,
        highest: stats.highest,
        lowest: stats.lowest,
        average: stats.average,
        total: stats.total,
        readings: readingsResult.rows,
      },
    });
  } catch (error) {
    console.error("Daily report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate daily report.",
    });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.userId;

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 9999
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid month and year.",
      });
    }

    const statsResult = await pool.query(
      `SELECT
          MAX(glucose_value) AS highest,
          MIN(glucose_value) AS lowest,
          ROUND(AVG(glucose_value)::numeric, 1) AS average,
          COUNT(*)::int AS total
       FROM readings
       WHERE user_id = $1
       AND reading_date >= make_date($2, $3, 1)
       AND reading_date < (
         make_date($2, $3, 1) + INTERVAL '1 month'
       )`,
      [userId, year, month],
    );

    const dailyResult = await pool.query(
      `SELECT
          reading_date AS date,
          MAX(glucose_value) AS highest,
          MIN(glucose_value) AS lowest,
          ROUND(AVG(glucose_value)::numeric, 1) AS average,
          COUNT(*)::int AS total
       FROM readings
       WHERE user_id = $1
       AND reading_date >= make_date($2, $3, 1)
       AND reading_date < (
         make_date($2, $3, 1) + INTERVAL '1 month'
       )
       GROUP BY reading_date
       ORDER BY reading_date ASC`,
      [userId, year, month],
    );

    const stats = statsResult.rows[0];

    return res.status(200).json({
      success: true,
      report: {
        month,
        year,
        highest: stats.highest,
        lowest: stats.lowest,
        average: stats.average,
        total: stats.total,
        dailyReports: dailyResult.rows,
      },
    });
  } catch (error) {
    console.error("Monthly report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate monthly report.",
    });
  }
};

export { getDailyReport, getMonthlyReport };

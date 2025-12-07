import pool from "../database/database.js";

async function createcoupon(req, res) {
  try {
    const {
      code,
      description,
      discountType,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimitPerUser,
      excludedcategories,
      applicablecategories,
      allowedcountries
    } = req.body;

    // Validate required fields
    if (!code || !description || !discountType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const insertQuery = `
      INSERT INTO coupons
      (
        code,
        description,
        "discountType",
        "maxDiscountAmount",
        "startDate",
        "endDate",
        "usageLimitPerUser",
        excludedcategories,
        applicablecategories,
        allowedcountries
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      code,
      description,
      discountType,
      maxDiscountAmount ?? 0,             // convert NULL to 0
      startDate,
      endDate,
      usageLimitPerUser ?? null,          // optional
      excludedcategories ?? [],           // store as array
      applicablecategories ?? [],         // store as array
      allowedcountries ?? []              // store as array
    ];

    const result = await pool.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    if (err.code === "23505") { // unique violation
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default createcoupon;

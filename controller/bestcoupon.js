import pool from "../database/database.js"; // your DB pool

export async function bestcoupon(req, res) {
  try {
    const { user, cart } = req.body; 
    // user: { userId, userTier, country, lifetimeSpend, ordersPlaced }
    // cart: { items: [{ productId, category, unitPrice, quantity }, ...] }

    if (!user || !cart || !cart.items) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    // Calculate total cart value and total items
    const cartValue = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const totalItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartCategories = cart.items.map(item => item.category);

    // 1. Fetch all coupons
    const { rows: coupons } = await pool.query("SELECT * FROM coupons");

    // 2. Filter eligible coupons
    const eligibleCoupons = [];
    const now = new Date();

    for (const coupon of coupons) {
      // Check date validity
      if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) continue;

      // Check usageLimitPerUser using ordersPlaced
      if (user.ordersPlaced >= coupon.usageLimitPerUser) continue;

      // User-based eligibility
      if (coupon.allowedcountries && coupon.allowedcountries.length > 0 &&
          !coupon.allowedcountries.includes(user.country)) continue;

      // Cart-based eligibility
      if (coupon.applicablecategories && coupon.applicablecategories.length > 0 &&
          !cartCategories.some(cat => coupon.applicablecategories.includes(cat))) continue;

      if (coupon.excludedcategories && coupon.excludedcategories.length > 0 &&
          cartCategories.some(cat => coupon.excludedcategories.includes(cat))) continue;

      // Passed all checks → calculate discount
      let discount = 0;
      if (coupon.discountType === "FLAT") {
        discount = coupon.maxDiscountAmount; // using maxDiscountAmount as flat discount
      } else if (coupon.discountType === "PERCENT") {
        discount = (coupon.maxDiscountAmount / 100) * cartValue; // % discount capped by maxDiscountAmount
        if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
      }

      eligibleCoupons.push({ ...coupon, discount });
    }

    // 3. Select the best coupon
    if (eligibleCoupons.length === 0) {
      return res.json({ success: true, bestCoupon: null });
    }

    eligibleCoupons.sort((a, b) => {
      if (b.discount !== a.discount) return b.discount - a.discount; // highest discount first
      if (new Date(a.endDate) - new Date(b.endDate) !== 0) return new Date(a.endDate) - new Date(b.endDate); // earliest endDate first
      return a.code.localeCompare(b.code); // lexicographically smaller code
    });

    const bestCoupon = eligibleCoupons[0];
    return res.json({ success: true, bestCoupon });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export default bestcoupon;

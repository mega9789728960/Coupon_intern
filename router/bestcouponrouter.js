import express from 'express';
import bestcoupon from '../controller/bestcoupon.js';
const bestcouponrouter = express.Router();
bestcouponrouter.get('/bestcoupon', bestcoupon);
export default bestcouponrouter;
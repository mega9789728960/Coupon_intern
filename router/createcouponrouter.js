import express from 'express';
import createcoupon from '../controller/createcoupon.js';
const createcouponrouter = express.Router();

createcouponrouter.post('/createcoupon', createcoupon);
export default createcouponrouter;
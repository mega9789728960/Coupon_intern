import express from 'express';

import cors from 'cors';
import createcouponrouter from '../router/createcouponrouter.js';
import bestcouponrouter from '../router/bestcouponrouter.js';
import router from '../router/loginrouter.js';

const api = express();


api.use(cors());
api.use(express.json());
api.use(createcouponrouter);
api.use(bestcouponrouter);
api.use(router)

export default api;
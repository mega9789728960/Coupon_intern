import express from 'express';
const api1 = express();
import api from './api/index.js';
api1.use(api);
api1.listen(3001);
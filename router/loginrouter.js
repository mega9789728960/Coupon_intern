// routes.js
import express from "express";
import { demoLogin } from  "../controller/login.js"

const router = express.Router();

// POST /login
router.post("/login", demoLogin);

export default router;

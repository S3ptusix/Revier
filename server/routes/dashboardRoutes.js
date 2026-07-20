import express from "express";

import { getDashboardData } from "../controllers/dasboardControllers.js"

const dashboardRouter = express.Router();

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
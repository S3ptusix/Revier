import express from "express";

import { getDashboardData } from "../controllers/dashboardControllers.js"

const dashboardRouter = express.Router();

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
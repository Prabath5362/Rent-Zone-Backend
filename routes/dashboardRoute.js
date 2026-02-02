import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { getDashboardDetails } from "../controller/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/getDashboardDetails",authMiddleware,getDashboardDetails);


export default dashboardRouter;
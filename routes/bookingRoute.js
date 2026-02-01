import express from "express";
import { addBooking, deleteBooking, getBooking, getBookingByEmail, updateBooking, updateBookingStatus } from "../controller/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Authenticated routes
bookingRouter.get("/getBookings",authMiddleware,getBooking);
bookingRouter.get("/getBookingByEmail/:email",authMiddleware,getBookingByEmail);
bookingRouter.post("/addBooking",authMiddleware,addBooking);
bookingRouter.put("/updateBooking",authMiddleware,updateBooking);
bookingRouter.put("/updateBookingStatus",authMiddleware,updateBookingStatus);
bookingRouter.delete("/deleteBooking/:bookingId",authMiddleware,deleteBooking);

export default bookingRouter;
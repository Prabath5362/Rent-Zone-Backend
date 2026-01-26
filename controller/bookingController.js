import Booking from "../model/booking.js";
import { isAdmin, isUserNull } from "./userController.js";

export async function addBooking(req, res) {
  const bookingData = req.body;

  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    let id = 1;
    const lastBooking = await Booking.findOne().sort({ id: -1 });
    if (lastBooking) {
      id = lastBooking.id + 1;
    }

    bookingData.id = id;
    bookingData.email = req.user.email;
    bookingData.nic = req.user.nic;
    bookingData.profilePic = req.user.profilePic;
    bookingData.contact = req.user.contact;

    console.log("" + bookingData.productType);

    if (bookingData.productType === "spare") {
      delete bookingData.pickupDate;
      delete bookingData.returnDate;
    }

    const booking = new Booking(bookingData);
    await booking.save();
    res.json({
      message: "Booking created successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error" + e.message,
      error: e.message,
    });
  }
}

export async function getBooking(req, res) {
  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    const bookings = await Booking.find();
    res.json(bookings);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

export async function getBookingByEmail(req, res) {
  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    const email = req.params.email;
    const bookings = await Booking.find({ email: email });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error: " + e.message,
    });
  }
}

export async function updateBookingStatus(req, res) {
  const { bookingId, deliveryStatus } = req.body;
  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }
    const booking = await Booking.updateOne(
      {
        id: bookingId,
      },
      {
        deliveryStatus: deliveryStatus,
      }
    );

    res.json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

export async function deleteBooking(req, res) {
  const bookingId = req.params.bookingId;
  const userEmail = req.user.email;

  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    if (!isAdmin(req)) {
      const booking = await Booking.findOne({ id: bookingId });

      if (booking.email !== userEmail) {
        res.status(403).json({
          message: "You are not authorized to delete this booking",
        });
        return;
      }
    }

    await Booking.deleteOne({
      id: bookingId,
    });
    res.json({
      message: "Booking deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

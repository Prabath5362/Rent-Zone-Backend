import Booking from "../model/booking.js";
import Product from "../model/product.js";
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

    const product =await  Product.findOne({
      _id : bookingData.product
    });

    if(!product){
      res.status(400).json({
        message: "Product not found !",
        error: true
      });
      return;
    }

    if(product.stock <= 0){
       res.status(400).json({
        message: "Product out of stock !",
        error: true
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
    bookingData.product = product._id

  

    if (bookingData.productType === "spare") {
      delete bookingData.pickupDate;
      delete bookingData.returnDate;
    }

    const booking = new Booking(bookingData);
    await booking.save();

    product.stock -= bookingData.productQuantity;
    product.save();

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
        message: "Please login to continue",
      });
      return;
    }

    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to perform this task",
        });
        return;
    }

    const bookings = await Booking.find();
    res.json({
      bookings: bookings,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
      error: true,
    });
  }
}

export async function getBookingByEmail(req, res) {
  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "Please login to continue",
      });
      return;
    }

    const email = req.params.email;
    const bookings = await Booking.find({ email: email });
    res.json({
      bookings: bookings,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error: " + e.message,
      error: true
    });
  }
}

export async function updateBooking(req, res) {
  const bookingData = req.body;
  try {
    if( isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to perform this task",
        });
        return;
    }

    const booking = await Booking.updateOne(
      {
        id: bookingData.id,
      },
      bookingData
    );

    res.json({
      message: "Booking updated successfully",
      error: false,
    });4
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
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
      message: e.message,
      error: true,
    });
  }
}

export async function deleteBooking(req, res) {
  const bookingId = req.params.bookingId;
  const userEmail = req.user.email;

  const booking = await Booking.findOne({ id: bookingId }).populate("product");


  try {
    if (isUserNull(req)) {
      res.status(401).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    if (!isAdmin(req)) {
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

    console.log("product: "+  booking.product);
    

    if(booking.product && booking.productQuantity){
      booking.product.stock += booking.productQuantity;
      await booking.product.save();
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
      error: true,
    });
  }
}

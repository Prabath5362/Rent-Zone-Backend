import Booking from "../model/booking.js";
import Product from "../model/product.js";
import User from "../model/user.js";
import { isAdmin, isUserNull } from "./userController.js";

export async function getDashboardDetails(req, res) {
  try {
    if (isUserNull(req)) {
      res.status(400).json({
        message: "Please login first !",
        error: true,
      });
      return;
    }

    if (!isAdmin(req)) {
      res.status(400).json({
        message: "You are not authorized to perform this task !",
        error: true,
      });
      return;
    }

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Booking.countDocuments();

    const pendingOrdersCount = await Booking.countDocuments({
      deliveryStatus: "pending",
    });
    const deliveredOrdersCount = await Booking.countDocuments({
      deliveryStatus: "delivered",
    });

    const totalRevenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$rentalCost" },
        },
      },
    ]);

    const splittedRevenueData = await Booking.aggregate([
      {
        $group: {
          _id: "$deliveryStatus",
          totalRevenue: { $sum: "$rentalCost" },
        },
      },
    ]);

    // Today orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);

    const todayOrdersData = await Booking.aggregate([
      {
        $match: {
          bookingDate: { $gte: today, $lte: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          todayOrdersRevenue: { $sum: "$rentalCost" },
        },
      },
    ]);

    // this months orders
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const endOfmonth = new Date();
    endOfmonth.setMonth(endOfmonth.getMonth() + 1);
    endOfmonth.setDate(0);
    endOfmonth.setHours(23, 59, 59, 999);

    const thisMonthordersData = await Booking.aggregate([
      {
        $match: {
          bookingDate: { $gte: thisMonth, $lte: endOfmonth },
        },
      },

      {
        $group: {
          _id: null,
          thisMonthordersRevenue: { $sum: "$rentalCost" },
        },
      },
    ]);

    // This year orders
    const thisYear = new Date();
    thisYear.setMonth(0);
    thisYear.setDate(1);
    thisYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date();
    endOfYear.setMonth(11);
    endOfYear.setDate(31);
    endOfYear.setHours(23, 59, 59, 999);

    const thisYearOrdersData = await Booking.aggregate([
      {
        $match: {
          bookingDate: { $gte: thisYear, $lte: endOfYear },
        },
      },

      {
        $group: {
          _id: null,
          thisYearOrdersRevenue: { $sum: "$rentalCost" },
        },
      },
    ]);

    const ordersStatusCount = await Booking.aggregate([
      {
        $group: {
          _id: "$deliveryStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    );

    const revenueOverTime = await Booking.aggregate([
      { $match: { bookingDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
          revenue: { $sum: "$rentalCost" },
        },
      },
      { $project: { date: "$_id", revenue: 1, _id: 0 } },
      { $sort: { date: 1 } },
    ]);

    // Orders Count Over Time (daily for this month)
    const ordersCountOverTime = await Booking.aggregate([
      { $match: { bookingDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
          count: { $sum: 1 },
        },
      },
      { $project: { date: "$_id", count: 1, _id: 0 } },
      { $sort: { date: 1 } },
    ]);

    const topProducts = await Booking.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      {
        $match: {
          deliveryStatus: "delivered",
        },
      },

      {
        $group: {
          _id: "$product._id",
          productName: { $first: "$product.name" },
          category: { $first: "$product.categories" },
          stock: { $first: "$product.stock" },
          totalBookings: { $sum: "$productQuantity" },
          price: { $first: "$product.price" },
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1} },
      { $limit: 5 },
    ]);


    

    const totalRevenue = totalRevenueData[0].totalRevenue ?? 0;
    const splittedRevenue = splittedRevenueData ?? [];

    const todayOrdersRevenue = todayOrdersData[0]?.todayOrdersRevenue ?? 0;

    const thisMonthordersRevenue =
      thisMonthordersData[0]?.thisMonthordersRevenue ?? 0;

    const thisYearOrdersRevenue =
      thisYearOrdersData[0]?.thisYearOrdersRevenue ?? 0;

    const dashboardDetails = {
      userCount: userCount ?? 0,
      productCount: productCount ?? 0,
      orderCount: orderCount ?? 0,
      pendingOrdersCount: pendingOrdersCount,
      deliveredOrdersCount: deliveredOrdersCount,
      totalRevenue: totalRevenue,
      splittedRevenue: splittedRevenue,
      todayOrdersRevenue: todayOrdersRevenue,
      thisMonthordersRevenue: thisMonthordersRevenue,
      thisYearOrdersRevenue: thisYearOrdersRevenue,
      ordersStatusCount: ordersStatusCount ?? [],
      revenueOverTime: revenueOverTime,
      ordersCountOverTime: ordersCountOverTime,
      topProducts: topProducts
    };

    res.json({
      dashboardDetails: dashboardDetails,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error: " + error.message,
      error: true,
    });
  }
}

import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true
    },

    nic : {
        type: String,
        required: true
    },

    profilePic: {
        type: String,
        required: true          
    },

    nicFrontImage: {
        type: String,
        required: function () {
            return this.productType === 'rental';
        }
    },

    nicBackImage: {
        type: String,
        required: function () {
            return this.productType === 'rental';
        }
    },

    contact: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    productKey: {
        type: String,
        required: true
    },

    productImage: {
        type: String,
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    productCategories: [{
        type: String,
        required: true
    }],

    productType: {
        type: String,
        required: true
    },

    productQuantity: {
        type: Number,
        required: true
    },

    bookingDate: {
        type: Date,
        required: true,
        default: Date.now()
    },

    pickupDate: {
        type: Date,
        required: function () {
            return this.productType === 'rental';
        }
    },

    returnDate: {
        type: Date,
        required: function () {
            return this.productType === 'rental';
        }
    },

    rentalCost: {
        type: Number,
        required: true
    },

    deliveryStatus: {
        type: String,
        required: true,
        default: "pending"
    }


});


const Booking = mongoose.model("booking", bookingSchema);

export default Booking;
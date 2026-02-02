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

    // productKey: {
    //     type: String,
    //     required: true
    // },

    // productImage: {
    //     type: String,
    //     required: true,
    //     default: "https://img.drz.lazcdn.com/static/lk/p/4d2bac27ddf357068366bf18c182a747.jpg_200x200q80.avif"
    // },

    // productName: {
    //     type: String,
    //     required: true
    // },

    // productCategories: [{
    //     type: String,
    //     required: true
    // }],

    // productType: {
    //     type: String,
    //     required: true
    // },

    // no need above product detais bc we have product reference, only need add product id (not product key) and booking quantity

    productQuantity: {
        type: Number,
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
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
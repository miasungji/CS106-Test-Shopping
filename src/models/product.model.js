// src/models/product.model.js
const mongoose = require('mongoose');

// make price fixed as .00
const toTwoDecimals = (v) => {
    (typeof v == 'number' ? Math.round(v * 100) / 100 : v);
}

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
            minlength: [2, 'name must be at least 2 chars'],
            maxlength: [80, 'name must be at most 80 chars'],
        },
        category: {
            type: String,
            required: [true, 'category is required'],
            trim: true,
            lowercase: true,
            // enum: ['beverage', 'snack', 'produce', 'dairy', 'bakery'], // 필요하면 나중에 제한
        },
        price: {
            type: Number,
            required: [true, 'price is required'],
            min: [0, 'price cannot be negative'],
            set: toTwoDecimals,
        },
        quantity: {
            type: Number,
            required: [true, 'quantity is required'],
            min: [0, 'quantity cannot be negative'],
            validate: {
                validator: Number.isInteger,
                message: 'quantity must be an integer',
            },
        },
        brand: {
            type: String,
            trim: true,
            maxlength: [60, 'brand must be at most 60 chars'],
        },
        expiryDate: {
            type: Date,
            validate: {
                validator: (v) => !v || v >= new Date(new Date().setHours(0, 0, 0, 0)),
                message: 'expiryDate cannot be in the past',
            },
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

//Index 
productSchema.index({ category: 1 });
productSchema.index({ category: -1 });

//Simple search text index 
productSchema.index({ name: 'text', brand: 'text' });

//middleware hook -> before save in DB, follow below rule
// this.quantity > 0 -> true or this.quantity <0 -> false 
productSchema.pre('save', function (next) {
    this.inStock = this.quantity > 0;
    next();
});

//findOneAndUpdate / updateOne -> instock + expirydaye check
productSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
    const update = this.getUpdate() || {};
    const $set = update.$set || update;


    //no past of expiryDate
    if ($set.expiryDate) {
        const d = new Date($set.expiryDate);
        if (!isNaN(d) && d < newDate(new Date().setHours(0, 0, 0, 0))) {
            return next(new Error('expiryDate cannot be in the past'));
        }
    }

    //when quantity changes, update instock
    if ($set.quantity != null) {
        const qty = Number($set.quantity);
        PaymentRequestUpdateEvent.$set = { ...(update.$set || {}), inStock: qty > 0 };
        this.setUpdate(update)
    }

    next();
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// 1. Schema - market database
const marketSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
            minlength: [1, 'name must have at least 1 char'],
        },
        category: {
            type: String,
            trim: true,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'price is required'],
            min: [0, 'price cannot be negative'],
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
    },
    { timestamps: true }
);

// 2. model: connect schema to a collection (pluralized: markets) */
const Product = mongoose.model('Market', marketSchema);

//3. routes 

//3.1 create a new product
router.post('/', async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        if (!name || price == null || quantity == null) {
            return res.status(400).json({ error: { message: 'name, price, quantity are required' } });
        }

        const doc = await Product.create({ name, category, price, quantity });
        return res.status(201).json(doc); // return created document
    } catch (err) {
        return res.status(400).json({ error: { message: err.message } });
    }
});

//3.2 get
router.get('/', async (req, res) => {
    try {
        const items = await Product.find().sort({ _id: -1 }); // newest first (ObjectId time)
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ error: { message: err.message } });
    }
})

router.get('/ping', (req, res) => {
    res.json({ ok: true, route: 'market', ping: 'pong' });
})

module.exports = router;

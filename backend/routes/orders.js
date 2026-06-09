const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Helper to generate unique 12-digit order number
const generateOrderNumber = async () => {
    let orderNum;
    let exists = true;
    while (exists) {
        orderNum = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        const existingOrder = await Order.findOne({ orderNumber: orderNum });
        if (!existingOrder) exists = false;
    }
    return orderNum;
};

// Create a new Order (Admin Panel)
router.post('/create', async (req, res) => {
    try {
        const { name, place, phone, materialName, status } = req.body;
        
        // 1. Handle Customer Logic (Repeat Visits)
        let customer = await Customer.findOne({ phone });
        
        if (customer) {
            // Repeat customer! Update visit count and last visit date
            customer.visitCount += 1;
            customer.lastVisitDate = Date.now();
            customer.name = name; // Update name in case it changed slightly
            customer.place = place;
            await customer.save();
        } else {
            // New customer
            customer = new Customer({ name, place, phone });
            await customer.save();
        }

        // 2. Generate unique 12 digit order number
        const orderNumber = await generateOrderNumber();

        // 3. Create the order
        const newOrder = new Order({
            orderNumber,
            customer: customer._id,
            materialName,
            status: status || 'Order Received'
        });
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder, customer });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Check Order Status (Customer Public Site)
router.post('/check-status', async (req, res) => {
    try {
        const { orderNumber, phone } = req.body;
        
        // Find order and populate customer to verify phone number
        const order = await Order.findOne({ orderNumber }).populate('customer');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Security check: Verify the 10-digit phone number matches the order's customer
        if (order.customer.phone !== phone) {
            return res.status(401).json({ error: 'Phone number does not match this order' });
        }
        
        res.status(200).json({ order, customer: order.customer });
    } catch (error) {
        console.error('Error checking status:', error);
        res.status(500).json({ error: 'Failed to check order status' });
    }
});

// Get all orders (Admin Panel)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order status (Admin Panel)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        let updateData = { status };
        
        if (status === 'Ready for Pickup') {
            updateData.pickupDate = Date.now();
        }
        
        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Update full order details (Admin Panel Edit Button)
router.put('/:id', async (req, res) => {
    try {
        const { status, materialName, customerName } = req.body;
        
        const order = await Order.findById(req.params.id).populate('customer');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        // Update order
        if (status) order.status = status;
        if (materialName) order.materialName = materialName;
        if (status === 'Ready for Pickup') order.pickupDate = Date.now();
        await order.save();
        
        // Update customer name if provided
        if (customerName && order.customer) {
            order.customer.name = customerName;
            await order.customer.save();
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order details' });
    }
});

// Delete order (Admin Panel)
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;

// routes/userRoutes.js
import express from 'express';
const router = express.Router();

// Example route to get user data
router.get('/', (req, res) => {
    res.json({ message: 'Hello from the User route!' });
});

// Example route to create a user
router.post('/create', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    res.json({ message: `User ${name} created with email ${email}` });
});

export default router;

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import { db } from '../config/firebase.js';

const router = express.Router();

// Mock User Database
let users = [];

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        let userId;
        if (db) {
            const userRef = await db.collection('users').add(newUser);
            userId = userRef.id;
        } else {
            userId = Date.now().toString();
            users.push({ id: userId, ...newUser });
        }

        // Create JWT
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: userId, username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/auth/login - Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user;
        if (db) {
            const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
            if (!snapshot.empty) {
                user = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            }
        } else {
            user = users.find(u => u.email === email);
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/auth/profile - Get current user data
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        let user;
        if (db) {
            const doc = await db.collection('users').doc(req.user.id).get();
            if (doc.exists) {
                user = { id: doc.id, ...doc.data() };
            }
        } else {
            user = users.find(u => u.id === req.user.id);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;

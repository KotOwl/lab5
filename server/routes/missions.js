import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { db } from '../config/firebase.js';

const router = express.Router();

let mockMissions = [
    { id: '1', title: 'Moon Exploration', status: 'Active', startTime: new Date('2026-03-01T10:00:00Z').toISOString(), userId: 'user1' },
    { id: '2', title: 'Mars Settlement', status: 'Active', startTime: new Date('2026-03-02T12:00:00Z').toISOString(), userId: 'user1' }
];

// GET /api/missions - Get all missions sorted by startTime
router.get('/', async (req, res) => {
    try {
        if (db) {
            const snapshot = await db.collection('missions').orderBy('startTime').get();
            const missions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.json(missions);
        }

        const sortedMissions = [...mockMissions].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        res.json(sortedMissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching missions', error: error.message });
    }
});

// POST /api/missions - Create or Update a mission
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, status, startTime, id } = req.body;
        const missionData = {
            title,
            status: status || 'Active',
            startTime: startTime || new Date().toISOString(),
            userId: req.user.id,
            updatedAt: new Date().toISOString()
        };

        if (db) {
            if (id) {
                // Update
                await db.collection('missions').doc(id).set(missionData, { merge: true });
                return res.json({ id, ...missionData });
            } else {
                // Create
                const docRef = await db.collection('missions').add(missionData);
                return res.status(201).json({ id: docRef.id, ...missionData });
            }
        }

        if (id) {
            const index = mockMissions.findIndex(m => m.id === id);
            if (index !== -1) {
                mockMissions[index] = { ...mockMissions[index], ...missionData };
                return res.json(mockMissions[index]);
            }
        }

        const newMission = { id: Date.now().toString(), ...missionData };
        mockMissions.push(newMission);
        res.status(201).json(newMission);
    } catch (error) {
        res.status(500).json({ message: 'Error saving mission', error: error.message });
    }
});

export default router;

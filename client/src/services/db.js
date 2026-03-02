import { db } from '../firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    increment
} from 'firebase/firestore';

// Default initial missions if DB is empty
export const initialMissions = [
    { id: 1, title: 'Alpha Centauri Survey', type: 'research', difficulty: 'medium', target: 'Proxima b', reward: 5000, description: 'Conduct a comprehensive geological survey of the planetary surface.' },
    { id: 2, title: 'Distress Signal: Sector 7G', type: 'rescue', difficulty: 'hard', target: 'Asteroid Belt', reward: 12000, description: 'Respond to an automated distress beacon from a civilian mining vessel. Time critical.' },
    { id: 3, title: 'Titan Base Expansion', type: 'colonization', difficulty: 'easy', target: 'Titan', reward: 3500, description: 'Transport agricultural supplies and terraforming equipment to Outpost Delta.' },
    { id: 4, title: 'Nebula Gas Extraction', type: 'research', difficulty: 'hard', target: 'Orion Nebula', reward: 25000, description: 'Navigate dense particle fields to extract rare plasma isotopes.' },
    { id: 5, title: 'Evacuate Outpost 19', type: 'rescue', difficulty: 'medium', target: 'Mars Polar Cap', reward: 8000, description: 'Evacuate scientific personnel due to encroaching solar storm.' },
    { id: 6, title: 'Genesis Project Seed', type: 'colonization', difficulty: 'medium', target: 'Kepler-186f', reward: 15000, description: 'Deliver the first autonomous biosphere generator to the new colony.' }
];

export async function getShipStatus() {
    const shipRef = doc(db, 'ship', 'status');
    const shipSnap = await getDoc(shipRef);

    if (shipSnap.exists()) {
        return shipSnap.data();
    } else {
        // Default stats if none exist
        const defaultStats = {
            hull: 100,
            shields: 100,
            energy: 100,
            fuel: 100,
            status: 'Optimal'
        };
        await setDoc(shipRef, defaultStats);
        return defaultStats;
    }
}

export async function updateShipStatus(stats) {
    const shipRef = doc(db, 'ship', 'status');
    await setDoc(shipRef, stats, { merge: true });
}

export async function getMissions() {
    const missionsCol = collection(db, 'missions');
    const missionSnap = await getDocs(missionsCol);

    if (!missionSnap.empty) {
        return missionSnap.docs.map(doc => ({ ...doc.data(), fsId: doc.id }));
    } else {
        // Seed DB with initial missions
        for (const m of initialMissions) {
            await addDoc(missionsCol, m);
        }
        const newSnap = await getDocs(missionsCol);
        return newSnap.docs.map(doc => ({ ...doc.data(), fsId: doc.id }));
    }
}

export async function acceptMission(userId, mission) {
    if (!userId) throw new Error("User must be logged in to accept missions");

    const userMissionsCol = collection(db, `users/${userId}/acceptedMissions`);

    // Check if already accepted
    const q = query(userMissionsCol, where("id", "==", mission.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("Mission already accepted!");
    }

    await addDoc(userMissionsCol, {
        ...mission,
        acceptedAt: serverTimestamp(),
        status: 'in-progress'
    });
}

export async function getUserAcceptedMissions(userId) {
    if (!userId) return [];
    const userMissionsCol = collection(db, `users/${userId}/acceptedMissions`);
    const q = query(userMissionsCol, where("status", "==", "in-progress"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), fsId: doc.id }));
}

export async function completeUserMission(userId, missionFsId, reward) {
    if (!userId || !missionFsId) return;
    const missionRef = doc(db, `users/${userId}/acceptedMissions`, missionFsId);
    const userRef = doc(db, 'users', userId);

    await setDoc(missionRef, { status: 'completed', completedAt: serverTimestamp() }, { merge: true });

    if (reward) {
        await setDoc(userRef, {
            credits: increment(reward),
            missionsCompleted: increment(1)
        }, { merge: true });
    }
}

export async function abandonUserMission(userId, missionFsId) {
    if (!userId || !missionFsId) return;
    const missionRef = doc(db, `users/${userId}/acceptedMissions`, missionFsId);
    await setDoc(missionRef, { status: 'abandoned', abandonedAt: serverTimestamp() }, { merge: true });
}

export async function getUserTravelLog(userId) {
    if (!userId) return [];
    const userMissionsCol = collection(db, `users/${userId}/acceptedMissions`);
    const q = query(userMissionsCol, where("status", "==", "completed"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), fsId: doc.id }));
}

// Social Features
export async function getLeaderboard() {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('credits', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function sendChatMessage(userId, email, text) {
    if (!userId || !text) return;
    const chatCol = collection(db, 'subspace_chat');
    await addDoc(chatCol, {
        userId,
        email,
        text,
        timestamp: serverTimestamp()
    });
}

export function subscribeToChat(callback) {
    const chatCol = collection(db, 'subspace_chat');
    const q = query(chatCol, orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).reverse();
        callback(messages);
    });
}

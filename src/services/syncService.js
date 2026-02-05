import { db } from '../db/schema';
import { apiService } from './apiService';

export const syncService = {
    async syncToCloud() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            // 1. Sync Records
            const localRecords = await db.records.toArray();
            const cloudRecords = await apiService.getRecords();

            // Simple sync: push local records not in cloud
            // In a real app, we'd use timestamps/hashes
            for (const record of localRecords) {
                const exists = cloudRecords.find(cr => cr.name === record.name && cr.date === record.date);
                if (!exists) {
                    await apiService.uploadRecord(record);
                }
            }

            // 2. Sync Vitals
            const localVitals = await db.vitals.toArray();
            const cloudVitals = await apiService.getVitals();
            for (const vital of localVitals) {
                const exists = cloudVitals.find(cv => cv.timestamp === vital.timestamp);
                if (!exists) {
                    await apiService.addVital(vital);
                }
            }

            // 3. Sync Reminders
            const localReminders = await db.reminders.toArray();
            const cloudReminders = await apiService.getReminders();
            for (const rem of localReminders) {
                const exists = cloudReminders.find(cr => cr.medicineName === rem.medicineName);
                if (!exists) {
                    await apiService.addReminder(rem);
                }
            }

            console.log('Sync completed successfully');
        } catch (error) {
            console.error('Sync failed:', error);
        }
    },

    async pullFromCloud() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            const cloudRecords = await apiService.getRecords();
            for (const record of cloudRecords) {
                const exists = await db.records.where('name').equals(record.name).first();
                if (!exists) {
                    const { _id: _id_unused, user: user_unused, __v: v_unused, createdAt: ca_unused, ...cleanRecord } = record;
                    await db.records.add(cleanRecord);
                }
            }

            const cloudVitals = await apiService.getVitals();
            for (const vital of cloudVitals) {
                const exists = await db.vitals.where('timestamp').equals(vital.timestamp).first();
                if (!exists) {
                    const { _id: _id_unused, user: user_unused, __v: v_unused, createdAt: ca_unused, ...cleanVital } = vital;
                    await db.vitals.add(cleanVital);
                }
            }

            const cloudReminders = await apiService.getReminders();
            for (const rem of cloudReminders) {
                const exists = await db.reminders.where('medicineName').equals(rem.medicineName).first();
                if (!exists) {
                    const { _id: _id_unused, user: user_unused, __v: v_unused, createdAt: ca_unused, ...cleanRem } = rem;
                    await db.reminders.add(cleanRem);
                }
            }
        } catch (error) {
            console.error('Pull failed:', error);
        }
    }
};

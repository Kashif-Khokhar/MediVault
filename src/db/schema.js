import Dexie from 'dexie';

export const db = new Dexie('MediVaultDB');

db.version(1).stores({
    records: '++id, name, type, category, doctor, hospital, date, encryptedData, iv, salt',
    vitals: '++id, type, value, unit, timestamp',
    reminders: '++id, medicineName, dosage, frequency, nextDose, isActive',
    settings: 'key, value' // Passcode (hashed), recoveryKey (encrypted), etc.
});

export const CATEGORIES = {
    PRESCRIPTION: 'Prescriptions',
    LAB_REPORT: 'Lab Reports',
    IMAGING: 'Imaging (X-Rays/MRI)',
    VACCINATION: 'Vaccinations',
    OTHER: 'Other'
};

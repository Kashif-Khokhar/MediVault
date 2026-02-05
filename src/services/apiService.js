const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
    };
};

export const apiService = {
    // Auth
    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    async register(email, password) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Registration failed');
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    // Records
    async getRecords() {
        const res = await fetch(`${API_URL}/records`, { headers: getHeaders() });
        return res.json();
    },

    async uploadRecord(record) {
        const res = await fetch(`${API_URL}/records`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(record)
        });
        return res.json();
    },

    async deleteRecord(id) {
        const res = await fetch(`${API_URL}/records/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.json();
    },

    // Vitals
    async getVitals() {
        const res = await fetch(`${API_URL}/vitals`, { headers: getHeaders() });
        return res.json();
    },

    async addVital(vital) {
        const res = await fetch(`${API_URL}/vitals`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(vital)
        });
        return res.json();
    },

    // Reminders
    async getReminders() {
        const res = await fetch(`${API_URL}/reminders`, { headers: getHeaders() });
        return res.json();
    },

    async addReminder(reminder) {
        const res = await fetch(`${API_URL}/reminders`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(reminder)
        });
        return res.json();
    }
};

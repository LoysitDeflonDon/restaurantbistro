const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Создание таблиц при запуске
(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            guests INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
    console.log('✅ Tables ready');
})();

app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
            [name, email, phone, hashed]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(400).json({ error: 'Email уже существует' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Неверный email' });
    const match = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Неверный пароль' });
    const { password_hash, ...user } = result.rows[0];
    res.json({ success: true, user });
});

app.post('/api/book', async (req, res) => {
    const { userId, name, phone, date, time, guests } = req.body;
    await pool.query(
        'INSERT INTO bookings (user_id, name, phone, date, time, guests) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, name, phone, date, time, guests]
    );
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

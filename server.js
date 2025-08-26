const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// Create users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gender TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        country TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle user registration
app.post('/register', (req, res) => {
    const { name, gender, email, country } = req.body;
    
    // Validation
    if (!name || !gender || !email || !country) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Insert user into database
    const stmt = db.prepare(`INSERT INTO users (name, gender, email, country) VALUES (?, ?, ?, ?)`);
    
    stmt.run([name, gender, email, country], function(err) {
        if (err) {
            console.error('Database error:', err);
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ error: 'Email already registered' });
            }
            return res.status(500).json({ error: 'Database error occurred' });
        }
        
        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: this.lastID 
        });
    });
    
    stmt.finalize();
});

// Get all registered users (for testing purposes)
app.get('/users', (req, res) => {
    db.all(`SELECT id, name, gender, email, country, created_at FROM users ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        res.json(rows);
    });
});

// Get user count
app.get('/users/count', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        res.json({ count: row.count });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Registration form is ready!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
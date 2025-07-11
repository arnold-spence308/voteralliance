const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'voteralliance',
    password: '1@Chinchin234',
    port: 5432,
});

// Signup API endpoint
app.post('/api/signup', async (req, res) => {
    const { name, address1, address2, zipcode, age, email, username, password } = req.body;

    try {
        const query = `
            INSERT INTO users (name, address1, address2, zipcode, age, email, username, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [name, address1, address2, zipcode, age, email, username, password];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while creating the user' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});// JavaScript source code

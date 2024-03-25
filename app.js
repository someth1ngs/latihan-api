const express = require("express");
const { Pool } = require('pg');
const app = express();
const port = 3000;
const pool = new Pool({
    host: 'localhost',
    database: 'latihan_api',
    user: 'postgres',
    password: '12345',
    port: 5432,
});

app.use(express.json());

app.get('/tasks', async (req, res, next) => {
    try {
        let task = await pool.query('SELECT * FROM tasks');
        res.json(task.rows);
    } catch (err) {
        next(err);
    }
});

app.get('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        let task = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        res.json(task.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.post('/tasks', async (req, res, next) => {
    const { description, deadline, priority, is_completed } = req.body;
    try {
        const newTask = await pool.query('INSERT INTO tasks (description, deadline, priority, is_completed) VALUES ($1, $2, $3, $4)', [description, deadline, priority, is_completed]);
        res.json(newTask.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.put('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    const { description, deadline, priority, is_completed } = req.body;
    try {
        const updatedTask = await pool.query('UPDATE tasks SET description = $1, deadline = $2, priority = $3, is_completed = $4 WHERE id = $5 RETURNING *', [description, deadline, priority, is_completed, id]);
        res.json(updatedTask.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.delete('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const deletedTask = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
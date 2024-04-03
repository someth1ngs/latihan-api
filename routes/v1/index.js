const router = require('express').Router();
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'latihan_api',
    user: 'postgres',
    password: '12345',
    port: 5432,
});

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/tasks/create', (req, res) => {
    res.render('tasks/create');
})

router.get('/tasks', async (req, res, next) => {
    let keyword = req.query.keyword;

    let psqlQuery =  `SELECT * FROM tasks`

    if (keyword) {
        psqlQuery += ` WHERE description LIKE '%${keyword}%' OR deadline LIKE '%${keyword}%'`
    }
    try {
        let task = await pool.query(psqlQuery);
        res.json(task.rows);
    } catch (err) {
        next(err);
    }
});

router.get('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        let task = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (task.rows.length == 0) {
            return res.status(404).json({
                status: false,
                message: `Tidak dapat ditemukan untuk id ${id}`
            });
        }

        res.status(200).json({
            status: true,
            message: 'Data berhasil dicari',
            data: task.rowCount
        })
    } catch (err) {
        next(err);
    }
});

router.post('/tasks', async (req, res, next) => {
    const description = req.body.description;
    const deadline = req.body.deadline;
    const priority = req.body.priority;
    const is_completed = req.body.is_completed;
    try {
        if (!description || !deadline || !priority) {
            return res.status(400).json({
                status: false,
                message: `Semua data harus terisi`
            })
        }
        const newTask = await pool.query('INSERT INTO tasks (description, deadline, priority, is_completed) VALUES ($1, $2, $3, $4) RETURNING *', [description, deadline, priority, is_completed]);
        res.json(newTask.rowCount)
    } catch (err) {
        next(err);
    }
});

router.put('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    const { description, deadline, priority, is_completed } = req.body;
    try {
        const updatedTask = await pool.query('UPDATE tasks SET description = $1, deadline = $2, priority = $3, is_completed = $4 WHERE id = $5 RETURNING *', [description, deadline, priority, is_completed, id]);
        res.json(updatedTask.rows[0]);
    } catch (err) {
        next(err);
    }
});

router.delete('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const deletedTask = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
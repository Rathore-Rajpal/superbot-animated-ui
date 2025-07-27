require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: 'sql12.freesqldatabase.com',
  user: 'sql12791893',
  password: '3ALYm8PAgb',
  database: 'sql12791893',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testConnection();

// Routes for TASKS
// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM task ORDER BY due_date ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  const { title, status, due_date, priority } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO task (title, status, due_date, priority) VALUES (?, ?, ?, ?)',
      [title, status, due_date, priority]
    );
    res.status(201).json({ id: result.insertId, title, status, due_date, priority });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Error adding task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, due_date, priority } = req.body;
  try {
    await pool.query(
      'UPDATE task SET title = ?, status = ?, due_date = ?, priority = ? WHERE id = ?',
      [title, status, due_date, priority, id]
    );
    res.json({ id, title, status, due_date, priority });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM task WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Routes for FINANCE
// Get all finance records
app.get('/api/finances', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Executing finance query...');
    
    // Get the raw data from the database
    const [rows] = await connection.query('SELECT * FROM finance ORDER BY date DESC');
    console.log('Finance query successful, rows:', rows.length);
    
    // Log the first row to check data types
    if (rows.length > 0) {
      console.log('Sample finance row:', JSON.stringify({
        id: rows[0].id,
        type: rows[0].type,
        amount: rows[0].amount,
        description: rows[0].description,
        date: rows[0].date,
        category: rows[0].category
      }));
    }
    
    // Ensure proper serialization of decimal values
    const serializedRows = rows.map(row => ({
      id: row.id,
      type: row.type,
      amount: row.amount ? parseFloat(row.amount) : null,
      description: row.description || '',
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
      category: row.category || ''
    }));
    
    res.json(serializedRows);
  } catch (error) {
    console.error('Error in /api/finances:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Error fetching finance records',
      details: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
  } finally {
    if (connection) {
      await connection.release();
      console.log('Database connection released');
    }
  }
});

// Add a new finance record
app.post('/api/finances', async (req, res) => {
  const { description, amount, type, date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO finance (description, amount, type, date) VALUES (?, ?, ?, ?)',
      [description, amount, type, date]
    );
    res.status(201).json({ id: result.insertId, description, amount, type, date });
  } catch (error) {
    console.error('Error adding finance record:', error);
    res.status(500).json({ error: 'Error adding finance record' });
  }
});

// Update a finance record
app.put('/api/finances/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, date } = req.body;
  try {
    await pool.query(
      'UPDATE finance SET description = ?, amount = ?, type = ?, date = ? WHERE id = ?',
      [description, amount, type, date, id]
    );
    res.json({ id, description, amount, type, date });
  } catch (error) {
    console.error('Error updating finance record:', error);
    res.status(500).json({ error: 'Error updating finance record' });
  }
});

// Delete a finance record
app.delete('/api/finances/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM finance WHERE id = ?', [id]);
    res.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting finance record:', error);
    res.status(500).json({ error: 'Error deleting finance record' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

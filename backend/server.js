const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DB_USER || 'sql12791893',
  password: process.env.DB_PASSWORD || '3ALYm8PAgb',
  database: process.env.DB_NAME || 'sql12791893',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 2,
  queueLimit: 0
};

console.log('🔧 Database Config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables and sample data
const initializeTables = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create task table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS task (
        id INT(11) NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        status ENUM('pending','in_progress','completed') NOT NULL,
        due_date DATE DEFAULT NULL,
        priority INT(11) DEFAULT NULL,
        assigned_to VARCHAR(100) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    `);
    
    // Create finance table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS finance (
        id INT(11) NOT NULL AUTO_INCREMENT,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type ENUM('income','expense') NOT NULL,
        date DATE DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    `);
    
    console.log('✅ Database tables initialized');
    
    // Check if we need to insert sample data
    const [taskCount] = await connection.query('SELECT COUNT(*) as count FROM task');
    const [financeCount] = await connection.query('SELECT COUNT(*) as count FROM finance');
    
    if (taskCount[0].count === 0) {
      // Insert sample tasks
      await connection.query(`
        INSERT INTO task (title, status, due_date, priority, assigned_to) VALUES 
        ('Complete project documentation', 'in_progress', '2024-02-15', 3, 'John Doe'),
        ('Review code changes', 'pending', '2024-02-10', 2, 'Jane Smith'),
        ('Deploy to production', 'completed', '2024-02-05', 1, 'Mike Johnson'),
        ('Update user interface', 'pending', '2024-02-20', 4, 'Sarah Wilson')
      `);
      console.log('✅ Sample tasks inserted');
    }
    
    if (financeCount[0].count === 0) {
      // Insert sample finance records
      await connection.query(`
        INSERT INTO finance (description, amount, type, date) VALUES 
        ('Salary payment', 5000.00, 'income', '2024-02-01'),
        ('Office rent', 1200.00, 'expense', '2024-02-01'),
        ('Freelance project', 1500.00, 'income', '2024-02-05'),
        ('Software subscription', 99.00, 'expense', '2024-02-03'),
        ('Client payment', 3000.00, 'income', '2024-02-10'),
        ('Marketing expenses', 500.00, 'expense', '2024-02-08')
      `);
      console.log('✅ Sample finance records inserted');
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Table initialization failed:', error.message);
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      host: dbConfig.host,
      database: dbConfig.database,
      connected: true
    }
  });
});

// Task endpoints
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM task ORDER BY id DESC');
    console.log(`📋 Fetched ${rows.length} tasks`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, status, due_date, priority, assigned_to } = req.body;
    const [result] = await pool.query(
      'INSERT INTO task (title, status, due_date, priority, assigned_to) VALUES (?, ?, ?, ?, ?)',
      [title, status || 'pending', due_date, priority, assigned_to]
    );
    
    const [newTask] = await pool.query('SELECT * FROM task WHERE id = ?', [result.insertId]);
    console.log(`✅ Created task: ${title}`);
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, status, due_date, priority, assigned_to } = req.body;
    const { id } = req.params;
    
    await pool.query(
      'UPDATE task SET title = ?, status = ?, due_date = ?, priority = ?, assigned_to = ? WHERE id = ?',
      [title, status, due_date, priority, assigned_to, id]
    );
    
    const [updatedTask] = await pool.query('SELECT * FROM task WHERE id = ?', [id]);
    console.log(`✅ Updated task: ${title}`);
    res.json(updatedTask[0]);
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM task WHERE id = ?', [id]);
    console.log(`✅ Deleted task ID: ${id}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

// Finance endpoints
app.get('/api/finances', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM finance ORDER BY id DESC');
    console.log(`💰 Fetched ${rows.length} finance records`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching finances:', error);
    res.status(500).json({ error: 'Failed to fetch finances', details: error.message });
  }
});

app.post('/api/finances', async (req, res) => {
  try {
    const { description, amount, type, date } = req.body;
    const [result] = await pool.query(
      'INSERT INTO finance (description, amount, type, date) VALUES (?, ?, ?, ?)',
      [description, amount, type, date]
    );
    
    const [newFinance] = await pool.query('SELECT * FROM finance WHERE id = ?', [result.insertId]);
    console.log(`✅ Created finance record: ${description}`);
    res.status(201).json(newFinance[0]);
  } catch (error) {
    console.error('❌ Error creating finance record:', error);
    res.status(500).json({ error: 'Failed to create finance record', details: error.message });
  }
});

app.put('/api/finances/:id', async (req, res) => {
  try {
    const { description, amount, type, date } = req.body;
    const { id } = req.params;
    
    await pool.query(
      'UPDATE finance SET description = ?, amount = ?, type = ?, date = ? WHERE id = ?',
      [description, amount, type, date, id]
    );
    
    const [updatedFinance] = await pool.query('SELECT * FROM finance WHERE id = ?', [id]);
    console.log(`✅ Updated finance record: ${description}`);
    res.json(updatedFinance[0]);
  } catch (error) {
    console.error('❌ Error updating finance record:', error);
    res.status(500).json({ error: 'Failed to update finance record', details: error.message });
  }
});

app.delete('/api/finances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM finance WHERE id = ?', [id]);
    console.log(`✅ Deleted finance record ID: ${id}`);
    res.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting finance record:', error);
    res.status(500).json({ error: 'Failed to delete finance record', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    await initializeTables();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

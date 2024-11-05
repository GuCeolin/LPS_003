const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'student_coin_system'
};

// Função para criar conexão com o banco de dados
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Middleware de validação de acesso
async function validateAccess(req, res, next) {
  const { username, password } = req.body;
  console.log('Tentativa de login:', { username, password }); // Log de depuração

  const conn = await getConnection();
  try {
    const [rows] = await conn.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('Resultado da consulta:', rows); // Log de depuração

    if (rows.length === 0) {
      console.log('Usuário não encontrado'); // Log de depuração
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    console.log('Senha armazenada:', user.password); // Log de depuração
    console.log('Senha fornecida:', password); // Log de depuração

    if (password !== user.password) {
      console.log('Senha incorreta'); // Log de depuração
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login bem-sucedido'); // Log de depuração
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await conn.end();
  }
}

// Rota de login
app.post('/api/login', validateAccess, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});


// Rota para obter lista de alunos
app.get('/api/students', async (req, res) => {
  const conn = await getConnection();
  try {
    const [rows] = await conn.execute('SELECT id, username FROM users WHERE type = "student"');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await conn.end();
  }
});

// Rota para obter saldo de moedas do aluno
app.get('/api/coins/:studentId', async (req, res) => {
  const conn = await getConnection();
  try {
    const [rows] = await conn.execute('SELECT coins FROM users WHERE id = ? AND type = "student"', [req.params.studentId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ coins: rows[0].coins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await conn.end();
  }
});

// Rota para obter transações do aluno
app.get('/api/transactions/:studentId', async (req, res) => {
  const conn = await getConnection();
  try {
    const [rows] = await conn.execute('SELECT * FROM transactions WHERE student_id = ? ORDER BY date DESC', [req.params.studentId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await conn.end();
  }
});

// Rota para enviar moedas (apenas professores)
app.post('/api/send-coins', validateAccess, async (req, res) => {
  const { studentId, amount } = req.body;
  if (req.user.type !== 'professor') {
    return res.status(403).json({ error: 'Only professors can send coins' });
  }

  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // Atualizar saldo do aluno
    const [updateResult] = await conn.execute('UPDATE users SET coins = coins + ? WHERE id = ? AND type = "student"', [amount, studentId]);
    if (updateResult.affectedRows === 0) {
      throw new Error('Student not found');
    }

    // Registrar transação
    await conn.execute('INSERT INTO transactions (student_id, amount, description) VALUES (?, ?, ?)', 
      [studentId, amount, `Received ${amount} coins from professor ${req.user.username}`]);

    // Obter novo saldo
    const [newBalanceRows] = await conn.execute('SELECT coins FROM users WHERE id = ?', [studentId]);

    await conn.commit();
    res.json({ success: true, newBalance: newBalanceRows[0].coins });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    await conn.end();
  }
});

// Servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
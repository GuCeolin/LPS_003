const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sistema_merito',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuario = rows[0];

    if (await bcrypt.compare(senha, usuario.senha)) {
      res.json({ id: usuario.id, tipo: usuario.tipo });
    } else {
      res.status(400).json({ mensagem: 'Senha incorreta' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

// Rota para cadastro de aluno
app.post('/cadastro/aluno', async (req, res) => {
  const { nome, email, senha, cpf, rg, endereco, instituicao_id, curso } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    await pool.query('START TRANSACTION');

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hashedSenha, 'aluno']
    );

    const usuario_id = result.insertId;

    await pool.query(
      'INSERT INTO alunos (usuario_id, cpf, rg, endereco, instituicao_id, curso) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id, cpf, rg, endereco, instituicao_id, curso]
    );

    await pool.query('COMMIT');

    res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro no cadastro do aluno' });
  }
});

// Rota para cadastro de professor
app.post('/cadastro/professor', async (req, res) => {
  const { nome, email, senha, cpf, instituicao_id, departamento } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    await pool.query('START TRANSACTION');

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hashedSenha, 'professor']
    );

    const usuario_id = result.insertId;

    await pool.query(
      'INSERT INTO professores (usuario_id, cpf, instituicao_id, departamento) VALUES (?, ?, ?, ?)',
      [usuario_id, cpf, instituicao_id, departamento]
    );

    await pool.query('COMMIT');

    res.status(201).json({ mensagem: 'Professor cadastrado com sucesso' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro no cadastro do professor' });
  }
});

// Rota para cadastro de empresa
app.post('/cadastro/empresa', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    await pool.query('START TRANSACTION');

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hashedSenha, 'empresa']
    );

    const usuario_id = result.insertId;

    await pool.query('INSERT INTO empresas (usuario_id) VALUES (?)', [usuario_id]);

    await pool.query('COMMIT');

    res.status(201).json({ mensagem: 'Empresa cadastrada com sucesso' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro no cadastro da empresa' });
  }
});

// Rota para enviar moedas (professor para aluno)
app.post('/enviar-moedas', async (req, res) => {
  const { professor_id, aluno_id, quantidade, motivo } = req.body;

  try {
    await pool.query('START TRANSACTION');

    const [professor] = await pool.query('SELECT saldo_moedas FROM professores WHERE usuario_id = ?', [professor_id]);

    if (professor[0].saldo_moedas < quantidade) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ mensagem: 'Saldo insuficiente' });
    }

    await pool.query('UPDATE professores SET saldo_moedas = saldo_moedas - ? WHERE usuario_id = ?', [quantidade, professor_id]);
    await pool.query('UPDATE alunos SET saldo_moedas = saldo_moedas + ? WHERE usuario_id = ?', [quantidade, aluno_id]);

    await pool.query(
      'INSERT INTO transacoes (remetente_id, destinatario_id, quantidade_moedas, motivo) VALUES (?, ?, ?, ?)',
      [professor_id, aluno_id, quantidade, motivo]
    );

    await pool.query('COMMIT');

    res.json({ mensagem: 'Moedas enviadas com sucesso' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao enviar moedas' });
  }
});

// Rota para consultar extrato
app.get('/extrato/:usuario_id', async (req, res) => {
  const usuario_id = req.params.usuario_id;

  try {
    const [usuario] = await pool.query('SELECT tipo FROM usuarios WHERE id = ?', [usuario_id]);
    
    if (usuario.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    let saldo, transacoes;

    if (usuario[0].tipo === 'aluno') {
      [saldo] = await pool.query('SELECT saldo_moedas FROM alunos WHERE usuario_id = ?', [usuario_id]);
      [transacoes] = await pool.query('SELECT * FROM transacoes WHERE destinatario_id = ? OR remetente_id = ?', [usuario_id, usuario_id]);
    } else if (usuario[0].tipo === 'professor') {
      [saldo] = await pool.query('SELECT saldo_moedas FROM professores WHERE usuario_id = ?', [usuario_id]);
      [transacoes] = await pool.query('SELECT * FROM transacoes WHERE remetente_id = ?', [usuario_id]);
    } else {
      return res.status(400).json({ mensagem: 'Tipo de usuário inválido' });
    }

    res.json({ saldo: saldo[0].saldo_moedas, transacoes });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao consultar extrato' });
  }
});

// Rota para cadastrar vantagem (empresa)
app.post('/cadastrar-vantagem', async (req, res) => {
  const { empresa_id, nome, descricao, custo_moedas, foto_url } = req.body;

  try {
    await pool.query(
      'INSERT INTO vantagens (empresa_id, nome, descricao, custo_moedas, foto_url) VALUES (?, ?, ?, ?, ?)',
      [empresa_id, nome, descricao, custo_moedas, foto_url]
    );

    res.status(201).json({ mensagem: 'Vantagem cadastrada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar vantagem' });
  }
});

// Rota para listar vantagens disponíveis
app.get('/vantagens', async (req, res) => {
  try {
    const [vantagens] = await pool.query('SELECT * FROM vantagens');
    res.json(vantagens);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar vantagens' });
  }
});

// Rota para resgatar vantagem
app.post('/resgatar-vantagem', async (req, res) => {
  const { aluno_id, vantagem_id } = req.body;

  try {
    await pool.query('START TRANSACTION');

    const [vantagem] = await pool.query('SELECT * FROM vantagens WHERE id = ?', [vantagem_id]);
    const [aluno] = await pool.query('SELECT saldo_moedas FROM alunos WHERE usuario_id = ?', [aluno_id]);

    if (aluno[0].saldo_moedas < vantagem[0].custo_moedas) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ mensagem: 'Saldo insuficiente' });
    }

    const codigo_cupom = Math.random().toString(36).substring(7);

    await pool.query('UPDATE alunos SET saldo_moedas = saldo_moedas - ? WHERE usuario_id = ?', [vantagem[0].custo_moedas, aluno_id]);
    await pool.query('INSERT INTO resgates (aluno_id, vantagem_id, codigo_cupom) VALUES (?, ?, ?)', [aluno_id, vantagem_id, codigo_cupom]);

    await pool.query('COMMIT');

    res.json({ mensagem: 'Vantagem resgatada com sucesso', codigo_cupom });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao resgatar vantagem' });
  }
});

// Rota para listar alunos (para o professor selecionar ao enviar moedas)
app.get('/alunos', async (req, res) => {
  try {
    const [alunos] = await pool.query('SELECT u.id, u.nome FROM usuarios u JOIN alunos a ON u.id = a.usuario_id');
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar alunos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
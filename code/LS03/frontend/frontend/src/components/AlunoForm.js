import React, { useState } from 'react';
import api from '../api';

function AlunoForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/alunos', { nome, email, curso });
    setNome('');
    setEmail('');
    setCurso('');
  };

  return (
    <div>
      <h2>Cadastrar Aluno</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Curso:</label>
          <input value={curso} onChange={(e) => setCurso(e.target.value)} />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default AlunoForm;

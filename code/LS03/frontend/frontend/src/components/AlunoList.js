import React, { useState, useEffect } from 'react';
import api from '../api';

function AlunoList() {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    loadAlunos();
  }, []);

  const loadAlunos = async () => {
    const response = await api.get('/alunos');
    setAlunos(response.data);
  };

  const deleteAluno = async (id) => {
    await api.delete(`/alunos/${id}`);
    loadAlunos();
  };

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <ul>
        {alunos.map((aluno) => (
          <li key={aluno.id}>
            {aluno.nome} - {aluno.email} - {aluno.curso}
            <button onClick={() => deleteAluno(aluno.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlunoList;

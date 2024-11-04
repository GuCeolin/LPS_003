import React, { useEffect, useState } from 'react';

import api from './api';

function AlunoList() {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alunos/${id}`);
      fetchAlunos(); // Atualiza a lista após deletar
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <ul>
        {alunos.map(aluno => (
          <li key={aluno.id}>
            {aluno.nome} - {aluno.curso}
            <button onClick={() => handleDelete(aluno.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlunoList;

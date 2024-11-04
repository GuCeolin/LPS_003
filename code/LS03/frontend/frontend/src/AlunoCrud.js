import React, { useState, useEffect } from 'react';
import AlunoForm from './components/AlunoForm';
import AlunoList from './components/AlunoList';
import api from './api'; // Certifique-se de que o axios está configurado corretamente

function AlunoCrud() {
  const [alunos, setAlunos] = useState([]);

  // Função para buscar alunos
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

  // Função para criar novo aluno
  const createAluno = async (novoAluno) => {
    try {
      await api.post('/alunos', novoAluno);
      fetchAlunos(); // Atualiza a lista após adicionar
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
    }
  };

  // Função para deletar um aluno
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
      <h2>Gerenciamento de Alunos</h2>
      <AlunoForm createAluno={createAluno} />
      <AlunoList alunos={alunos} handleDelete={handleDelete} />
    </div>
  );
}

export default AlunoCrud;

import React, { useState } from 'react';
import api from '../api';

function EmpresaForm() {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [setor, setSetor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/empresas', { nome, cnpj, setor });
    setNome('');
    setCnpj('');
    setSetor('');
  };

  return (
    <div>
      <h2>Cadastrar Empresa Parceira</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div>
          <label>CNPJ:</label>
          <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
        </div>
        <div>
          <label>Setor:</label>
          <input value={setor} onChange={(e) => setSetor(e.target.value)} />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default EmpresaForm;

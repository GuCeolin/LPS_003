import React, { useState, useEffect } from 'react';
import api from '../api';

function EmpresaList() {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    const response = await api.get('/empresas');
    setEmpresas(response.data);
  };

  const deleteEmpresa = async (id) => {
    await api.delete(`/empresas/${id}`);
    loadEmpresas();
  };

  return (
    <div>
      <h2>Lista de Empresas Parceiras</h2>
      <ul>
        {empresas.map((empresa) => (
          <li key={empresa.id}>
            {empresa.nome} - {empresa.cnpj} - {empresa.setor}
            <button onClick={() => deleteEmpresa(empresa.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmpresaList;

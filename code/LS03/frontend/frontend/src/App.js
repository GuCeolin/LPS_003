import React from 'react';
import AlunoList from './components/AlunoList';
import AlunoForm from './components/AlunoForm';
import EmpresaList from './components/EmpresaList';
import EmpresaForm from './components/EmpresaForm';

function App() {
  return (
    <div>
      <h1>Sistema de Alunos e Empresas Parceiras</h1>
      <AlunoForm />
      <AlunoList />
      <hr />
      <EmpresaForm />
      <EmpresaList />
    </div>
  );
}

export default App;

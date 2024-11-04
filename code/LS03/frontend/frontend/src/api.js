import axios from 'axios';

// Cria uma instância do Axios para configurar a base URL da API
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Altere para a URL correta do seu back-end Spring Boot
});

// Exporta a instância para ser usada em outros arquivos
export default api;

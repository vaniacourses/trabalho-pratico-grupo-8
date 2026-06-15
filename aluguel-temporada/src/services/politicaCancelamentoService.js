import axios from "axios";

const API_URL = "http://localhost:3001/politicasCancelamento";

const politicaCancelamentoService = {
  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  criar: async (politica) => {
    const response = await axios.post(API_URL, politica);
    return response.data;
  },

  atualizar: async (id, politica) => {
    const response = await axios.put(`${API_URL}/${id}`, politica);
    return response.data;
  },

  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default politicaCancelamentoService;

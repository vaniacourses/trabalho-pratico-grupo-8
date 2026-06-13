import axios from "axios";

const API_URL = "http://localhost:3001/imoveis";

const imovelService = {
  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  criar: async (imovel) => {
    const response = await axios.post(API_URL, imovel);
    return response.data;
  },

  atualizar: async (id, imovel) => {
    const response = await axios.put(`${API_URL}/${id}`, imovel);
    return response.data;
  },

  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default imovelService;
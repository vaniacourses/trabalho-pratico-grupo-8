import axios from "axios";

const API_URL = "http://localhost:3001/fotos";

const fotoService = {
  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  listarPorImovel: async (idImovel) => {
    const response = await axios.get(`${API_URL}?idImovel=${idImovel}`);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  criar: async (foto) => {
    const response = await axios.post(API_URL, foto);
    return response.data;
  },

  atualizar: async (id, foto) => {
    const response = await axios.put(`${API_URL}/${id}`, foto);
    return response.data;
  },

  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default fotoService;
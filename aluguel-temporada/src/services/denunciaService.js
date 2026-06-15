import axios from "axios";


const API_URL = "http://localhost:3001/denuncias";

const denunciaService = {

  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  criar: async (denuncia) => {
    const response = await axios.post(API_URL, denuncia);
    return response.data;
  },

  atualizar: async (id, denuncia) => {
    const response = await axios.put(`${API_URL}/${id}`, denuncia);
    return response.data;
  },

  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

};

export default denunciaService;
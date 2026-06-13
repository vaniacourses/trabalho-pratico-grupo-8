import axios from "axios";

const API_URL = "http://localhost:3001/usuarios";

const usuarioService = {
  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  criar: async (usuario) => {
    const response = await axios.post(API_URL, usuario);
    return response.data;
  },
  atualizar: async (id, usuario) => {
    const response = await axios.put(`${API_URL}/${id}`, usuario);
    return response.data;
  },
  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default usuarioService;
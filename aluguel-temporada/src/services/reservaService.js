import axios from "axios";

const API_URL = "http://localhost:3001/reservas";

const reservaService = {
  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  listarPorImovel: async (idImovel) => {
    const response = await axios.get(`${API_URL}?idImovel=${idImovel}`);
    return response.data;
  },

  listarPorHospede: async (idHospede) => {
    const response = await axios.get(`${API_URL}?idHospede=${idHospede}`);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  criar: async (reserva) => {
    const response = await axios.post(API_URL, reserva);
    return response.data;
  },

  atualizar: async (id, reserva) => {
    const response = await axios.put(`${API_URL}/${id}`, reserva);
    return response.data;
  },

  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default reservaService;

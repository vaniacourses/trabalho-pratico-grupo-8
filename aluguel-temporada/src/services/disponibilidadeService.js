import axios from "axios";

const API_URL = "http://localhost:3001/disponibilidades";

const disponibilidadeService = {
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

  criar: async (disponibilidade) => {
    const response = await axios.post(API_URL, disponibilidade);
    return response.data;
  },

  atualizar: async (id, disponibilidade) => {
    const response = await axios.put(`${API_URL}/${id}`, disponibilidade);
    return response.data;
  },

  excluir: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  verificarSobreposicao: (periodos, dataInicio, dataFim, idIgnorar = null) => {
    return periodos.some((p) => {
      if (idIgnorar && p.id === idIgnorar) return false;
      const inicio = new Date(p.dataInicio);
      const fim = new Date(p.dataFim);
      return dataInicio < fim && dataFim > inicio;
    });
  },
};

export default disponibilidadeService;
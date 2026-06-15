import axios from "axios";

const API_IMOVEL  = "http://localhost:3001/avaliacoes_imovel";
const API_HOSPEDE = "http://localhost:3001/avaliacoes_hospede";

const avaliacaoService = {

  // Avaliações do imóvel (hóspede que avalia)

  listarPorImovel: async (imovelId) => {
    const response = await axios.get(`${API_IMOVEL}?imovelId=${imovelId}`);
    return response.data;
  },

  buscarAvaliacaoImovelPorId: async (id) => {
    const response = await axios.get(`${API_IMOVEL}/${id}`);
    return response.data;
  },

  criarAvaliacaoImovel: async (avaliacao) => {
    const response = await axios.post(API_IMOVEL, avaliacao);
    return response.data;
  },

  atualizarAvaliacaoImovel: async (id, avaliacao) => {
    const response = await axios.put(`${API_IMOVEL}/${id}`, avaliacao);
    return response.data;
  },

  excluirAvaliacaoImovel: async (id) => {
    await axios.delete(`${API_IMOVEL}/${id}`);
  },

  // Avaliações do hóspede (anfitrião que avalia) 

  listarPorHospede: async (hospedeId) => {
    const response = await axios.get(`${API_HOSPEDE}?hospedeId=${hospedeId}`);
    return response.data;
  },

  buscarAvaliacaoHospedePorId: async (id) => {
    const response = await axios.get(`${API_HOSPEDE}/${id}`);
    return response.data;
  },

  criarAvaliacaoHospede: async (avaliacao) => {
    const response = await axios.post(API_HOSPEDE, avaliacao);
    return response.data;
  },

  atualizarAvaliacaoHospede: async (id, avaliacao) => {
    const response = await axios.put(`${API_HOSPEDE}/${id}`, avaliacao);
    return response.data;
  },

  excluirAvaliacaoHospede: async (id) => {
    await axios.delete(`${API_HOSPEDE}/${id}`);
  },

};

export default avaliacaoService
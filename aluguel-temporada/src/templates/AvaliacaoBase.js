import avaliacaoService from "../services/avaliacaoService";

class AvaliacaoBase {

  constructor(dados, navigate) {
    this.dados = dados;
    this.navigate = navigate;
  }

  async executar() {
    this.verificarElegibilidade();
    this.registrarNota();
    this.registrarComentario();
    await this.salvar();
    this.atualizarPerfil();
    this.redirecionar();
  }

  verificarElegibilidade() {
    throw new Error("Implemente verificarElegibilidade()");
  }

  registrarNota() {
    throw new Error("Implemente registrarNota()");
  }

  // Valida o comentário que o usuário escreveu
  // ex: comentário obrigatório, mínimo de caracteres
  registrarComentario() {
    throw new Error("Implemente registrarComentario()");
  }

  // Salva no banco — cada filho chama o service certo
  // ex: hóspede chama criarAvaliacaoImovel
  //     anfitrião chama criarAvaliacaoHospede
  async salvar() {
    throw new Error("Implemente salvar()");
  }

  // Atualiza a média de quem foi avaliado
  // ex: hóspede atualiza a média do imóvel
  //     anfitrião atualiza a reputação do hóspede
  atualizarPerfil() {
    throw new Error("Implemente atualizarPerfil()");
  }

  // Redireciona após salvar
  // ex: hóspede vai para /avaliacoes/imovel
  //     anfitrião vai para /avaliacoes/hospede
  redirecionar() {
    throw new Error("Implemente redirecionar()");
  }
}

export default AvaliacaoBase;
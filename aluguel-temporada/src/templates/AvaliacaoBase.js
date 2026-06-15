import avaliacaoService from "../services/avaliacaoService";

class AvaliacaoBase {

  // O construtor recebe os dados do formulário e o navigate
  // e os guarda para usar nos métodos abaixo
  constructor(dados, navigate) {
    this.dados = dados;
    this.navigate = navigate;
  }

  // ── ESQUELETO FIXO ──
  // Esse método nunca é sobrescrito pelos filhos
  // Ele apenas chama os 4 passos na ordem certa
  // É o "template" do padrão Template Method
  async executar() {
    this.verificarElegibilidade();
    this.registrarNota();
    this.registrarComentario();
    await this.salvar();
    this.atualizarPerfil();
    this.redirecionar();
  }

  // ── MÉTODOS ABSTRATOS ──
  // Os filhos DEVEM sobrescrever esses métodos
  // Se não sobrescreverem, vai lançar um erro avisando

  // Verifica se o usuário pode fazer essa avaliação
  // ex: hóspede só avalia se teve uma reserva confirmada
  verificarElegibilidade() {
    throw new Error("Implemente verificarElegibilidade()");
  }

  // Valida a nota que o usuário deu
  // ex: nota entre 1 e 5, nota obrigatória
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
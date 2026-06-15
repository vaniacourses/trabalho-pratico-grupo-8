import AvaliacaoBase from "./AvaliacaoBase";
import avaliacaoService from "../services/avaliacaoService";

class AvaliacaoAnfitriao extends AvaliacaoBase {

  // Verifica se tem tudo que precisa para criar a avaliação
  // Se faltar algo, lança um erro que a page vai capturar e mostrar na tela
  verificarElegibilidade() {
    if (!this.dados.hospedeId) throw new Error("Hóspede não identificado.");
    if (!this.dados.anfitriaoId) throw new Error("Anfitrião não identificado.");
  }

  // Valida a nota — obrigatória e entre 1 e 5
  registrarNota() {
    if (!this.dados.nota) throw new Error("Nota é obrigatória.");
    if (this.dados.nota < 1 || this.dados.nota > 5) {
      throw new Error("Nota deve ser entre 1 e 5.");
    }
  }

  // Valida o comentário — obrigatório e mínimo 20 caracteres
  registrarComentario() {
    if (!this.dados.comentario) throw new Error("Comentário é obrigatório.");
    if (this.dados.comentario.length < 20) {
      throw new Error("Comentário deve ter no mínimo 20 caracteres.");
    }
  }

  // Monta o objeto e salva na coleção correta do banco
  // Note que aqui é onde os dados do formulário viram um objeto estruturado
  async salvar() {
    const avaliacao = {
      hospedeId: this.dados.hospedeId,
      anfitriaoId: this.dados.anfitriaoId,
      nota: this.dados.nota,
      comentario: this.dados.comentario,
      data: new Date().toISOString(),
    };
    await avaliacaoService.criarAvaliacaoHospede(avaliacao);
  }

  // Por agora deixamos vazio — atualizar média do anfitrião
  // é algo que pode ser implementado depois
  atualizarPerfil() {}

  // Redireciona para a lista de avaliações do anfitrião após salvar
  redirecionar() {
    this.navigate("/avaliacoes/anfitriao");
  }
}

export default AvaliacaoAnfitriao;
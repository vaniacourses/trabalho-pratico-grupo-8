import AvaliacaoBase from "./AvaliacaoBase";
import avaliacaoService from "../services/avaliacaoService";

class AvaliacaoAnfitriao extends AvaliacaoBase {

  verificarElegibilidade() {
    if (!this.dados.hospedeId) throw new Error("Hóspede não identificado.");
    if (!this.dados.anfitriaoId) throw new Error("Anfitrião não identificado.");
  }

  registrarNota() {
    if (!this.dados.nota) throw new Error("Nota é obrigatória.");
    if (this.dados.nota < 1 || this.dados.nota > 5) {
      throw new Error("Nota deve ser entre 1 e 5.");
    }
  }

  registrarComentario() {
    if (!this.dados.comentario) throw new Error("Comentário é obrigatório.");
    if (this.dados.comentario.length < 20) {
      throw new Error("Comentário deve ter no mínimo 20 caracteres.");
    }
  }

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

  atualizarPerfil() {}

  // Redireciona para a lista de avaliações do anfitrião após salvar
  redirecionar() {
    this.navigate("/");
  }
}

export default AvaliacaoAnfitriao;
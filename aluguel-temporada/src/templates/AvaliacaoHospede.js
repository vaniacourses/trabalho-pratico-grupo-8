import AvaliacaoBase from "./AvaliacaoBase";
import avaliacaoService from "../services/avaliacaoService";

class AvaliacaoHospede extends AvaliacaoBase {

  verificarElegibilidade() {
    if (!this.dados.imovelId) throw new Error("Imóvel não identificado.");
    if (!this.dados.hospedeId) throw new Error("Hóspede não identificado.");
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
      imovelId: this.dados.imovelId,
      hospedeId: this.dados.hospedeId,
      nota: this.dados.nota,
      categorias: this.dados.categorias,
      comentario: this.dados.comentario,
      data: new Date().toISOString(),
    };
    await avaliacaoService.criarAvaliacaoImovel(avaliacao);
  }

  atualizarPerfil() {}

  redirecionar() {
    this.navigate("/");
  }
}

export default AvaliacaoHospede;
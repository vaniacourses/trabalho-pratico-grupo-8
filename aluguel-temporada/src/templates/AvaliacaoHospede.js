import AvaliacaoBase from "./AvaliacaoBase";
import avaliacaoService from "../services/avaliacaoService";

class AvaliacaoHospede extends AvaliacaoBase {

  // Verifica se tem tudo que precisa para criar a avaliação
  // Se faltar algo, lança um erro que a page vai capturar e mostrar na tela
  verificarElegibilidade() {
    if (!this.dados.imovelId) throw new Error("Imóvel não identificado.");
    if (!this.dados.hospedeId) throw new Error("Hóspede não identificado.");
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
      imovelId: this.dados.imovelId,
      hospedeId: this.dados.hospedeId,
      nota: this.dados.nota,
      categorias: this.dados.categorias,
      comentario: this.dados.comentario,
      data: new Date().toISOString(),
    };
    await avaliacaoService.criarAvaliacaoImovel(avaliacao);
  }

  // Por agora deixamos vazio — atualizar média do imóvel
  // é algo que pode ser implementado depois
  atualizarPerfil() {}

  // Redireciona para a lista de avaliações do imóvel após salvar
  redirecionar() {
    this.navigate("/avaliacoes/imovel");
  }
}

export default AvaliacaoHospede;
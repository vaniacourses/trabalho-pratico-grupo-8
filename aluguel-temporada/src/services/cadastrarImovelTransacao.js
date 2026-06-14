import ImovelBuilder from "../builders/ImovelBuilder";
import imovelService from "./imovelService";
import disponibilidadeService from "./disponibilidadeService";

/**
 * Caso de uso transacional: Cadastro completo de Imóvel (UC05 → UC06 → UC07).
 *
 * Garante atomicidade: se qualquer etapa falhar, todas as operações já
 * realizadas são desfeitas (rollback / ação compensatória), evitando
 * dados inconsistentes no sistema.
 */
const cadastrarImovelTransacao = async (dadosImovel, periodos, status) => {
  let imovelCriado = null;
  const disponibilidadesCriadas = [];

  try {
    const imovel = new ImovelBuilder()
      .setIdAnfitriao(dadosImovel.idAnfitriao)
      .setTitulo(dadosImovel.titulo)
      .setDescricao(dadosImovel.descricao)
      .setEndereco(dadosImovel.endereco)
      .setPrecoPorNoite(dadosImovel.precoPorNoite)
      .setTipoImovel(dadosImovel.tipoImovel)
      .setStatus(status)
      .setRegras(dadosImovel.regras)
      .setFotos(dadosImovel.fotos)
      .setComodidades(dadosImovel.comodidades)
      .build();

    // Etapa 1: cria o imóvel
    imovelCriado = await imovelService.criar(imovel);

    // Etapa 2: cria os períodos de disponibilidade
    for (const periodo of periodos) {
      const criado = await disponibilidadeService.criar({
        idImovel: imovelCriado.id,
        dataInicio: periodo.dataInicio,
        dataFim: periodo.dataFim,
        disponivel: periodo.disponivel,
      });
      disponibilidadesCriadas.push(criado);
    }

    return imovelCriado;
  } catch (error) {
    // Rollback: desfaz tudo que já havia sido criado
    for (const d of disponibilidadesCriadas) {
      try {
        await disponibilidadeService.excluir(d.id);
      } catch {
        // ignora falha no rollback de disponibilidade
      }
    }

    if (imovelCriado) {
      try {
        await imovelService.excluir(imovelCriado.id);
      } catch {
        // ignora falha no rollback do imóvel
      }
    }

    throw new Error(
      "Não foi possível concluir o cadastro. Nenhuma informação foi salva. " +
        (error.message || "Tente novamente."),
      { cause: error }
    );
  }
};

export default cadastrarImovelTransacao;
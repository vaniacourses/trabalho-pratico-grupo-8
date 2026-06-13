class ImovelBuilder {
  constructor() {
    this.imovel = {
      idAnfitriao: null,
      titulo: "",
      descricao: "",
      endereco: "",
      precoPorNoite: 0,
      tipoImovel: "",
      status: "ativo",
      regras: "",
      fotos: [],
      comodidades: [],
    };
  }

  setIdAnfitriao(idAnfitriao) {
    this.imovel.idAnfitriao = idAnfitriao;
    return this;
  }

  setTitulo(titulo) {
    this.imovel.titulo = titulo;
    return this;
  }

  setDescricao(descricao) {
    this.imovel.descricao = descricao;
    return this;
  }

  setEndereco(endereco) {
    this.imovel.endereco = endereco;
    return this;
  }

  setPrecoPorNoite(precoPorNoite) {
    this.imovel.precoPorNoite = precoPorNoite;
    return this;
  }

  setTipoImovel(tipoImovel) {
    this.imovel.tipoImovel = tipoImovel;
    return this;
  }

  setStatus(status) {
    this.imovel.status = status;
    return this;
  }

  setRegras(regras) {
    this.imovel.regras = regras;
    return this;
  }

  setFotos(fotos) {
    this.imovel.fotos = fotos;
    return this;
  }

  setComodidades(comodidades) {
    this.imovel.comodidades = comodidades;
    return this;
  }

  build() {
    if (!this.imovel.titulo) throw new Error("Título é obrigatório.");
    if (!this.imovel.idAnfitriao) throw new Error("Anfitrião é obrigatório.");
    if (!this.imovel.endereco) throw new Error("Endereço é obrigatório.");
    if (!this.imovel.precoPorNoite) throw new Error("Preço por noite é obrigatório.");
    if (!this.imovel.tipoImovel) throw new Error("Tipo do imóvel é obrigatório.");

    return { ...this.imovel };
  }
}

export default ImovelBuilder;
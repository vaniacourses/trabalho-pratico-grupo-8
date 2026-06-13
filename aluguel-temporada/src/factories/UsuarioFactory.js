class Usuario {
  constructor({ nome, email, senha, telefone, status }) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.status = status ?? "ativo";
    this.dataCadastro = new Date().toISOString();
  }
}

class Hospede extends Usuario {
  constructor(dados) {
    super(dados);
    this.tipo = "hospede";
  }
}

class Anfitriao extends Usuario {
  constructor(dados) {
    super(dados);
    this.tipo = "anfitriao";
  }
}

class Administrador extends Usuario {
  constructor(dados) {
    super(dados);
    this.tipo = "administrador";
  }
}

class UsuarioFactory {
  static criar(tipo, dados) {
    switch (tipo) {
      case "hospede":
        return new Hospede(dados);
      case "anfitriao":
        return new Anfitriao(dados);
      case "administrador":
        return new Administrador(dados);
      default:
        throw new Error(`Tipo de usuário inválido: ${tipo}`);
    }
  }
}

export default UsuarioFactory;
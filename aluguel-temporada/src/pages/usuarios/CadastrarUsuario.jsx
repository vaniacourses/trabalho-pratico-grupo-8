import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioFactory from "../../factories/UsuarioFactory";
import usuarioService from "../../services/usuarioService";

function CadastrarUsuario() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "hospede",
    status: "ativo",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.nome) throw new Error("Nome é obrigatório.");
      if (!form.email) throw new Error("Email é obrigatório.");
      if (!form.senha) throw new Error("Senha é obrigatória.");
      if (!form.telefone) throw new Error("Telefone é obrigatório.");

      const usuario = UsuarioFactory.criar(form.tipo, {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        telefone: form.telefone,
        status: form.status,
      });

      await usuarioService.criar(usuario);
      navigate("/usuarios");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Usuário</h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="senha"
          placeholder="Senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="hospede">Hóspede</option>
          <option value="anfitriao">Anfitrião</option>
          <option value="administrador">Administrador</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarUsuario;
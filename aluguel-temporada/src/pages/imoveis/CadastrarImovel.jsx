import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImovelBuilder from "../../builders/ImovelBuilder";
import imovelService from "../../services/imovelService";
import GerenciarFotos from "../../components/foto/GerenciarFotos";
import GerenciarComodidades from "../../components/comodidade/GerenciarComodidades";
import CurrencyInput from "../../components/common/CurrencyInput";
import EnderecoInput from "../../components/common/EnderecoInput";

function CadastrarImovel() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [fotos, setFotos] = useState([]);
  const [comodidades, setComodidades] = useState([]);
  const [precoFormatado, setPrecoFormatado] = useState("");
  const [endereco, setEndereco] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    enderecoFormatado: "",
  });
  const [form, setForm] = useState({
    idAnfitriao: "",
    titulo: "",
    descricao: "",
    precoPorNoite: 0,
    tipoImovel: "",
    status: "ativo",
    regras: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!endereco.logradouro) throw new Error("Logradouro é obrigatório.");
      if (!endereco.numero) throw new Error("Número é obrigatório.");
      if (!endereco.bairro) throw new Error("Bairro é obrigatório.");
      if (!endereco.cidade) throw new Error("Cidade é obrigatória.");
      if (!endereco.estado) throw new Error("Estado é obrigatório.");

      const imovel = new ImovelBuilder()
        .setIdAnfitriao(form.idAnfitriao)
        .setTitulo(form.titulo)
        .setDescricao(form.descricao)
        .setEndereco(endereco.enderecoFormatado)
        .setPrecoPorNoite(form.precoPorNoite)
        .setTipoImovel(form.tipoImovel)
        .setStatus(form.status)
        .setRegras(form.regras)
        .setFotos(fotos)
        .setComodidades(comodidades)
        .build();

      await imovelService.criar(imovel);
      navigate("/imoveis");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Imóvel</h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="idAnfitriao"
          placeholder="ID do Anfitrião"
          value={form.idAnfitriao}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
          rows={3}
        />

        <EnderecoInput value={endereco} onChange={setEndereco} />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Preço por noite</label>
          <CurrencyInput
            value={precoFormatado}
            onChange={(formatado, numerico) => {
              setPrecoFormatado(formatado);
              setForm({ ...form, precoPorNoite: numerico });
            }}
            placeholder="0,00"
          />
        </div>

        <select
          name="tipoImovel"
          value={form.tipoImovel}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Selecione o tipo</option>
          <option value="Casa">Casa</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Chalé">Chalé</option>
          <option value="Studio">Studio</option>
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
        <textarea
          name="regras"
          placeholder="Regras do imóvel"
          value={form.regras}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
          rows={3}
        />

        <GerenciarFotos fotos={fotos} onChange={setFotos} />
        <GerenciarComodidades selecionadas={comodidades} onChange={setComodidades} />

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/imoveis")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarImovel;
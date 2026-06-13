import { useState } from "react";
import GerenciarFotos from "../foto/GerenciarFotos";
import GerenciarComodidades from "../comodidade/GerenciarComodidades";
import CurrencyInput from "../common/CurrencyInput";
import EnderecoInput from "../common/EnderecoInput";

function PassosDadosImovel({ onConcluir }) {
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
    regras: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.idAnfitriao) throw new Error("Anfitrião é obrigatório.");
      if (!form.titulo) throw new Error("Título é obrigatório.");
      if (!endereco.logradouro) throw new Error("Logradouro é obrigatório.");
      if (!endereco.numero) throw new Error("Número é obrigatório.");
      if (!endereco.bairro) throw new Error("Bairro é obrigatório.");
      if (!endereco.cidade) throw new Error("Cidade é obrigatória.");
      if (!endereco.estado) throw new Error("Estado é obrigatório.");
      if (!form.precoPorNoite) throw new Error("Preço por noite é obrigatório.");
      if (!form.tipoImovel) throw new Error("Tipo do imóvel é obrigatório.");

      onConcluir({
        ...form,
        endereco: endereco.enderecoFormatado,
        fotos,
        comodidades,
      });
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Dados do Imóvel</h2>

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

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm mt-2"
        >
          Próximo →
        </button>
      </form>
    </div>
  );
}

export default PassosDadosImovel;
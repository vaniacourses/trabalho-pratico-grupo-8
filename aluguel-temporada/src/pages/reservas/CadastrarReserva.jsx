import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reservaService from "../../services/reservaService";
import imovelService from "../../services/imovelService";
import usuarioService from "../../services/usuarioService";
import disponibilidadeService from "../../services/disponibilidadeService";
import politicaCancelamentoService from "../../services/politicaCancelamentoService";
import { calcularValorTotal } from "../../utils/imovelUtils";
import { formatarValor, verificarDisponibilidadeParaReserva } from "../../utils/reservaUtils";

function CadastrarReserva() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [imoveis, setImoveis] = useState([]);
  const [hospedes, setHospedes] = useState([]);
  const [politicas, setPoliticas] = useState([]);
  const [form, setForm] = useState({
    idImovel: "",
    idHospede: "",
    dataEntrada: "",
    dataSaida: "",
    idPoliticaCancelamento: "",
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [imoveisData, usuarios, politicasData] = await Promise.all([
          imovelService.listar(),
          usuarioService.listar(),
          politicaCancelamentoService.listar(),
        ]);
        setImoveis(imoveisData);
        setHospedes(usuarios.filter((u) => u.tipo === "hospede"));
        setPoliticas(politicasData);
      } catch (error) {
        setErro(error.message || "Erro ao carregar dados para o formulário.");
      }
    };
    carregar();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const imovelSelecionado = imoveis.find((i) => i.id === form.idImovel);
  const valorTotal = imovelSelecionado
    ? calcularValorTotal(imovelSelecionado.precoPorNoite, form.dataEntrada, form.dataSaida)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.idImovel) throw new Error("Selecione um imóvel.");
      if (!form.idHospede) throw new Error("Selecione um hóspede.");
      if (!form.dataEntrada) throw new Error("Data de entrada é obrigatória.");
      if (!form.dataSaida) throw new Error("Data de saída é obrigatória.");
      if (new Date(form.dataSaida) <= new Date(form.dataEntrada)) {
        throw new Error("A data de saída deve ser posterior à data de entrada.");
      }

      const [disponibilidades, reservasExistentes] = await Promise.all([
        disponibilidadeService.listar(),
        reservaService.listar(),
      ]);

      const resultado = verificarDisponibilidadeParaReserva(
        disponibilidades,
        reservasExistentes,
        form.idImovel,
        new Date(form.dataEntrada).toISOString(),
        new Date(form.dataSaida).toISOString(),
      );

      if (!resultado.disponivel) {
        throw new Error(resultado.motivo);
      }

      await reservaService.criar({
        idImovel: form.idImovel,
        idHospede: form.idHospede,
        dataEntrada: new Date(form.dataEntrada).toISOString(),
        dataSaida: new Date(form.dataSaida).toISOString(),
        valorTotal,
        status: "Pendente",
        dataSolicitacao: new Date().toISOString(),
        idPoliticaCancelamento: form.idPoliticaCancelamento || null,
      });

      navigate("/reservas");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Solicitar Reserva</h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          name="idImovel"
          value={form.idImovel}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Selecione o imóvel</option>
          {imoveis.map((imovel) => (
            <option key={imovel.id} value={imovel.id}>
              {imovel.titulo} — {formatarValor(imovel.precoPorNoite)}/noite
            </option>
          ))}
        </select>

        <select
          name="idHospede"
          value={form.idHospede}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Selecione o hóspede</option>
          {hospedes.map((hospede) => (
            <option key={hospede.id} value={hospede.id}>
              {hospede.nome}
            </option>
          ))}
        </select>

        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Data de entrada
          <input
            name="dataEntrada"
            type="date"
            value={form.dataEntrada}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        </label>

        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Data de saída
          <input
            name="dataSaida"
            type="date"
            value={form.dataSaida}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        </label>

        <select
          name="idPoliticaCancelamento"
          value={form.idPoliticaCancelamento}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Sem política de cancelamento</option>
          {politicas.map((politica) => (
            <option key={politica.id} value={politica.id}>
              {politica.descricao.length > 60
                ? politica.descricao.slice(0, 60) + "…"
                : politica.descricao}{" "}
              — {politica.percentualReembolso}% em até {politica.prazoMinimoDias} dia(s)
            </option>
          ))}
        </select>

        <div className="bg-gray-50 border rounded-lg px-4 py-3 text-sm text-gray-700">
          Valor total:{" "}
          <span className="font-semibold">{formatarValor(valorTotal)}</span>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Solicitar
          </button>
          <button
            type="button"
            onClick={() => navigate("/reservas")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarReserva;

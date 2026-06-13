import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import disponibilidadeService from "../../services/disponibilidadeService";

registerLocale("pt-BR", ptBR);

function EditarDisponibilidade() {
  const { idImovel, id } = useParams();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [disponivel, setDisponivel] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await disponibilidadeService.buscarPorId(id);
        setDataInicio(new Date(data.dataInicio));
        setDataFim(new Date(data.dataFim));
        setDisponivel(data.disponivel);
      } catch (error) {
        console.error("Erro ao carregar disponibilidade:", error);
      }
    };

    carregar();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!dataInicio) throw new Error("Data de início é obrigatória.");
      if (!dataFim) throw new Error("Data de fim é obrigatória.");
      if (dataFim <= dataInicio) throw new Error("Data de fim deve ser após a data de início.");

      const periodosExistentes = await disponibilidadeService.listarPorImovel(idImovel);
      const temSobreposicao = disponibilidadeService.verificarSobreposicao(
        periodosExistentes,
        dataInicio,
        dataFim,
        id
      );

      if (temSobreposicao) {
        throw new Error(
          "Este período se sobrepõe a um já cadastrado. Altere ou remova o período existente antes de continuar."
        );
      }

      await disponibilidadeService.atualizar(id, {
        idImovel,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        disponivel,
      });

      navigate(`/imoveis/${idImovel}/disponibilidades`);
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Período</h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Data de Início</label>
          <DatePicker
            selected={dataInicio}
            onChange={(date) => setDataInicio(date)}
            selectsStart
            startDate={dataInicio}
            endDate={dataFim}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            placeholderText="Selecione a data de início"
            className="border rounded-lg px-4 py-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Data de Fim</label>
          <DatePicker
            selected={dataFim}
            onChange={(date) => setDataFim(date)}
            selectsEnd
            startDate={dataInicio}
            endDate={dataFim}
            minDate={dataInicio || new Date()}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            placeholderText="Selecione a data de fim"
            className="border rounded-lg px-4 py-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status do Período</label>
          <select
            value={disponivel}
            onChange={(e) => setDisponivel(e.target.value === "true")}
            className="border rounded-lg px-4 py-2 text-sm"
          >
            <option value="true">Disponível</option>
            <option value="false">Bloqueado</option>
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => navigate(`/imoveis/${idImovel}/disponibilidades`)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarDisponibilidade;
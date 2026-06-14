import { CheckCircle, Clock, Calendar, MapPin, Tag } from "lucide-react";
import COMODIDADES from "../../utils/comodidades";

function PassosAtivarImovel({
  imovel,
  disponibilidades,
  erro,
  salvando,
  onAtivar,
  onManterInativo,
}) {
  const comodidadesDoImovel = COMODIDADES.filter((c) =>
    imovel?.comodidades?.includes(c.id)
  );

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Ativar Anúncio</h2>
      <p className="text-sm text-gray-500 mb-6">
        Revise as informações do seu imóvel. Ao confirmar, o imóvel e os
        períodos de disponibilidade serão salvos juntos — caso algo falhe,
        nada será gravado.
      </p>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
          {erro}
        </div>
      )}

      {/* Resumo do imóvel */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-gray-800">{imovel?.titulo}</h3>
            <span className="text-xs text-gray-500">{imovel?.tipoImovel}</span>
          </div>
          <span className="text-base font-bold text-blue-600">
            R$ {Number(imovel?.precoPorNoite).toFixed(2)}/noite
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} />
          <span>{imovel?.endereco}</span>
        </div>

        {imovel?.descricao && (
          <p className="text-sm text-gray-500">{imovel.descricao}</p>
        )}

        {comodidadesDoImovel.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {comodidadesDoImovel.map((c) => (
              <span
                key={c.id}
                className="text-xs bg-white border text-gray-600 px-2 py-1 rounded-full"
              >
                {c.icone} {c.nome}
              </span>
            ))}
          </div>
        )}

        {imovel?.fotos?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Tag size={14} />
            <span>{imovel.fotos.length} foto(s) adicionada(s)</span>
          </div>
        )}

        {disponibilidades.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar size={14} />
              <span>Períodos a cadastrar:</span>
            </div>
            {disponibilidades.map((p, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600 ml-5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    p.disponivel
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.disponivel ? "Disponível" : "Bloqueado"}
                </span>
                <span>
                  {formatarData(p.dataInicio)} → {formatarData(p.dataFim)}
                </span>
              </div>
            ))}
          </div>
        )}

        {disponibilidades.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
            <Clock size={14} />
            Nenhuma disponibilidade cadastrada. O imóvel ficará sem períodos até que você adicione.
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onAtivar}
          disabled={salvando}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-medium"
        >
          <CheckCircle size={18} />
          {salvando ? "Salvando..." : "Ativar Anúncio Agora"}
        </button>
        <button
          onClick={onManterInativo}
          disabled={salvando}
          className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-600 px-6 py-3 rounded-lg text-sm"
        >
          {salvando ? "Salvando..." : "Salvar como Inativo por Enquanto"}
        </button>
      </div>
    </div>
  );
}

export default PassosAtivarImovel;
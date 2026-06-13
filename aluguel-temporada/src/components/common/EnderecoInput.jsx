function EnderecoInput({ value, onChange }) {
  const campos = value || {
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  };

  const handleChange = (e) => {
    const novoCampo = { ...campos, [e.target.name]: e.target.value };
    const enderecoFormatado = [
      novoCampo.logradouro,
      novoCampo.numero,
      novoCampo.complemento,
      novoCampo.bairro,
      novoCampo.cidade,
      novoCampo.estado,
    ]
      .filter(Boolean)
      .join(", ");

    onChange({ ...novoCampo, enderecoFormatado });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">Endereço</label>

      <input
        name="logradouro"
        placeholder="Logradouro (Rua, Avenida, Estrada...)"
        value={campos.logradouro}
        onChange={handleChange}
        className="border rounded-lg px-4 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          name="numero"
          placeholder="Número"
          value={campos.numero}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="complemento"
          placeholder="Complemento (opcional)"
          value={campos.complemento}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <input
        name="bairro"
        placeholder="Bairro"
        value={campos.bairro}
        onChange={handleChange}
        className="border rounded-lg px-4 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          name="cidade"
          placeholder="Cidade"
          value={campos.cidade}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="estado"
          placeholder="Estado (ex: RJ)"
          value={campos.estado}
          onChange={handleChange}
          maxLength={2}
          className="border rounded-lg px-4 py-2 text-sm uppercase"
        />
      </div>

      {campos.enderecoFormatado && (
        <p className="text-xs text-gray-400 mt-1">
          📍 {campos.enderecoFormatado}
        </p>
      )}
    </div>
  );
}

export default EnderecoInput;
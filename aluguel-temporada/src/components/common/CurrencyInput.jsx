function CurrencyInput({ value, onChange, placeholder = "0,00" }) {
  const formatarValor = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (!apenasNumeros) return "";
    const numero = parseInt(apenasNumeros, 10) / 100;
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e) => {
    const formatado = formatarValor(e.target.value);
    const apenasNumeros = e.target.value.replace(/\D/g, "");
    const valorNumerico = parseInt(apenasNumeros || "0", 10) / 100;
    onChange(formatado, valorNumerico);
  };

  return (
    <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
      <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium border-r select-none">
        R$
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}

export default CurrencyInput;
// src/components/FormularioReserva.tsx

import { Calendar, User, CheckCircle } from "lucide-react";
import { useReservaForm } from "../hooks/useReservaForm";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ALTERADO: Adicionamos o callback onError para passar ao hook
interface FormularioProps {
  isAberto: boolean;
  onSuccess: () => void;
  onError: (mensagem: string) => void;
}

const FormularioReserva = ({
  isAberto,
  onSuccess,
  onError,
}: FormularioProps) => {
  // ALTERADO: A chamada do hook agora passa um objeto com onSuccess e onError
  // E não precisamos mais de `updateField` nem `fetchHorarios`!
  const {
    formState,
    handleInputChange, // O novo handler unificado do hook
    handleSubmit,
    quadras,
    horarios,
    loading,
    maxDate,
    minDate,
    // REMOVIDO: updateField, fetchHorarios
  } = useReservaForm({ onSuccess, onError });

  const handleDateChange = (date: Date | null) => {
    let dataFormatada = "";

    if (date) {
      // Formata a data para YYYY-MM-DD (o formato que seu hook já usa)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dataFormatada = `${year}-${month}-${day}`;
    }

    // Simula o objeto 'event' que o seu hook 'handleInputChange' espera
    const eventoSimulado = {
      target: {
        name: "data", // O nome do campo
        value: dataFormatada, // O valor formatado
      },
    };

    // Chama o handler original do seu hook
    handleInputChange(
      eventoSimulado as unknown as React.ChangeEvent<HTMLInputElement>
    );
  };

  // --- Funções Helper para converter as strings min/max em Date ---
  // (Usando a lógica de split para evitar o bug do fuso que tínhamos antes)
  const parseDateString = (dateString: string): Date | null => {
    if (!dateString) return null;
    // Evita o bug do fuso tratando a string 'YYYY-MM-DD'
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const minDateObj = parseDateString(minDate);
  const maxDateObj = parseDateString(maxDate);
  // Converte o valor atual do formulário (que é string) de volta para Date
  const selectedDateObj = parseDateString(formState.data);

  // ================================================================
  // ✨ ADICIONE ESTE CONSOLE.LOG PARA DEPURAR ✨
  // ================================================================
  // console.log("DEPURAÇÃO DATA iOS:");
  // console.log("Min Original:", minDate);
  // console.log("Min Formatado:", minDateformatado);
  // console.log("Max Original:", maxDate);
  // console.log("Max Formatado:", maxDateformatado);
  // console.log("Valor do Input (formState.data):", formState.data);
  // ================================================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header (sem alterações) */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-12 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Reserve Sua Quadra</h2>
            <p className="text-xl opacity-90">
              Sistema oficial da Prefeitura de Teodoro Sampaio - SP
            </p>
          </div>
        </div>

        {/* ALTERADO: onSubmit agora está mais simples */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600" />
              Dados Pessoais
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formState.nome}
                  onChange={handleInputChange} // Usa o handler direto do hook
                  className="w-full px-4 py-3 border rounded-xl border-gray-300"
                  placeholder="Digite seu nome completo"
                  disabled={!isAberto}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formState.cpf}
                  onChange={handleInputChange} // Usa o handler direto do hook
                  maxLength={14} // Boa prática para CPF formatado
                  className="w-full px-4 py-3 border rounded-xl border-gray-300"
                  placeholder="000.000.000-00"
                  disabled={!isAberto}
                />
              </div>
            </div>
          </div>

          {/* Dados da Reserva */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-green-600" />
              Dados da Reserva
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <DatePicker
                  selected={selectedDateObj} // O valor (tem que ser Date ou null)
                  onChange={handleDateChange} // Nosso handler novo
                  minDate={minDateObj || undefined} // <-- CORRIGIDO AQUI
                  maxDate={maxDateObj || undefined} // <-- CORRIGIDO AQUI
                  disabled={!isAberto}
                  className="w-full px-4 py-3 border rounded-xl border-gray-300" // Seus estilos
                  placeholderText="Selecione a data" // Texto de ajuda
                  dateFormat="dd/MM/yyyy" // Formato de exibição amigável
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quadra *
                </label>
                <select
                  name="quadraId"
                  value={formState.quadraId}
                  onChange={handleInputChange} // Usa o handler direto do hook
                  className="w-full px-4 py-3 border rounded-xl border-gray-300"
                  disabled={!isAberto || quadras.length === 0}
                >
                  <option value="">
                    {quadras.length > 0
                      ? "Selecione uma quadra"
                      : "Carregando quadras..."}
                  </option>
                  {quadras.map((quadra) => (
                    <option key={quadra.id} value={quadra.id}>
                      {quadra.localizacao} - {quadra.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário
                </label>
                <select
                  name="horarioInicio"
                  value={formState.horarioInicio}
                  onChange={handleInputChange} // Usa o handler direto do hook
                  className="w-full px-4 py-3 border rounded-xl border-gray-300"
                  disabled={
                    !isAberto ||
                    loading || // O `loading` do hook já cobre a busca de horários
                    !formState.data ||
                    !formState.quadraId
                  }
                >
                  <option value="">
                    {loading && formState.data && formState.quadraId
                      ? "Buscando horários..."
                      : formState.data && formState.quadraId
                      ? horarios.length > 0
                        ? "Selecione um horário"
                        : "Nenhum horário disponível"
                      : "Selecione data e quadra"}
                  </option>
                  {horarios.map((horario) => {
                    // 1. Pega a hora inicial (ex: "08") e a converte para número
                    const horaInicial = parseInt(horario.split(":")[0], 10);

                    // 2. Calcula a hora final, garantindo que "23:00" vire "00:00" no final
                    const horaFinal = (horaInicial + 1) % 24;

                    // 3. Formata a hora final para ter sempre dois dígitos (ex: "09" ou "00")
                    const horaFinalFormatada = String(horaFinal).padStart(
                      2,
                      "0"
                    );

                    // 4. Monta o texto que será exibido
                    const textoOpcao = `${horario} - ${horaFinalFormatada}:00`;

                    return (
                      <option key={horario} value={horario}>
                        {textoOpcao} {/* <-- Exibe o texto formatado */}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="pt-6">
            {/* REMOVIDO: A exibição de erro agora é feita pela TelaResultado na página principal */}
            <button
              type="submit"
              disabled={!isAberto || loading}
              className="w-full py-4 px-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>
                    {isAberto
                      ? "Confirmar Reserva"
                      : "Agendamento Indisponível"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioReserva;

// src/components/FormularioReserva.tsx

import { Calendar, User, CheckCircle } from "lucide-react";
import { useReservaForm } from "../hooks/useReservaForm";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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

  const {
    formState,
    handleInputChange, 
    handleSubmit,
    quadras,
    horarios,
    loading,
    maxDate,
    minDate,
  } = useReservaForm({ onSuccess, onError });

  const handleDateChange = (date: Date | null) => {
    let dataFormatada = "";

    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dataFormatada = `${year}-${month}-${day}`;
    }

    const eventoSimulado = {
      target: {
        name: "data", 
        value: dataFormatada, 
      },
    };

    handleInputChange(
      eventoSimulado as unknown as React.ChangeEvent<HTMLInputElement>
    );
  };

  const parseDateString = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const minDateObj = parseDateString(minDate);
  const maxDateObj = parseDateString(maxDate);
  const selectedDateObj = parseDateString(formState.data);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(2,6,23,0.08)] overflow-hidden border border-slate-100">
        {}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-8 py-12 text-white">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-slate-300">
              Agendamento Online
            </p>
            <h2 className="text-4xl font-semibold mt-3">
              Reserve em Segundos
            </h2>
            <p className="text-lg text-slate-200 mt-3">
              Confirmação rápida e horários sempre atualizados.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700">
                <User className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Seus dados
                </h3>
                <p className="text-sm text-slate-500">
                  Preencha para confirmar sua reserva.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formState.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                  placeholder="Ex.: Maria Oliveira"
                  disabled={!isAberto}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formState.cpf}
                  onChange={handleInputChange}
                  maxLength={14}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                  placeholder="000.000.000-00"
                  disabled={!isAberto}
                />
                <p className="text-xs text-slate-500">
                  Usamos apenas para validar sua reserva.
                </p>
              </div>
            </div>
          </div>

          {} 
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Dados da reserva
                </h3>
                <p className="text-sm text-slate-500">
                  Escolha data, local e horário.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Data
                </label>
                <DatePicker
                  selected={selectedDateObj}
                  onChange={handleDateChange}
                  minDate={minDateObj || undefined}
                  maxDate={maxDateObj || undefined}
                  disabled={!isAberto}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                  placeholderText="Selecione a data"
                  dateFormat="dd/MM/yyyy"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Locais
                </label>
                <select
                  name="quadraId"
                  value={formState.quadraId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                  disabled={!isAberto || quadras.length === 0}
                >
                  <option value="">
                    {quadras.length > 0
                      ? "Selecione"
                      : "Carregando..."}
                  </option>
                  {quadras.map((quadra) => (
                    <option key={quadra.id} value={quadra.id}>
                      {quadra.localizacao} — {quadra.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Horário
                </label>
                <select
                  name="horarioInicio"
                  value={formState.horarioInicio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                  disabled={
                    !isAberto ||
                    loading ||
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
                        : "Selecione data e local"}
                  </option>
                  {horarios.map((horario) => {
                    const horaInicial = parseInt(horario.split(":")[0], 10);
                    const horaFinal = (horaInicial + 1) % 24;
                    const horaFinalFormatada = String(horaFinal).padStart(
                      2,
                      "0"
                    );
                    const textoOpcao = `${horario} - ${horaFinalFormatada}:00`;

                    return (
                      <option key={horario} value={horario}>
                        {textoOpcao}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-slate-500">
                  Duração padrão: 1 hora por reserva.
                </p>
              </div>
            </div>
          </div>

          {} 
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isAberto || loading}
              className="w-full py-4 px-8 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  <span>Confirmando sua reserva...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>
                    {isAberto
                      ? "Confirmar reserva"
                      : "Agendamento indisponível"}
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-3">
              Ao confirmar, você receberá a validação na tela.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioReserva;

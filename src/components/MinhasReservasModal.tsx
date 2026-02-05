import { useState, type FormEvent } from "react";
import { X, QrCode, Clock, Check, XCircle, AlertTriangle } from "lucide-react";
import { reservaService } from "../hooks/apiServices";
import type { Reserva } from "../constants/Reserva";

interface ModalProps {
  onClose: () => void;
}

const formatarCPF = (value: string) => {
  const cpfApenasNumeros = value.replace(/\D/g, "");
  return cpfApenasNumeros
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const STATUS_RESERVA_STRING: { [key: number]: string } = {
  0: "PENDENTE",
  1: "ATIVA",
  2: "FUTURA",
  3: "VENCIDA",
  4: "CANCELADA",
  5: "REPROVADA",
};

const MinhasReservasModal = ({ onClose }: ModalProps) => {
  const [cpf, setCpf] = useState("");
  const [reservas, setReservas] = useState<Reserva[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscarReservas = async (e: FormEvent) => {
    e.preventDefault();
    const cpfLimpo = cpf.replace(/[.-]/g, "");

    setIsLoading(true);
    setError(null);
    setReservas(null);

    try {
      const response = await reservaService.getReservaCpf(cpfLimpo);
      setReservas(response.data);
    } catch (err) {
      console.error(err);
      setError("Nenhuma reserva encontrada ou CPF inválido.");
      setReservas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarDataHora = (dataISO: string) =>
    new Date(dataISO).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatarDataResumo = (dataISO: string) =>
    new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatarHora = (dataISO: string) =>
    new Date(dataISO).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const reservaAtiva = reservas?.find((r) => r.status === 1);

  const sortAndSlice = (reservas: Reserva[]) =>
    reservas
      .sort(
        (a, b) =>
          new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
      )
      .slice(0, 3);

  const reservasPendentes = sortAndSlice(
    reservas?.filter((r) => r.status === 0) || []
  );
  const reservasVencidas = sortAndSlice(
    reservas?.filter((r) => r.status === 3) || []
  );
  const reservasCanceladas = sortAndSlice(
    reservas?.filter((r) => r.status === 4) || []
  );
  const reservasReprovadas = sortAndSlice(
    reservas?.filter((r) => r.status === 5) || []
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-md border border-gray-300 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">Minhas reservas</h2>
        <p className="text-base text-gray-700 mb-5">
          Consulte sua reserva ativa e histórico.
        </p>

        <form onSubmit={handleBuscarReservas} className="flex gap-3 mb-5">
          <input
            type="tel"
            value={cpf}
            onChange={(e) => setCpf(formatarCPF(e.target.value))}
            placeholder="000.000.000-00"
            className="flex-1 px-4 py-3 border border-gray-400 rounded-md text-base"
            maxLength={14}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-3 text-base font-semibold border border-gray-400 rounded-md text-gray-900 hover:bg-gray-100 disabled:opacity-60"
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        <div>
          {error && <p className="text-base text-red-700">{error}</p>}

          {reservas && reservas.length === 0 && !error && (
            <p className="text-base text-gray-700">
              Nenhuma reserva encontrada para este CPF.
            </p>
          )}

          {reservas && reservas.length > 0 && !error && (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {reservaAtiva ? (
                <div className="border border-gray-300 rounded-md p-4">
                  <div className="text-base font-semibold text-gray-900 mb-2">
                    Comprovante de reserva
                  </div>
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1 text-base text-gray-900">
                      <p>
                        <span className="font-semibold">Cliente:</span>{" "}
                        {reservaAtiva.nome}
                      </p>
                      <p>
                        <span className="font-semibold">Quadra:</span>{" "}
                        {reservaAtiva.Quadra.localizacao} (
                        {reservaAtiva.Quadra.tipo})
                      </p>
                      <p>
                        <span className="font-semibold">Data:</span>{" "}
                        {formatarDataHora(reservaAtiva.dataInicio)} -{" "}
                        {formatarHora(reservaAtiva.dataFim)}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Status:</span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                          <Check size={14} />
                          {STATUS_RESERVA_STRING[reservaAtiva.status]}
                        </span>
                      </p>
                    </div>
                    <div className="text-gray-500">
                      <QrCode size={60} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-base text-gray-700">
                  Você não possui nenhuma reserva ativa no momento.
                </p>
              )}

              <div className="space-y-4">
                {reservasPendentes.length > 0 && (
                  <HistoricoItem
                    titulo="Pendentes"
                    reservas={reservasPendentes}
                    formatarData={formatarDataResumo}
                    Icon={AlertTriangle}
                    cor="text-orange-600"
                  />
                )}
                {reservasVencidas.length > 0 && (
                  <HistoricoItem
                    titulo="Vencidas"
                    reservas={reservasVencidas}
                    formatarData={formatarDataResumo}
                    Icon={Clock}
                    cor="text-red-700"
                  />
                )}
                {reservasCanceladas.length > 0 && (
                  <HistoricoItem
                    titulo="Canceladas"
                    reservas={reservasCanceladas}
                    formatarData={formatarDataResumo}
                    Icon={XCircle}
                    cor="text-gray-700"
                  />
                )}
                {reservasReprovadas.length > 0 && (
                  <HistoricoItem
                    titulo="Reprovadas"
                    reservas={reservasReprovadas}
                    formatarData={formatarDataResumo}
                    Icon={XCircle}
                    cor="text-red-800"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;

interface HistoricoItemProps {
  titulo: string;
  reservas: Reserva[];
  formatarData: (dataISO: string) => string;
  Icon: LucideIcon;
  cor: string;
}

const HistoricoItem = ({
  titulo,
  reservas,
  formatarData,
  Icon,
  cor,
}: HistoricoItemProps) => (
  <div>
    <h4
      className={`text-base font-semibold ${cor} flex items-center gap-2 mb-1`}
    >
      <Icon size={16} />
      {titulo} ({reservas.length})
    </h4>
    <ul className="text-base text-gray-900 space-y-1 pl-5 list-disc">
      {reservas.map((reserva) => (
        <li key={reserva.id}>
          <strong>{reserva.Quadra.localizacao}</strong> em{" "}
          {formatarData(reserva.dataInicio)}
        </li>
      ))}
    </ul>
  </div>
);

export default MinhasReservasModal;

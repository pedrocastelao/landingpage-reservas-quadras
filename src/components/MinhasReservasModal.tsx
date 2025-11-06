import { useState, type FormEvent } from "react";
// 1. Importei o QrCode para o comprovante
import { X, QrCode, Clock, Check, XCircle, AlertTriangle } from "lucide-react";
import { reservaService } from "../hooks/apiServices";
import type { Reserva } from "../constants/Reserva";

// Interface para as props do modal
interface ModalProps {
  onClose: () => void; // Função para fechar o modal
}

// 2. FUNÇÃO PARA FORMATAR O CPF (NOVA)
const formatarCPF = (value: string) => {
  // Remove tudo que não for dígito
  const cpfApenasNumeros = value.replace(/\D/g, "");

  // Aplica a máscara
  return cpfApenasNumeros
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o traço
};

// + ADICIONE ESTE MAPA DE CONVERSÃO (você me passou ele)
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
      console.log("quero ver", response.data);
    } catch (err) {
      console.error(err);
      setError("Nenhuma reserva encontrada ou CPF inválido.");
      setReservas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNÇÕES DE DATA ATUALIZADAS ---
  // 1. Formata a data e hora completas (para o comprovante)
  const formatarDataHora = (dataISO: string) => {
    return new Date(dataISO).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 2. Formata apenas a data (para as listas de resumo)
  const formatarDataResumo = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // 3. Formata apenas a hora final
  const formatarHora = (dataISO: string) => {
    return new Date(dataISO).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- LÓGICA DE FILTRO ATUALIZADA ---
  // Como você disse, só pode haver UMA ativa, então usamos .find()
  const reservaAtiva = reservas?.find((r) => r.status === 1); // 1 = ATIVA

  // Função helper para ordenar e fatiar
  const sortAndSlice = (reservas: Reserva[]) => {
    return (
      reservas
        // Ordena pela data de início, da mais nova para a mais antiga
        .sort(
          (a, b) =>
            new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
        )
        // Pega apenas as 3 primeiras
        .slice(0, 3)
    );
  };

  // Para as outras, filtramos, ordenamos e fatiamos
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        {/* Botão de Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Minhas Reservas</h2>
        <p className="mb-4 text-gray-600">
          Consulte sua reserva ativa e histórico.
        </p>

        {/* Formulário de Busca */}
        <form onSubmit={handleBuscarReservas} className="flex space-x-2 mb-4">
          <input
            // 4. INPUT DE CPF ATUALIZADO
            type="tel" // Melhor para teclados numéricos em mobile
            value={cpf}
            onChange={(e) => setCpf(formatarCPF(e.target.value))} // Aplica a formatação
            placeholder="000.000.000-00"
            className="flex-1 p-2 border border-gray-300 rounded-md"
            maxLength={14} // Limita o tamanho final
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {/* --- Área de Resultado --- */}
        {/* 5. ÁREA DE RESULTADO TOTALMENTE REFEITA */}
        <div>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Estado 1: Nenhuma reserva encontrada no CPF */}
          {reservas && reservas.length === 0 && !error && (
            <p className="text-gray-500 text-center">
              Nenhuma reserva encontrada para este CPF.
            </p>
          )}

          {/* Estado 2: Encontrou reservas, mas NENHUMA está "ATIVA" */}
          {/* Estado 2: Busca concluída, ALGO foi encontrado */}
          {reservas && reservas.length > 0 && !error && (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {/* --- SEÇÃO RESERVA ATIVA (COMPROVANTE) --- */}
              {reservaAtiva ? (
                <div
                  key={reservaAtiva.id}
                  className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-50"
                >
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg uppercase text-green-800">
                      Comprovante de Reserva
                    </h3>
                    <p className="text-sm text-gray-600">
                      Prefeitura de Teodoro Sampaio - SP
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2 text-sm">
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
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Status:</span>
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          <Check size={12} />
                          {STATUS_RESERVA_STRING[reservaAtiva.status]}
                        </span>
                      </p>
                    </div>
                    <div className="text-gray-700">
                      <QrCode size={72} />
                    </div>
                  </div>
                </div>
              ) : (
                // Mensagem se não tiver NENHUMA ativa
                <p className="text-gray-500 text-center text-sm pb-2 border-b border-gray-200">
                  Você não possui nenhuma reserva ativa no momento.
                </p>
              )}

              {/* --- SEÇÃO HISTÓRICO (OUTROS STATUS) --- */}
              <div className="space-y-3">
                {/* LISTA DE PENDENTES */}
                {reservasPendentes.length > 0 && (
                  <HistoricoItem
                    titulo="Reservas Pendentes"
                    reservas={reservasPendentes}
                    formatarData={formatarDataResumo}
                    Icon={AlertTriangle}
                    cor="text-orange-600"
                  />
                )}
                {/* LISTA DE VENCIDAS */}
                {reservasVencidas.length > 0 && (
                  <HistoricoItem
                    titulo="Reservas Vencidas"
                    reservas={reservasVencidas}
                    formatarData={formatarDataResumo}
                    Icon={Clock}
                    cor="text-red-600"
                  />
                )}
                {/* LISTA DE CANCELADAS */}
                {reservasCanceladas.length > 0 && (
                  <HistoricoItem
                    titulo="Reservas Canceladas"
                    reservas={reservasCanceladas}
                    formatarData={formatarDataResumo}
                    Icon={XCircle}
                    cor="text-gray-500"
                  />
                )}

                {/* ADICIONE ESTE BLOCO: */}
                {reservasReprovadas.length > 0 && (
                  <HistoricoItem
                    titulo="Reservas Reprovadas"
                    reservas={reservasReprovadas}
                    formatarData={formatarDataResumo}
                    Icon={XCircle} // <-- Pode usar XCircle ou AlertTriangle
                    cor="text-red-700" // Ex: um vermelho mais escuro
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
  cor: string; // Tailwind color class
}

const HistoricoItem = ({
  titulo,
  reservas,
  formatarData,
  Icon,
  cor,
}: HistoricoItemProps) => (
  <div>
    <h4 className={`font-semibold ${cor} flex items-center gap-2 mb-1`}>
      <Icon size={16} />
      {titulo} ({reservas.length})
    </h4>
    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
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

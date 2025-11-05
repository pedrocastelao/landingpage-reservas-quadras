import { useState, type FormEvent } from "react";
// 1. Importei o QrCode para o comprovante
import { X, QrCode } from "lucide-react";
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

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 3. LÓGICA DE FILTRO (NOVA)
  // Filtra as reservas para mostrar APENAS as ativas.
  const reservasAtivas = reservas?.filter((r) => r.status === 1) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Conteúdo do Modal */}
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
          Consulte sua reserva ativa para apresentar no local.
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
          {reservas &&
            reservas.length > 0 &&
            reservasAtivas.length === 0 &&
            !error && (
              <p className="text-gray-500 text-center">
                Você não possui reservas ativas no momento.
              </p>
            )}

          {/* Estado 3: Encontrou e vai exibir o(s) comprovante(s) */}
          {reservasAtivas.length > 0 && (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {reservasAtivas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-gray-50"
                >
                  {/* Cabeçalho do Comprovante */}
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg uppercase">
                      Comprovante de Reserva
                    </h3>
                    <p className="text-sm text-gray-600">
                      Prefeitura de Teodoro Sampaio - SP
                    </p>
                  </div>

                  {/* Corpo do Comprovante */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Cliente:</span>{" "}
                        {reserva.nome}
                      </p>
                      <p>
                        <span className="font-semibold">Quadra:</span>{" "}
                        {reserva.Quadra.localizacao} {reserva.Quadra.tipo}
                      </p>
                      <p>
                        <span className="font-semibold">Data:</span>{" "}
                        {formatarData(reserva.dataInicio)}{" "}
                        {formatarData(reserva.dataFim)}
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Status:</span>
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                          {STATUS_RESERVA_STRING[reserva.status] ||
                            "DESCONHECIDO"}
                        </span>
                      </p>
                    </div>

                    {/* Ícone de "QR Code" */}
                    <div className="text-gray-700">
                      <QrCode size={72} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinhasReservasModal;

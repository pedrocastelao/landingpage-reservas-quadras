import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { reservaService } from "../hooks/apiServices";
import type { Reserva } from "../constants/Reserva";

// Interface para as props do modal
interface ModalProps {
  onClose: () => void; // Função para fechar o modal
}

const MinhasReservasModal = ({ onClose }: ModalProps) => {
  const [cpf, setCpf] = useState("");
  const [reservas, setReservas] = useState<Reserva[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscarReservas = async (e: FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Limpar CPF (remover pontos e traços)
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
      setReservas([]); // Define como array vazio em caso de erro 404
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar a data (ajuste conforme sua necessidade)
  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    // Fundo semi-transparente (backdrop)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          Digite seu CPF para consultar o histórico de reservas.
        </p>

        {/* Formulário de Busca */}
        <form onSubmit={handleBuscarReservas} className="flex space-x-2 mb-4">
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            className="flex-1 p-2 border border-gray-300 rounded-md"
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
        <div>
          {error && <p className="text-red-500">{error}</p>}

          {reservas && reservas.length === 0 && !error && (
            <p className="text-gray-500">Nenhuma reserva encontrada.</p>
          )}

          {reservas && reservas.length > 0 && (
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {reservas.map((reserva) => (
                <li
                  key={reserva.id}
                  className="p-3 border rounded-md bg-gray-50"
                >
                  <p className="font-semibold">
                    {reserva.quadra} - {reserva.status}
                  </p>
                  <p className="text-sm text-gray-700">
                    Cliente: {reserva.nomeCliente}
                  </p>
                  <p className="text-sm text-gray-700">
                    Data: {formatarData(reserva.data)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinhasReservasModal;

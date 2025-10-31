// src/components/TelaResultado.tsx

import { CheckCircle, AlertTriangle } from "lucide-react";

// Definimos as propriedades que o componente receberá
interface ResultadoProps {
  status: "success" | "error";
  titulo: string;
  mensagem: string;
  textoBotao: string;
  onClose: () => void; // Ação ao clicar no botão
}

const TelaResultado = ({
  status,
  titulo,
  mensagem,
  textoBotao,
  onClose,
}: ResultadoProps) => {
  // Define o ícone e a cor com base no status
  const isSuccess = status === "success";
  const Icone = isSuccess ? CheckCircle : AlertTriangle;
  const corIcone = isSuccess ? "text-green-500" : "text-red-500";
  const corBotao = isSuccess
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-red-600 hover:bg-red-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <Icone className={`w-16 h-16 ${corIcone} mx-auto mb-4`} />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">{titulo}</h2>

        <p className="text-gray-600 mb-6">{mensagem}</p>

        <button
          onClick={onClose}
          className={`text-white px-6 py-3 rounded-lg ${corBotao} transition-colors`}
        >
          {textoBotao}
        </button>
      </div>
    </div>
  );
};

export default TelaResultado;

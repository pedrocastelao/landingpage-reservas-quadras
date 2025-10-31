// src/components/AvisoDisponibilidade.tsx
import { CheckCircle, AlertCircle } from "lucide-react";

interface AvisoProps {
  isAberto: boolean;
}

const AvisoDisponibilidade = ({ isAberto }: AvisoProps) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div
      className={`rounded-xl p-6 flex items-center space-x-4 ${
        isAberto
          ? "bg-green-100 border-2 border-green-300"
          : "bg-orange-100 border-2 border-orange-300"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isAberto ? "bg-green-500" : "bg-orange-500"
        }`}
      >
        {isAberto ? (
          <CheckCircle className="w-6 h-6 text-white" />
        ) : (
          <AlertCircle className="w-6 h-6 text-white" />
        )}
      </div>
      <div>
        <h3
          className={`text-lg font-semibold ${
            isAberto ? "text-green-800" : "text-orange-800"
          }`}
        >
          {isAberto ? "Reservas Disponíveis!" : "Reservas Indisponíveis"}
        </h3>
        <p className={`${isAberto ? "text-green-700" : "text-orange-700"}`}>
          {isAberto
            ? "Hoje é segunda-feira! Você pode fazer sua reserva."
            : "As reservas só podem ser feitas às segundas-feiras. Volte na próxima segunda!"}
        </p>
      </div>
    </div>
  </div>
);

export default AvisoDisponibilidade;

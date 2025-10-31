// src/components/TelaSucesso.tsx
import { CheckCircle } from "lucide-react";

interface SucessoProps {
  onNovaReserva: () => void;
}

const TelaSucesso = ({ onNovaReserva }: SucessoProps) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Reserva Confirmada!
      </h2>
      <p className="text-gray-600 mb-6">
        Sua reserva foi realizada com sucesso. Você receberá um email de
        confirmação em breve.
      </p>
      <button
        onClick={onNovaReserva}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Nova Reserva
      </button>
    </div>
  </div>
);

export default TelaSucesso;

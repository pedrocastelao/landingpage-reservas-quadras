import { CheckCircle, AlertCircle } from "lucide-react";

interface AvisoProps {
  isAberto: boolean;
  titulo: string;
  mensagem: string;
}

const AvisoDisponibilidade = ({ isAberto, titulo, mensagem }: AvisoProps) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
    <div className="border-2 border-gray-300 rounded-md p-5 flex items-start gap-4 bg-white">
      <div className="mt-0.5">
        {isAberto ? (
          <CheckCircle className="w-6 h-6 text-green-700" />
        ) : (
          <AlertCircle className="w-6 h-6 text-orange-600" />
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
        <p className="text-base text-gray-800 mt-1">{mensagem}</p>
      </div>
    </div>
  </div>
);

export default AvisoDisponibilidade;

// src/components/AvisoDisponibilidade.tsx
import { CheckCircle, AlertCircle } from "lucide-react";

// 1. Atualizamos as props para receber o título e a mensagem
interface AvisoProps {
  isAberto: boolean;
  titulo: string;
  mensagem: string;
}

const AvisoDisponibilidade = ({ isAberto, titulo, mensagem }: AvisoProps) => (
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
          {/* 2. Usamos a prop 'titulo' */}
          {titulo}
        </h3>
        <p className={`${isAberto ? "text-green-700" : "text-orange-700"}`}>
          {/* 3. Usamos a prop 'mensagem' */}
          {mensagem}
        </p>
      </div>
    </div>
  </div>
);

export default AvisoDisponibilidade;

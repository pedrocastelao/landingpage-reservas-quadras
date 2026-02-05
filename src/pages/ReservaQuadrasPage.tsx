import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AvisoDisponibilidade from "../components/AvisoDisponibilidade";
import FormularioReserva from "../components/FormularioReserva";
import TelaResultado from "../components/TelaResultado";
import { configuracoesService } from "../hooks/apiServices";
import MinhasReservasModal from "../components/MinhasReservasModal";

type SubmissionStatus = {
  status: "idle" | "success" | "error";
  message?: string;
};

interface ConfigReserva {
  // diaNumero: string;
  diaNome: string;
}

const ReservaQuadrasPage = () => {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
    status: "idle",
  });

  const [isModalReservasAberto, setIsModalReservasAberto] = useState(false);
  const [configuracaoReserva, setConfiguracaoReserva] =
    useState<ConfigReserva | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const response = await configuracoesService.getDiaReserva();

        const configDoDia = response.data.find(
          (config) =>
            config.regra !== "HORARIO_INICIO" && config.regra !== "HORARIO_FIM",
        );

        if (!configDoDia) {
          throw new Error(
            "Não foi possível encontrar a regra do dia nas configurações.",
          );
        }

        setConfiguracaoReserva({
          // diaNumero: configDoDia.valor,
          diaNome: configDoDia.regra,
        });

        setError(null);
      } catch (err) {
        console.error("Erro ao buscar configuração da API:", err);
        setError("Não foi possível carregar as regras de reserva.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-gray-800">Carregando configurações...</p>
      </div>
    );
  }

  if (error || configuracaoReserva === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-red-700">{error || "Erro inesperado."}</p>
      </div>
    );
  }

  const { diaNome } = configuracaoReserva;
  // const hoje: number = new Date().getDay();
  const isReservasAbertas: boolean = true;

  
  const tituloAviso = isReservasAbertas
    ? "Reservas disponíveis"
    : "Reservas indisponíveis";

  const mensagemAviso = isReservasAbertas
    ? `Hoje é ${diaNome}. Você pode reservar.`
    : `As reservas só podem ser feitas às ${diaNome}s. Volte na próxima ${diaNome}.`;

  const handleSuccess = () => {
    setSubmissionStatus({ status: "success" });
  };

  const handleError = (errorMessage: string) => {
    setSubmissionStatus({ status: "error", message: errorMessage });
  };

  const handleCloseResultado = () => {
    setSubmissionStatus({ status: "idle" });
  };

  if (submissionStatus.status !== "idle") {
    return (
      <TelaResultado
        status={submissionStatus.status}
        titulo={
          submissionStatus.status === "success"
            ? "Reserva confirmada"
            : "Ocorreu um erro"
        }
        mensagem={
          submissionStatus.status === "success"
            ? "Sua reserva foi realizada com sucesso."
            : submissionStatus.message ||
              "Não foi possível concluir a reserva. Tente novamente."
        }
        textoBotao={
          submissionStatus.status === "success"
            ? "Fazer nova reserva"
            : "Tentar novamente"
        }
        onClose={handleCloseResultado}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalReservasAberto(true)}
            className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold border border-gray-400 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <ClipboardList className="w-5 h-5" />
            Minhas reservas
          </button>
        </div>

        <AvisoDisponibilidade
          isAberto={isReservasAbertas}
          titulo={tituloAviso}
          mensagem={mensagemAviso}
        />

        <FormularioReserva
          isAberto={isReservasAbertas}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </main>

      <Footer />

      {isModalReservasAberto && (
        <MinhasReservasModal onClose={() => setIsModalReservasAberto(false)} />
      )}
    </div>
  );
};

export default ReservaQuadrasPage;

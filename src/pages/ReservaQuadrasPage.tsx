// src/pages/ReservaQuadrasPage.tsx
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
// Interface para o estado da nossa configuração
interface ConfigReserva {
  diaNumero: string;
  diaNome: string;
}

const ReservaQuadrasPage = () => {
  // O estado agora é um objeto para guardar mais informações
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
    status: "idle",
  });

  const [isModalReservasAberto, setIsModalReservasAberto] = useState(false);

  const [configuracaoReserva, setConfiguracaoReserva] =
    useState<ConfigReserva | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar a configuração quando o componente montar
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);

        const response = await configuracoesService.getDiaReserva();

        // 'response.data' é o ARRAY com 3 configs: [HORARIO_FIM, Terça-feira, HORARIO_INICIO]

        // 1. Usamos .find() para achar a regra que NÃO é de horário
        const configDoDia = response.data.find(
          (config) =>
            config.regra !== "HORARIO_INICIO" && config.regra !== "HORARIO_FIM"
        );

        // 2. Verificamos se ele realmente encontrou
        if (!configDoDia) {
          throw new Error(
            "Não foi possível encontrar a regra do dia (ex: Terça-feira) nas configurações."
          );
        }

        // 3. Usamos o 'configDoDia' (que agora é o objeto da Terça-feira)
        setConfiguracaoReserva({
          diaNumero: configDoDia.valor, // Ex: "2"
          diaNome: configDoDia.regra, // Ex: "Terça-feira"
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

  // Telas de Loading e Erro
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Carregando configurações...</p>
      </div>
    );
  }

  // ==================================================================
  // ✨ MUDANÇA 4: CHECAGEM DE ESTADO ATUALIZADA ✨
  // ==================================================================
  if (error || configuracaoReserva === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">
          {error || "Erro inesperado."}
        </p>
      </div>
    );
  }

  const { diaNumero, diaNome } = configuracaoReserva;

  const hoje: number = new Date().getDay();
  const isReservasAbertas: boolean = hoje === parseInt(diaNumero, 10);

  const tituloAviso = isReservasAbertas
    ? "Reservas Disponíveis!"
    : "Reservas Indisponíveis";

  const mensagemAviso = isReservasAbertas
    ? `Hoje é ${diaNome}! Você pode fazer sua reserva.`
    : // Adicionamos um 's' simples para pluralizar (Ex: "Sexta - Feiras")
      `As reservas só podem ser feitas às ${diaNome}s. Volte na próxima ${diaNome}!`;

  // Função que lida com o sucesso da submissão
  const handleSuccess = () => {
    setSubmissionStatus({ status: "success" });
  };

  // Função que lida com o erro da submissão
  const handleError = (errorMessage: string) => {
    setSubmissionStatus({ status: "error", message: errorMessage });
  };

  // Função para resetar o estado e voltar ao formulário
  const handleCloseResultado = () => {
    setSubmissionStatus({ status: "idle" });
  };

  // Se o status não for 'idle', mostramos a tela de resultado
  if (submissionStatus.status !== "idle") {
    return (
      <TelaResultado
        status={submissionStatus.status}
        titulo={
          submissionStatus.status === "success"
            ? "Reserva Confirmada!"
            : "Ocorreu um Erro"
        }
        mensagem={
          submissionStatus.status === "success"
            ? "Sua reserva foi realizada com sucesso. Em breve você receberá a confirmação."
            : submissionStatus.message ||
              "Não foi possível concluir a reserva. Tente novamente."
        }
        textoBotao={
          submissionStatus.status === "success"
            ? "Fazer Nova Reserva"
            : "Tentar Novamente"
        }
        onClose={handleCloseResultado}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      <Header />
      <main>
        {/* 3. ADICIONAR O BOTÃO (ex: logo abaixo do AvisoDisponibilidade) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end mb-4">
          <button
            onClick={() => setIsModalReservasAberto(true)}
            className="
                      inline-flex items-center gap-2 px-4 py-2           
                      border border-blue-600 text-blue-600 font-semibold 
                      rounded-lg shadow-sm 
                      hover:bg-blue-50 
                      transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ClipboardList className="w-5 h-5" />
            Consultar Minhas Reservas (ATIVAS)
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

      {/* 4. RENDERIZAR O MODAL (fora do <main>, no fim do <div> principal) */}
      {isModalReservasAberto && (
        <MinhasReservasModal onClose={() => setIsModalReservasAberto(false)} />
      )}
    </div>
  );
};

export default ReservaQuadrasPage;

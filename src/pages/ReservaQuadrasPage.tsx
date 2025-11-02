// src/pages/ReservaQuadrasPage.tsx
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AvisoDisponibilidade from "../components/AvisoDisponibilidade";
import FormularioReserva from "../components/FormularioReserva";
import TelaResultado from "../components/TelaResultado";
import { configuracoesService } from "../hooks/apiServices";

type SubmissionStatus = {
  status: "idle" | "success" | "error";
  message?: string;
};
// Interface para o estado da nossa configuração
interface ConfigReserva {
  diaNumero: number;
  diaNome: string;
}

const ReservaQuadrasPage = () => {
  // O estado agora é um objeto para guardar mais informações
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
    status: "idle",
  });

  const [configuracaoReserva, setConfiguracaoReserva] =
    useState<ConfigReserva | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar a configuração quando o componente montar
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        // O endpoint pode ser o que você já usa (ex: /configuracao-ativa)
        const response = await configuracoesService.getDiaReserva();

        setConfiguracaoReserva({
          diaNumero: response.data.valor, // Ex: 5
          diaNome: response.data.regra, // Ex: "Sexta - Feira"
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
  const isReservasAbertas: boolean = hoje === diaNumero;

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
        {/* Nenhuma mudança aqui, 'AvisoDisponibilidade' já funciona com essas props */}
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
    </div>
  );
};

export default ReservaQuadrasPage;

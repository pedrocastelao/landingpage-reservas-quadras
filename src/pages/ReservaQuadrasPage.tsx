// src/pages/ReservaQuadrasPage.tsx
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AvisoDisponibilidade from "../components/AvisoDisponibilidade";
import FormularioReserva from "../components/FormularioReserva";
import TelaResultado from "../components/TelaResultado";

type SubmissionStatus = {
  status: "idle" | "success" | "error";
  message?: string;
};

const ReservaQuadrasPage = () => {
  // O estado agora é um objeto para guardar mais informações
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
    status: "idle",
  });
  // A lógica de negócio principal fica aqui
  const isReservasAbertas = new Date().getDay() === 5; // 1 = Segunda-feira

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

  // Se o status for 'idle', mostramos a página principal com o formulário
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      <Header />
      <main>
        <AvisoDisponibilidade isAberto={isReservasAbertas} />
        <FormularioReserva
          isAberto={isReservasAbertas}
          onSuccess={handleSuccess}
          onError={handleError} // Passando a nova função de callback
        />
      </main>
      <Footer />
    </div>
  );
};

export default ReservaQuadrasPage;

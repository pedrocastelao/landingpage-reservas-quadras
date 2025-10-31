// src/hooks/useReservaForm.ts

import { useState, useEffect } from "react";
import { validateCPF, formatCPF } from "../utils/utils";
import { reservaService, quadrasService, type Quadra } from "./apiServices"; // Verifique o caminho correto
import { AxiosError } from "axios"; // NOVO: Importação necessária para o catch

// Interfaces permanecem as mesmas
export interface FormData {
  nome: string;
  cpf: string;
  quadraId: string;
  dataInicio: string;
  dataFim: string;
}

interface FormState {
  nome: string;
  cpf: string;
  quadraId: string;
  data: string;
  horarioInicio: string;
}

interface HorariosResponse {
  horariosIndividuais: string[];
}

interface UseReservaFormProps {
  onSuccess: () => void;
  onError: (mensagem: string) => void;
}

const DURACAO_RESERVA_MINUTOS = 60;

export const useReservaForm = ({ onSuccess, onError }: UseReservaFormProps) => {
  const [formState, setFormState] = useState<FormState>({
    nome: "",
    cpf: "",
    quadraId: "",
    data: "",
    horarioInicio: "",
  });

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingHorarios, setIsFetchingHorarios] = useState(false); // NOVO: Loading específico para horários

  // ===== INÍCIO DA CORREÇÃO =====
  const getWeekRange = () => {
    // Helper para formatar a data para YYYY-MM-DD no fuso horário local
    const toYYYYMMDD = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const dayOfWeek = today.getDay(); // Domingo = 0, Segunda = 1, etc.

    // A lógica para encontrar segunda-feira estava correta
    const monday = new Date(today);
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(today.getDate() - diffToMonday);

    // A lógica para encontrar domingo estava correta
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // CORRIGIDO: Usamos a função helper para evitar problemas de fuso horário
    const minDate = toYYYYMMDD(today); // O dia mínimo é hoje (local)
    const maxDate = toYYYYMMDD(sunday); // O dia máximo é o domingo da semana (local)

    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getWeekRange();

  // Buscar quadras ao montar o hook (sem alterações, apenas movido para cima)
  useEffect(() => {
    const fetchQuadras = async () => {
      try {
        const response = await quadrasService.getQuadras();
        setQuadras(response.data);
      } catch (err) {
        // console.error("Erro ao buscar quadras", err);
        onError("Não foi possível carregar a lista de quadras.");
      }
    };
    fetchQuadras();
  }, [onError]); // Adicionado onError como dependência estável

  // NOVO: Efeito que busca horários AUTOMATICAMENTE quando data ou quadra mudam
  useEffect(() => {
    const fetchHorarios = async () => {
      if (formState.data && formState.quadraId) {
        setIsFetchingHorarios(true);
        setHorarios([]); // Limpa horários antigos
        try {
          const response = await reservaService.getHorariosDisponiveis(
            formState.quadraId,
            formState.data
          );
          const dataResponse = response.data as unknown as HorariosResponse;
          setHorarios(dataResponse.horariosIndividuais);
        } catch (err) {
          // console.error("Erro ao buscar horários", err);
          // Não chama o `onError` da página, pois é um erro recuperável (o usuário pode trocar a data)
        } finally {
          setIsFetchingHorarios(false);
        }
      }
    };

    fetchHorarios();
  }, [formState.data, formState.quadraId]); // Dependências que disparam o efeito

  // ALTERADO: Handler de input unificado e mais inteligente
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let finalValue = value;
    if (name === "cpf") {
      finalValue = formatCPF(value);
    }

    setFormState((prev) => ({
      ...prev,
      [name]: finalValue,
      // Se a data ou a quadra mudou, reseta o horário para forçar nova seleção
      ...((name === "data" || name === "quadraId") && { horarioInicio: "" }),
    }));
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ALTERADO: Validação agora joga um erro para ser pego pelo catch
      const { nome, cpf, quadraId, data, horarioInicio } = formState;
      if (!nome || !cpf || !quadraId || !data || !horarioInicio) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      if (!validateCPF(cpf)) {
        throw new Error("CPF inválido.");
      }

      const dataInicio = `${data}T${horarioInicio}`;
      const dataFim = new Date(
        new Date(dataInicio).getTime() + DURACAO_RESERVA_MINUTOS * 60000
      )
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .slice(0, 16);

      const payload: FormData = { nome, cpf, quadraId, dataInicio, dataFim };

      await reservaService.createReserva(payload);
      onSuccess();
    } catch (err) {
      // console.error("Erro ao criar reserva", err);
      let errorMessage = "Ocorreu um erro inesperado.";

      if (err instanceof AxiosError && err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    handleInputChange, // ALTERADO: Exporta o novo handler
    handleSubmit,
    quadras,
    horarios,
    // O loading geral agora considera o loading da submissão OU da busca de horários
    loading: loading || isFetchingHorarios,
    minDate, // NOVO: Exportando a data mínima
    maxDate, // NOVO: Exportando a data máxima
    // REMOVIDO: `updateField` e `fetchHorarios` não são mais necessários na UI
  };
};

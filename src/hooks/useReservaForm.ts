// src/hooks/useReservaForm.ts

import { useState, useEffect } from "react";
import { validateCPF, formatCPF } from "../utils/utils";
import { reservaService, quadrasService, type Quadra } from "./apiServices"; 
import { AxiosError } from "axios"; 


export interface FormData {
  nome: string;
  cpf: string;
  quadraId: string;
  dataInicio: string;
  dataFim: string;
  origem: string;
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
  const [isFetchingHorarios, setIsFetchingHorarios] = useState(false); 

  const getWeekRange = () => {
    const toYYYYMMDD = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const dayOfWeek = today.getDay(); // Domingo = 0, Segunda = 1, etc.


    const monday = new Date(today);
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(today.getDate() - diffToMonday);

 
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);


    const minDate = toYYYYMMDD(today); 
    const maxDate = toYYYYMMDD(sunday); 
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getWeekRange();


  useEffect(() => {
    const fetchQuadras = async () => {
      try {
        const response = await quadrasService.getQuadras();
        setQuadras(response.data);
      } catch (err) {
        onError("Não foi possível carregar a lista de quadras.");
      }
    };
    fetchQuadras();
  }, [onError]); 

  useEffect(() => {
    const fetchHorarios = async () => {
      if (formState.data && formState.quadraId) {
        setIsFetchingHorarios(true);
        setHorarios([]); 
        try {
          const response = await reservaService.getHorariosDisponiveis(
            formState.quadraId,
            formState.data
          );
          const dataResponse = response.data as unknown as HorariosResponse;
          setHorarios(dataResponse.horariosIndividuais);
        } catch (err) {
          // console.error("Erro ao buscar horários", err);
        } finally {
          setIsFetchingHorarios(false);
        }
      }
    };

    fetchHorarios();
  }, [formState.data, formState.quadraId]); 

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

      ...((name === "data" || name === "quadraId") && { horarioInicio: "" }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      const payload: FormData = {
        nome,
        cpf,
        quadraId,
        dataInicio,
        dataFim,
        origem: "LandingPage",
      };

      await reservaService.createReserva(payload);
      onSuccess();
    } catch (err) {
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
    handleInputChange, 
    handleSubmit,
    quadras,
    horarios,

    loading: loading || isFetchingHorarios,
    minDate, 
    maxDate, 

  };
};

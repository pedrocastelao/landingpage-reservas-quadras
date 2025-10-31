// src/services/apiServices.ts

import api from "./axiosConfig";

// 1. Interface atualizada para corresponder ao payload final da API
export interface DadosReserva {
  nome: string;
  cpf: string;
  quadraId: string; // Deve ser o ID da quadra
  dataInicio: string; // Formato 'YYYY-MM-DDTHH:mm'
  dataFim: string; // Formato 'YYYY-MM-DDTHH:mm'
}

// Interface para o retorno da lista de quadras
export interface Quadra {
  id: string;
  localizacao: string;
  tipo: string;
}

export const reservaService = {
  // Tipagem forte no parâmetro da função
  createReserva: (dadosReserva: DadosReserva) =>
    api.post(`/reserva/nova`, dadosReserva),

  getReservas: () => api.get(`/reservas`),

  getHorariosDisponiveis: (data: string, quadraId: string) =>
    api.get<string[]>(`/reserva/horarios/${quadraId}/${data}`), // Tipando o retorno
};

export const quadrasService = {
  // Tipando o retorno para garantir que recebemos um array de Quadras
  getQuadras: () => api.get<Quadra[]>(`/quadras`),
};

// src/services/apiServices.ts

import api from "./axiosConfig";

export interface DadosReserva {
  nome: string;
  cpf: string;
  quadraId: string; 
  dataInicio: string; // Formato 'YYYY-MM-DDTHH:mm'
  dataFim: string; // Formato 'YYYY-MM-DDTHH:mm'
}


export interface Quadra {
  id: string;
  localizacao: string;
  tipo: string;
}

export const reservaService = {

  createReserva: (dadosReserva: DadosReserva) =>
    api.post(`/reserva/nova`, dadosReserva),

  getReservas: () => api.get(`/reservas`),

  getHorariosDisponiveis: (data: string, quadraId: string) =>
    api.get<string[]>(`/reserva/horarios/${quadraId}/${data}`), 

  getReservaCpf: (cpf: string) => api.get(`/reservas/cpf/${cpf}`),
};

export const quadrasService = {

  getQuadras: () => api.get<Quadra[]>(`/quadras`),
};

export const configuracoesService = {
  getDiaReserva: () =>
    api.get<{ valor: string; regra: string }[]>(`/configuracoes`),
};

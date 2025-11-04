export interface Reserva {
  id: string;
  nomeCliente: string;
  data: string; // Ex: "2025-11-10T14:00:00.000Z"
  quadra: string; // Ex: "Quadra 1"
  status: string; // Ex: "Confirmada"
  // Adicione outros campos que sua API retornar
}
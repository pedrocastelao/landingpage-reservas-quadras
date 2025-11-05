export interface Reserva {
  id: string;
  nome: string; // <-- MUDOU DE nomeCliente
  dataInicio: string; // <-- MUDOU DE data
  dataFim: string; // <-- NOVO CAMPO
  status: number; // <-- MUDOU DE string
  Quadra: {
    // <-- MUDOU DE quadra: string
    tipo: string;
    localizacao: string;
    preco: string;
  };
  // Adicione outros campos se precisar
}

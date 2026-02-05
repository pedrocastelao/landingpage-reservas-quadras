export interface Reserva {
  id: string;
  nome: string; 
  dataInicio: string; 
  dataFim: string; 
  status: number; 
  Quadra: {
    tipo: string;
    localizacao: string;
    preco: string;
  };
}

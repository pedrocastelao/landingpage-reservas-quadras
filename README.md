# 🏟️ Sistema de Reservas de Quadras Esportivas

> Projeto desenvolvido para otimizar o agendamento de espaços esportivos públicos para a Prefeitura de Teodoro Sampaio - SP.

---

## 📋 Sobre o Projeto

Este sistema permite que os cidadãos façam reservas de forma simples e rápida. A aplicação oferece:

- 📅 Seleção de data e horário disponível
- 🏀 Escolha entre diferentes tipos de quadras (Futebol Society, Basquete, Vôlei, Tênis, Poliesportiva)
- ✅ Validação de CPF
- 📊 Visualização de horários disponíveis em tempo real
- 🔔 Confirmação de reserva por email
- 📱 Interface responsiva e moderna

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Lucide React** - Biblioteca de ícones

### Bibliotecas Principais
- **Axios** - Cliente HTTP para comunicação com a API
- **React DatePicker** - Componente de seleção de data

### Ferramentas de Desenvolvimento
- **PostCSS** - Ferramenta para transformação de CSS
- **Autoprefixer** - Plugin PostCSS para adicionar prefixos de navegadores

## 🛠️ Como Rodar o Projeto
1. Clone o repositório.
2. **Instale as dependências**
```bash
npm install
```
3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.development` na raiz do projeto (ou edite o existente) e adicione a URL da API:
```env
VITE_API=https://backend-g18t.onrender.com
```
4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```
5. **Acesse a aplicação**
LOG: Abra o navegador e acesse

**SISTEMA NO AR - CASO TENHAM CURIOSIDADE**
https://landingpage-reservas-quadras.vercel.app/


## 🎯 Exemplos Práticos de Uso

### 1️⃣ Fazendo uma Reserva

Siga os passos abaixo para testar o sistema:

1. **Acesse a aplicação** no navegador
2. **Preencha o formulário de reserva** com os seguintes dados:
   ```
   Nome Completo: João da Silva
   CPF: 123.456.789-09 (use um CPF válido)
   ```
3. **Selecione a quadra desejada**
4. **Escolha a data** (limitado à semana atual)
5. **Selecione o horário disponível** na lista
6. **Clique em "Reservar"**
7. **Aguarde a confirmação** ✅

### 2️⃣ Consultando sua Reserva

Após fazer a reserva, você pode consultá-la:

1. **Digite seu CPF** no campo de consulta
2. **Clique em "Consultar Reservas"**
3. **Visualize todas as suas reservas** com os seguintes detalhes:
   - Nome do solicitante
   - Quadra reservada
   - Data e horário
   - Status da reserva

### 📌 Status das Reservas

Sua reserva pode ter os seguintes status:

| Status | Descrição |
|--------|-----------|
| ⏳ **Pendente** | Reserva criada, aguardando aprovação |
| ✅ **Aprovada** | Reserva aprovada pelo administrador |
| ❌ **Cancelada** | Reserva cancelada |
| 🏁 **Concluída** | Reserva já utilizada |

> ⚠️ **IMPORTANTE**: Todas as reservas são criadas com status **Pendente**. Para que sua reserva seja **ativada/confirmada**, ela precisa ser **aceita por um administrador no Painel Administrativo**. 




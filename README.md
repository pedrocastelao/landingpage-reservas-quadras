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
URL_API=https://backend-g18t.onrender.com
```
4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```
5. **Acesse a aplicação**
Abra o navegador e acesse: `http://localhost:5173`



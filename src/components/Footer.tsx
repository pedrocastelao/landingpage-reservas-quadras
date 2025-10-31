// src/components/Footer.tsx
const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-lg font-semibold mb-2">
        Prefeitura Municipal de Teodoro Sampaio - SP
      </p>
      <p className="text-gray-300 mb-4">
        Sistema de Reservas de Quadras Esportivas
      </p>
      <p className="text-sm text-gray-400">
        Para dúvidas e informações:
        <a
          href="https://www.teodoros.siteparaprefeituras.com.br/"
          className="text-blue-400 hover:text-blue-300 ml-1"
        >
          teodoros.siteparaprefeituras.com.br
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;

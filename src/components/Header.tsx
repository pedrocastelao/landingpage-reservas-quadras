// src/components/Header.tsx
import { MapPin } from "lucide-react";

const Header = () => (
  <header className="bg-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Prefeitura de Teodoro Sampaio
            </h1>
            <p className="text-gray-600">Sistema de Reservas de Quadras</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;

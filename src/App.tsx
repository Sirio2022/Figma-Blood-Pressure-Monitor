import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AddReadingForm } from './components/AddReadingForm';
import { History } from './components/History';
import { Toaster } from 'sonner';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-reading':
        return <AddReadingForm />;
      case 'history':
        return <History />;
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Vista de Calendario</h2>
              <p className="text-gray-600">Próximamente: Visualización de lecturas en calendario</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Perfil de Usuario</h2>
              <p className="text-gray-600">Próximamente: Configuración del perfil y metas</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Configuración</h2>
              <p className="text-gray-600">Próximamente: Configuración de la aplicación</p>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Centro de Ayuda</h2>
              <p className="text-gray-600">Próximamente: Guías y preguntas frecuentes</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
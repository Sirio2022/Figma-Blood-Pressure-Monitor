import { useState } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  LayoutDashboard, 
  Plus, 
  BarChart3, 
  Settings, 
  Heart, 
  Calendar,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-reading', label: 'Nueva Lectura', icon: Plus },
    { id: 'history', label: 'Historial', icon: BarChart3 },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
  ];

  const bottomItems = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
  ];

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-full`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-medium text-gray-900">CardioTrack</h2>
                <p className="text-xs text-gray-500">Monitor de PA</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <p className="text-xs text-blue-600 mb-1">Última lectura</p>
              <p className="font-medium text-blue-900">120/80</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Normal</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'} ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {!isCollapsed && (
          <>
            <Separator className="my-6" />
            
            {/* Health Tip */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <h4 className="font-medium text-green-900 text-sm mb-2">💡 Tip del día</h4>
                <p className="text-xs text-green-800">
                  Caminar 30 minutos diarios puede reducir tu presión arterial hasta en 10 mmHg.
                </p>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'} text-gray-600 hover:bg-gray-100`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
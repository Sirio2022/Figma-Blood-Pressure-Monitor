import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, TrendingUp, Calendar, Clock } from 'lucide-react';

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  time: string;
  category: 'normal' | 'elevated' | 'high1' | 'high2' | 'crisis';
}

const mockData: Reading[] = [
  { id: '1', systolic: 120, diastolic: 80, pulse: 72, date: '2024-10-01', time: '08:30', category: 'normal' },
  { id: '2', systolic: 125, diastolic: 82, pulse: 75, date: '2024-09-30', time: '19:45', category: 'elevated' },
  { id: '3', systolic: 118, diastolic: 78, pulse: 69, date: '2024-09-29', time: '07:15', category: 'normal' },
  { id: '4', systolic: 122, diastolic: 81, pulse: 73, date: '2024-09-28', time: '20:00', category: 'normal' },
  { id: '5', systolic: 130, diastolic: 85, pulse: 78, date: '2024-09-27', time: '08:45', category: 'high1' },
  { id: '6', systolic: 115, diastolic: 75, pulse: 68, date: '2024-09-26', time: '19:30', category: 'normal' },
  { id: '7', systolic: 128, diastolic: 84, pulse: 76, date: '2024-09-25', time: '07:00', category: 'elevated' },
];

const chartData = mockData.map(reading => ({
  date: new Date(reading.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
  sistolica: reading.systolic,
  diastolica: reading.diastolic,
  pulso: reading.pulse
})).reverse();

function getCategoryColor(category: string) {
  switch (category) {
    case 'normal': return 'bg-green-100 text-green-800';
    case 'elevated': return 'bg-yellow-100 text-yellow-800';
    case 'high1': return 'bg-orange-100 text-orange-800';
    case 'high2': return 'bg-red-100 text-red-800';
    case 'crisis': return 'bg-red-200 text-red-900';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case 'normal': return 'Normal';
    case 'elevated': return 'Elevada';
    case 'high1': return 'Alta Etapa 1';
    case 'high2': return 'Alta Etapa 2';
    case 'crisis': return 'Crisis';
    default: return 'Desconocido';
  }
}

export function Dashboard() {
  const latestReading = mockData[0];
  const averageSystolic = Math.round(mockData.reduce((sum, reading) => sum + reading.systolic, 0) / mockData.length);
  const averageDiastolic = Math.round(mockData.reduce((sum, reading) => sum + reading.diastolic, 0) / mockData.length);
  const averagePulse = Math.round(mockData.reduce((sum, reading) => sum + reading.pulse, 0) / mockData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Panel de Control</h1>
          <p className="text-gray-600 mt-1">Monitoreo de presión arterial</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Última Lectura</p>
              <p className="text-2xl font-medium text-blue-900">{latestReading.systolic}/{latestReading.diastolic}</p>
              <p className="text-xs text-blue-700 mt-1">mmHg</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Badge className={getCategoryColor(latestReading.category)}>
              {getCategoryLabel(latestReading.category)}
            </Badge>
            <div className="flex items-center text-xs text-blue-600">
              <Clock className="w-3 h-3 mr-1" />
              {latestReading.time}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Promedio 7 días</p>
              <p className="text-2xl font-medium text-green-900">{averageSystolic}/{averageDiastolic}</p>
              <p className="text-xs text-green-700 mt-1">mmHg</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={75} className="h-2" />
            <p className="text-xs text-green-600 mt-2">Dentro del rango objetivo</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Pulso Promedio</p>
              <p className="text-2xl font-medium text-purple-900">{averagePulse}</p>
              <p className="text-xs text-purple-700 mt-1">BPM</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Badge className="bg-purple-100 text-purple-800">
              Normal
            </Badge>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Tendencia de Presión</h3>
              <p className="text-sm text-gray-600">Últimos 7 días</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  domain={[60, 140]}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sistolica" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Sistólica"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolica" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Diastólica"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Lecturas Recientes</h3>
              <p className="text-sm text-gray-600">Historial de mediciones</p>
            </div>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockData.slice(0, 5).map((reading) => (
              <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{reading.systolic}/{reading.diastolic}</p>
                    <p className="text-xs text-gray-500">{reading.date} • {reading.time}</p>
                  </div>
                </div>
                <Badge className={getCategoryColor(reading.category)}>
                  {getCategoryLabel(reading.category)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
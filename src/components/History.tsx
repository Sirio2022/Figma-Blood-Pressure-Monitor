import { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  TrendingDown, 
  TrendingUp,
  Heart,
  Clock
} from 'lucide-react';

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  time: string;
  category: 'normal' | 'elevated' | 'high1' | 'high2' | 'crisis';
  notes?: string;
}

const mockData: Reading[] = [
  { id: '1', systolic: 120, diastolic: 80, pulse: 72, date: '2024-10-01', time: '08:30', category: 'normal', notes: 'Después del desayuno' },
  { id: '2', systolic: 125, diastolic: 82, pulse: 75, date: '2024-09-30', time: '19:45', category: 'elevated', notes: 'Después del trabajo' },
  { id: '3', systolic: 118, diastolic: 78, pulse: 69, date: '2024-09-30', time: '07:15', category: 'normal' },
  { id: '4', systolic: 122, diastolic: 81, pulse: 73, date: '2024-09-29', time: '20:00', category: 'normal', notes: 'Antes de dormir' },
  { id: '5', systolic: 130, diastolic: 85, pulse: 78, date: '2024-09-29', time: '08:45', category: 'high1' },
  { id: '6', systolic: 115, diastolic: 75, pulse: 68, date: '2024-09-28', time: '19:30', category: 'normal' },
  { id: '7', systolic: 128, diastolic: 84, pulse: 76, date: '2024-09-28', time: '07:00', category: 'elevated', notes: 'Después del ejercicio' },
  { id: '8', systolic: 119, diastolic: 79, pulse: 71, date: '2024-09-27', time: '14:15', category: 'normal' },
  { id: '9', systolic: 124, diastolic: 83, pulse: 74, date: '2024-09-27', time: '06:45', category: 'elevated' },
  { id: '10', systolic: 117, diastolic: 77, pulse: 67, date: '2024-09-26', time: '21:20', category: 'normal' },
];

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredData = mockData.filter(reading => {
    const matchesSearch = reading.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         `${reading.systolic}/${reading.diastolic}`.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || reading.category === categoryFilter;
    const matchesDate = dateFilter === 'all' || (() => {
      const readingDate = new Date(reading.date);
      const now = new Date();
      switch (dateFilter) {
        case 'today':
          return readingDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return readingDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return readingDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const stats = {
    total: filteredData.length,
    normal: filteredData.filter(r => r.category === 'normal').length,
    elevated: filteredData.filter(r => r.category === 'elevated').length,
    high: filteredData.filter(r => ['high1', 'high2', 'crisis'].includes(r.category)).length,
  };

  const getTrend = (reading: Reading, index: number) => {
    if (index === filteredData.length - 1) return null;
    const previousReading = filteredData[index + 1];
    const currentPressure = reading.systolic + reading.diastolic;
    const previousPressure = previousReading.systolic + previousReading.diastolic;
    
    if (currentPressure > previousPressure) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (currentPressure < previousPressure) {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Historial de Lecturas</h1>
          <p className="text-gray-600 mt-1">Revisa tus mediciones anteriores</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-medium text-gray-900">{stats.total}</p>
            </div>
            <Heart className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Normal</p>
              <p className="text-2xl font-medium text-green-600">{stats.normal}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Elevada</p>
              <p className="text-2xl font-medium text-yellow-600">{stats.elevated}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alta</p>
              <p className="text-2xl font-medium text-red-600">{stats.high}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por notas o valores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="elevated">Elevada</SelectItem>
              <SelectItem value="high1">Alta Etapa 1</SelectItem>
              <SelectItem value="high2">Alta Etapa 2</SelectItem>
              <SelectItem value="crisis">Crisis</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los períodos</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Lecturas ({filteredData.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Fecha</TableHead>
                <TableHead className="w-[80px]">Hora</TableHead>
                <TableHead className="w-[120px]">Presión</TableHead>
                <TableHead className="w-[80px]">Pulso</TableHead>
                <TableHead className="w-[120px]">Categoría</TableHead>
                <TableHead className="w-[60px]">Tendencia</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((reading, index) => (
                <TableRow key={reading.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(reading.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{reading.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-lg">
                      {reading.systolic}/{reading.diastolic}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">mmHg</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{reading.pulse}</span>
                    <span className="text-xs text-gray-500 ml-1">BPM</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(reading.category)}>
                      {getCategoryLabel(reading.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getTrend(reading, index)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {reading.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron lecturas con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
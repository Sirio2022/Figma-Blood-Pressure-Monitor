import { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CalendarDays, Clock, Heart, Plus } from 'lucide-react';
import { toast } from "sonner";

interface ReadingFormData {
  systolic: string;
  diastolic: string;
  pulse: string;
  date: string;
  time: string;
  notes: string;
}

function classifyBloodPressure(systolic: number, diastolic: number) {
  if (systolic < 120 && diastolic < 80) return { category: 'normal', label: 'Normal', color: 'bg-green-100 text-green-800' };
  if (systolic < 130 && diastolic < 80) return { category: 'elevated', label: 'Elevada', color: 'bg-yellow-100 text-yellow-800' };
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return { category: 'high1', label: 'Alta Etapa 1', color: 'bg-orange-100 text-orange-800' };
  if ((systolic >= 140 && systolic <= 179) || (diastolic >= 90 && diastolic <= 119)) return { category: 'high2', label: 'Alta Etapa 2', color: 'bg-red-100 text-red-800' };
  if (systolic >= 180 || diastolic >= 120) return { category: 'crisis', label: 'Crisis Hipertensiva', color: 'bg-red-200 text-red-900' };
  return { category: 'unknown', label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
}

export function AddReadingForm() {
  const [formData, setFormData] = useState<ReadingFormData>({
    systolic: '',
    diastolic: '',
    pulse: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ReadingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    const systolic = parseInt(formData.systolic);
    const diastolic = parseInt(formData.diastolic);
    const pulse = parseInt(formData.pulse);

    if (!systolic || !diastolic || systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 130) {
      toast.error("Por favor, ingresa valores válidos de presión arterial");
      setIsSubmitting(false);
      return;
    }

    if (pulse && (pulse < 40 || pulse > 200)) {
      toast.error("Por favor, ingresa un pulso válido (40-200 BPM)");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const classification = classifyBloodPressure(systolic, diastolic);
      
      toast.success(`Lectura guardada: ${systolic}/${diastolic} mmHg - ${classification.label}`);
      
      // Reset form
      setFormData({
        systolic: '',
        diastolic: '',
        pulse: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        notes: ''
      });
    } catch (error) {
      toast.error("Error al guardar la lectura");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentClassification = () => {
    if (formData.systolic && formData.diastolic) {
      const systolic = parseInt(formData.systolic);
      const diastolic = parseInt(formData.diastolic);
      if (!isNaN(systolic) && !isNaN(diastolic)) {
        return classifyBloodPressure(systolic, diastolic);
      }
    }
    return null;
  };

  const classification = getCurrentClassification();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Nueva Lectura</h1>
          <p className="text-gray-600">Registra tu presión arterial y pulso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blood Pressure Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-5 h-5 text-red-500" />
                  <Label className="text-lg">Presión Arterial</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic">Sistólica (mmHg)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      placeholder="120"
                      value={formData.systolic}
                      onChange={(e) => handleInputChange('systolic', e.target.value)}
                      className="text-center text-lg"
                      min="70"
                      max="200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      placeholder="80"
                      value={formData.diastolic}
                      onChange={(e) => handleInputChange('diastolic', e.target.value)}
                      className="text-center text-lg"
                      min="40"
                      max="130"
                      required
                    />
                  </div>
                </div>

                {classification && (
                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                    <Badge className={classification.color}>
                      {classification.label}
                    </Badge>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pulse Input */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <Label htmlFor="pulse">Pulso (BPM)</Label>
                </div>
                <Input
                  id="pulse"
                  type="number"
                  placeholder="72"
                  value={formData.pulse}
                  onChange={(e) => handleInputChange('pulse', e.target.value)}
                  className="text-center text-lg"
                  min="40"
                  max="200"
                />
              </div>

              <Separator />

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="date">Fecha</Label>
                  </div>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="time">Hora</Label>
                  </div>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <textarea
                  id="notes"
                  placeholder="Ej: Después del ejercicio, antes de la medicación..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Lectura'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">Consejos para una medición precisa</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Relájate 5 minutos antes de medir</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Mantén los pies en el suelo</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Coloca el brazo a la altura del corazón</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>No hables durante la medición</span>
              </li>
            </ul>
          </Card>

          {/* Blood Pressure Categories */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Categorías de Presión Arterial</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Normal</span>
                <Badge className="bg-green-100 text-green-800">{"<120/80"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Elevada</span>
                <Badge className="bg-yellow-100 text-yellow-800">{"120-129/<80"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Alta Etapa 1</span>
                <Badge className="bg-orange-100 text-orange-800">130-139/80-89</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Alta Etapa 2</span>
                <Badge className="bg-red-100 text-red-800">{"≥140/≥90"}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
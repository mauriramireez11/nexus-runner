import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { PipelineStatus } from '@/types/pipeline';

const stats = [
  { label: 'Pipelines Totales', value: 12, icon: Rocket, color: 'text-primary' },
  { label: 'Ejecuciones Hoy', value: 45, icon: Activity, color: 'text-info' },
  { label: 'Éxito', value: 38, icon: CheckCircle, color: 'text-success' },
  { label: 'Fallos', value: 7, icon: XCircle, color: 'text-destructive' },
];

const recentPipelines = [
  { id: '1', name: 'API Tests Production', type: 'newman', status: 'success' as PipelineStatus, lastRun: '5 min ago', duration: 120 },
  { id: '2', name: 'Mobile App Regression', type: 'mobile', status: 'running' as PipelineStatus, lastRun: 'Running...', duration: 45 },
  { id: '3', name: 'Payment Gateway Tests', type: 'newman', status: 'failed' as PipelineStatus, lastRun: '1 hour ago', duration: 89 },
  { id: '4', name: 'iOS App Smoke Test', type: 'mobile', status: 'success' as PipelineStatus, lastRun: '2 hours ago', duration: 156 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getStatusColor = (status: PipelineStatus) => {
    switch (status) {
      case 'success': return 'bg-success';
      case 'failed': return 'bg-destructive';
      case 'running': return 'bg-info animate-pulse-soft';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: PipelineStatus) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'running': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bienvenido, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Aquí está el resumen de tus pipelines de testing
          </p>
        </div>
        <Button 
          onClick={() => navigate('/pipelines/new')}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Nuevo Pipeline
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipelines List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pipelines Recientes</CardTitle>
              <CardDescription>Últimas ejecuciones de tus pipelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPipelines.map((pipeline) => (
                <div 
                  key={pipeline.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(pipeline.status)}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{pipeline.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {pipeline.type === 'newman' ? 'API' : 'Mobile'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {getStatusIcon(pipeline.status)}
                        <span>{pipeline.lastRun}</span>
                        {pipeline.duration && (
                          <>
                            <span>•</span>
                            <span>{pipeline.duration}s</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle run pipeline
                    }}
                  >
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/pipelines')}
              >
                Ver todos los pipelines
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento</CardTitle>
            <CardDescription>Tasa de éxito últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasa de éxito</span>
                <span className="text-2xl font-bold text-success">84.4%</span>
              </div>
              <Progress value={84.4} className="h-2" />
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total ejecutadas</span>
                  <span className="font-medium">234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exitosas</span>
                  <span className="font-medium text-success">197</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fallidas</span>
                  <span className="font-medium text-destructive">37</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">+5.2% vs semana anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/pipelines/new')}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Crear Pipeline
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/history')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Ver Historial
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/settings')}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Configurar Alertas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
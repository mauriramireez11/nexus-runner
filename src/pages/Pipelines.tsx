import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  Play,
  Edit,
  Trash2,
  MoreVertical,
  Rocket,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pipeline, PipelineStatus } from '@/types/pipeline';
import { useToast } from '@/hooks/use-toast';

const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'API Tests Production',
    description: 'Complete API test suite for production environment',
    type: 'newman',
    config: {
      collection: 'production-api.json',
      environment: 'prod.env',
      iterations: 1,
    },
    createdBy: 'john@testflow.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    lastRun: new Date('2024-01-20T10:30:00'),
    status: 'success'
  },
  {
    id: '2',
    name: 'Mobile App Regression',
    description: 'Full regression test suite for mobile application',
    type: 'mobile',
    config: {
      apkPath: '/apps/app-release.apk',
      testSuite: 'regression',
      device: 'Pixel_5_API_31',
      platform: 'android',
    },
    createdBy: 'jane@testflow.com',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    lastRun: new Date('2024-01-20T09:15:00'),
    status: 'running'
  },
];

export default function Pipelines() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pipelines, setPipelines] = useState(mockPipelines);

  const getStatusIcon = (status?: PipelineStatus) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running': return <Activity className="w-4 h-4 text-info" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status?: PipelineStatus) => {
    if (!status) return null;
    
    const variants: Record<PipelineStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      success: 'default',
      failed: 'destructive',
      running: 'secondary',
      idle: 'outline',
      cancelled: 'outline'
    };

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const handleRunPipeline = (id: string) => {
    setPipelines(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'running' as PipelineStatus } : p
    ));
    
    toast({
      title: "Pipeline ejecutado",
      description: "El pipeline ha sido iniciado exitosamente",
    });

    // Simulate completion after 3 seconds
    setTimeout(() => {
      setPipelines(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'success' as PipelineStatus, lastRun: new Date() } : p
      ));
    }, 3000);
  };

  const handleDeletePipeline = (id: string) => {
    setPipelines(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Pipeline eliminado",
      description: "El pipeline ha sido eliminado exitosamente",
    });
  };

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pipeline.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || pipeline.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pipelines</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y ejecuta tus pipelines de testing
          </p>
        </div>
        <Button 
          onClick={() => navigate('/pipelines/new')}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pipeline
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pipelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="newman">Newman</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pipelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPipelines.map((pipeline) => (
          <Card 
            key={pipeline.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => navigate(`/pipelines/${pipeline.id}`)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {pipeline.type === 'newman' ? (
                    <Rocket className="h-5 w-5 text-primary" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-accent" />
                  )}
                  <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleRunPipeline(pipeline.id);
                    }}>
                      <Play className="mr-2 h-4 w-4" />
                      Ejecutar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pipelines/${pipeline.id}/edit`);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePipeline(pipeline.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <CardDescription className="mt-2 line-clamp-2">
                {pipeline.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(pipeline.status)}
                    {getStatusBadge(pipeline.status)}
                  </div>
                </div>
                
                {pipeline.lastRun && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Última ejecución</span>
                    <span className="text-sm">
                      {new Date(pipeline.lastRun).toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
                
                <Button 
                  className="w-full mt-4"
                  variant={pipeline.status === 'running' ? 'secondary' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunPipeline(pipeline.id);
                  }}
                  disabled={pipeline.status === 'running'}
                >
                  {pipeline.status === 'running' ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Ejecutar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPipelines.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron pipelines</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primer pipeline para comenzar'}
            </p>
            {!(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
              <Button onClick={() => navigate('/pipelines/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Pipeline
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
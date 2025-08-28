import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Download,
  Eye,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Execution, PipelineStatus } from '@/types/pipeline';

const mockExecutions: Execution[] = [
  {
    id: '1',
    pipelineId: '1',
    pipelineName: 'API Tests Production',
    status: 'success',
    startedAt: new Date('2024-01-20T10:30:00'),
    completedAt: new Date('2024-01-20T10:32:00'),
    duration: 120,
    triggeredBy: 'john@testflow.com',
    result: {
      passed: 45,
      failed: 0,
      skipped: 2,
      total: 47,
    }
  },
  {
    id: '2',
    pipelineId: '2',
    pipelineName: 'Mobile App Regression',
    status: 'failed',
    startedAt: new Date('2024-01-20T09:15:00'),
    completedAt: new Date('2024-01-20T09:20:00'),
    duration: 300,
    triggeredBy: 'jane@testflow.com',
    result: {
      passed: 28,
      failed: 5,
      skipped: 0,
      total: 33,
    }
  },
  {
    id: '3',
    pipelineId: '1',
    pipelineName: 'API Tests Production',
    status: 'success',
    startedAt: new Date('2024-01-19T14:00:00'),
    completedAt: new Date('2024-01-19T14:02:30'),
    duration: 150,
    triggeredBy: 'admin@testflow.com',
    result: {
      passed: 45,
      failed: 0,
      skipped: 2,
      total: 47,
    }
  },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  const getStatusIcon = (status: PipelineStatus) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running': return <Activity className="w-4 h-4 text-info animate-spin" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: PipelineStatus) => {
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

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateSuccessRate = () => {
    const successCount = mockExecutions.filter(e => e.status === 'success').length;
    return ((successCount / mockExecutions.length) * 100).toFixed(1);
  };

  const filteredExecutions = mockExecutions.filter(execution => {
    const matchesSearch = execution.pipelineName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Historial de Ejecuciones</h1>
        <p className="text-muted-foreground mt-1">
          Revisa el historial completo de todas las ejecuciones de pipelines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ejecuciones</p>
                <p className="text-2xl font-bold mt-1">{mockExecutions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
                <p className="text-2xl font-bold mt-1">{calculateSuccessRate()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <p className="text-2xl font-bold mt-1">2.3m</p>
              </div>
              <Clock className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tests Totales</p>
                <p className="text-2xl font-bold mt-1">127</p>
              </div>
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por nombre de pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="7days">Últimos 7 días</SelectItem>
                <SelectItem value="30days">Últimos 30 días</SelectItem>
                <SelectItem value="all">Todo</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Executions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ejecuciones Recientes</CardTitle>
          <CardDescription>
            Listado detallado de todas las ejecuciones de pipelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Resultados</TableHead>
                  <TableHead>Ejecutado por</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExecutions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell className="font-medium">
                      {execution.pipelineName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(execution.status)}
                        {getStatusBadge(execution.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {execution.duration && formatDuration(execution.duration)}
                    </TableCell>
                    <TableCell>
                      {execution.result && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-success">✓ {execution.result.passed}</span>
                          <span className="text-destructive">✗ {execution.result.failed}</span>
                          <span className="text-muted-foreground">⊘ {execution.result.skipped}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {execution.triggeredBy}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {execution.startedAt.toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
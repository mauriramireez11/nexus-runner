import React, { useState } from 'react';
import { 
  Bell, 
  Slack, 
  Mail, 
  Shield, 
  Server,
  Save,
  TestTube,
  Webhook
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function Settings() {
  const { toast } = useToast();
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notifySuccess, setNotifySuccess] = useState(true);
  const [notifyFailure, setNotifyFailure] = useState(true);
  const [macMiniUrl, setMacMiniUrl] = useState('http://192.168.1.100:3000');
  const [slackWebhook, setSlackWebhook] = useState('');

  const handleSaveNotifications = () => {
    toast({
      title: "Configuración guardada",
      description: "Las notificaciones han sido actualizadas correctamente",
    });
  };

  const handleSaveIntegrations = () => {
    toast({
      title: "Integración configurada",
      description: "La conexión con Slack ha sido establecida",
    });
  };

  const handleTestConnection = () => {
    toast({
      title: "Conexión exitosa",
      description: "La conexión con Mac Mini está funcionando correctamente",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las configuraciones de tu plataforma de testing
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferencias de Notificación
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Notificaciones por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones por correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                {emailEnabled && (
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-success"
                        checked={notifySuccess}
                        onCheckedChange={(checked) => setNotifySuccess(checked as boolean)}
                      />
                      <Label htmlFor="email-success" className="text-sm">
                        Ejecuciones exitosas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-failure"
                        checked={notifyFailure}
                        onCheckedChange={(checked) => setNotifyFailure(checked as boolean)}
                      />
                      <Label htmlFor="email-failure" className="text-sm">
                        Ejecuciones fallidas
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Slack Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="slack-notifications" className="flex items-center gap-2">
                      <Slack className="h-4 w-4" />
                      Notificaciones de Slack
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Envía notificaciones a tu workspace de Slack
                    </p>
                  </div>
                  <Switch
                    id="slack-notifications"
                    checked={slackEnabled}
                    onCheckedChange={setSlackEnabled}
                  />
                </div>

                {slackEnabled && (
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="slack-success"
                        defaultChecked
                      />
                      <Label htmlFor="slack-success" className="text-sm">
                        Ejecuciones exitosas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="slack-failure"
                        defaultChecked
                      />
                      <Label htmlFor="slack-failure" className="text-sm">
                        Ejecuciones fallidas
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Slack className="h-5 w-5" />
                Integración con Slack
              </CardTitle>
              <CardDescription>
                Conecta tu workspace de Slack para recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Ingresa la URL del webhook de tu aplicación de Slack
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Canal por defecto</Label>
                <Input
                  id="channel"
                  placeholder="#testing-notifications"
                />
              </div>

              <Button onClick={handleSaveIntegrations} className="w-full">
                <Webhook className="mr-2 h-4 w-4" />
                Conectar Slack
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Mac Mini Runner
              </CardTitle>
              <CardDescription>
                Configura la conexión con tu Mac Mini para ejecutar tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mac-url">URL del servidor</Label>
                <Input
                  id="mac-url"
                  type="url"
                  placeholder="http://192.168.1.100:3000"
                  value={macMiniUrl}
                  onChange={(e) => setMacMiniUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  URL donde está ejecutándose el servidor en tu Mac Mini
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleTestConnection} className="flex-1">
                  <TestTube className="mr-2 h-4 w-4" />
                  Probar Conexión
                </Button>
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad y Acceso
              </CardTitle>
              <CardDescription>
                Gestiona la seguridad y permisos de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticación de dos factores</p>
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sesiones activas</p>
                    <p className="text-sm text-muted-foreground">
                      Gestiona los dispositivos con sesión activa
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver sesiones
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Logs de auditoría</p>
                    <p className="text-sm text-muted-foreground">
                      Revisa el historial de actividad del sistema
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Ajustes generales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout por defecto (segundos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue="300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-parallel">Ejecuciones paralelas máximas</Label>
                <Input
                  id="max-parallel"
                  type="number"
                  defaultValue="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Retención de logs (días)</Label>
                <Input
                  id="retention"
                  type="number"
                  defaultValue="30"
                />
              </div>

              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserDetailResponse, GroupByType, MetricType } from '@/lib/types/kpi';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Mail, TrendingUp, Clock, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserDetailProps {
  data: UserDetailResponse;
  groupBy: GroupByType;
  onGroupByChange: (value: GroupByType) => void;
}

export function UserDetail({ data, groupBy, onGroupByChange }: UserDetailProps) {
  const [metricType, setMetricType] = useState<MetricType>('external');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(false);

  // Filtrer les données si excludeWeekends
  const filteredSeries = excludeWeekends
    ? data.series.filter((point) => {
        const date = new Date(point.date);
        const day = date.getDay();
        return day !== 0 && day !== 6; // Exclure dimanche (0) et samedi (6)
      })
    : data.series;

  // Préparer les données pour les graphiques
  const chartData = filteredSeries.map((point) => {
    const metrics = point[metricType];
    return {
      date: format(new Date(point.date), 'dd/MM', { locale: fr }),
      fullDate: point.date,
      delaip50: metrics.first_reply_p50_min || 0,
      sla: metrics.first_reply_within_sla || 0,
      recus: metrics.received || 0,
      envoyes: metrics.sent || 0,
      backlog: metrics.backlog_total || 0,
      backlogUnread: metrics.backlog_unread || 0,
      backlogFlagged: metrics.backlog_flagged || 0,
    };
  });

  // Dernières données externes pour les insights
  const lastExternal = data.series.length > 0 ? data.series[data.series.length - 1].external : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header utilisateur */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">{data.user.displayName}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">{data.user.upn}</p>
              {data.user.department && (
                <Badge variant="secondary">{data.user.department}</Badge>
              )}
              {data.user.manager && (
                <p className="text-xs text-muted-foreground">Manager: {data.user.manager}</p>
              )}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{data.periodDays} jours</p>
              <p>SLA: {data.slaHours}h</p>
              {data.generatedAt && <p className="text-xs mt-1">{format(new Date(data.generatedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score global */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Score de performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{Math.round(data.score.totalScore)}</div>
              <p className="text-sm text-muted-foreground mt-1">Score global</p>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Réactivité</span>
                <Badge variant="secondary">{Math.round(data.score.breakdown.reactivity)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gestion backlog</span>
                <Badge variant="secondary">{Math.round(data.score.breakdown.backlog)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Efficacité</span>
                <Badge variant="secondary">{Math.round(data.score.breakdown.efficiency)}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tabs métriques */}
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground mb-2 block">Type de métrique</Label>
              <Tabs value={metricType} onValueChange={(v) => setMetricType(v as MetricType)}>
                <TabsList className="w-full">
                  <TabsTrigger value="external" className="flex-1">Externes</TabsTrigger>
                  <TabsTrigger value="internal" className="flex-1">Internes</TabsTrigger>
                  <TabsTrigger value="total" className="flex-1">Total</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Group by */}
            <div className="w-[150px]">
              <Label className="text-xs text-muted-foreground mb-2 block">Groupement</Label>
              <Select value={groupBy} onValueChange={(v) => onGroupByChange(v as GroupByType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Switches */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="exclude-weekends"
                  checked={excludeWeekends}
                  onCheckedChange={setExcludeWeekends}
                />
                <Label htmlFor="exclude-weekends" className="text-sm cursor-pointer">
                  Exclure week-ends
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="business-hours"
                  checked={businessHoursOnly}
                  onCheckedChange={setBusinessHoursOnly}
                />
                <Label htmlFor="business-hours" className="text-sm cursor-pointer">
                  Heures ouvrées
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques */}
      <div className="space-y-6">
        {/* Délai médian & SLA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Délai médian (P50) & % dans SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" className="text-xs" label={{ value: '% SLA', angle: 90, position: 'insideRight' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="delaip50" stroke="hsl(var(--primary))" strokeWidth={2} name="Délai P50 (min)" />
                <Line yAxisId="right" type="monotone" dataKey="sla" stroke="hsl(var(--accent))" strokeWidth={2} name="% dans SLA" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reçus vs Envoyés */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              E-mails reçus vs envoyés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Area type="monotone" dataKey="recus" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Reçus" />
                <Area type="monotone" dataKey="envoyes" stackId="2" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} name="Envoyés" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Backlog */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Inbox className="h-4 w-4 text-primary" />
              Backlog (Total, Non lus, Marqués)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="backlog" stackId="a" fill="hsl(var(--primary))" name="Total" />
                <Bar dataKey="backlogUnread" stackId="a" fill="hsl(var(--accent))" name="Non lus" />
                <Bar dataKey="backlogFlagged" stackId="a" fill="hsl(var(--destructive))" name="Marqués" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights / Recommandations */}
      {lastExternal && (
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-base">Recommandations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Basé sur les dernières données externes ({format(new Date(data.series[data.series.length - 1].date), 'dd/MM/yyyy', { locale: fr })})
            </p>
            
            {lastExternal.first_reply_p90_min && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                <p>
                  <span className="font-medium">Délai P90:</span> {Math.round(lastExternal.first_reply_p90_min)} minutes (90% des réponses)
                </p>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Inbox className="h-4 w-4 text-purple-500 mt-0.5" />
              <p>
                <span className="font-medium">Backlog actuel:</span> {lastExternal.backlog_total || 0} e-mails
              </p>
            </div>

            {(lastExternal.backlog_total || 0) > 40 ? (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="font-medium text-destructive">⚠️ Priorisation recommandée</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Le backlog élevé nécessite une attention immédiate. Triez par importance et délai.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="font-medium text-green-700">✓ Rythme équilibré</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Le volume de traitement est maîtrisé. Continuez sur cette lancée.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

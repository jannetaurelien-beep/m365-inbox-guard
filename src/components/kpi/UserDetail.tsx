import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserDetailResponse, GroupByType, MetricType } from '@/lib/types/kpi';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Clock, Inbox, AlertTriangle, CheckCircle } from 'lucide-react';
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

  // Filtrer les données si excludeWeekends
  const filteredSeries = excludeWeekends
    ? data.series.filter((point) => {
        const date = new Date(point.date);
        const day = date.getDay();
        return day !== 0 && day !== 6;
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

  const lastExternal = data.series.length > 0 ? data.series[data.series.length - 1].external : null;

  return (
    <div className="space-y-6">
      {/* Header utilisateur - épuré */}
      <div className="space-y-3 pb-4 border-b">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{data.user.displayName}</h3>
            <p className="text-sm text-muted-foreground truncate">{data.user.upn}</p>
          </div>
        </div>
        {(data.user.department || data.user.manager) && (
          <div className="flex items-center gap-2 text-xs">
            {data.user.department && (
              <Badge variant="secondary">{data.user.department}</Badge>
            )}
            {data.user.manager && (
              <span className="text-muted-foreground">Manager: {data.user.manager}</span>
            )}
          </div>
        )}
      </div>

      {/* Score - compact */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Score global</p>
              <p className="text-4xl font-bold text-primary">{Math.round(data.score.totalScore)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Réactivité</span>
                <Badge variant="secondary">{Math.round(data.score.breakdown.reactivity)}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Backlog</span>
                <Badge variant="secondary">{Math.round(data.score.breakdown.backlog)}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Efficacité</span>
                <Badge variant="secondary">{Math.round(data.score.breakdown.efficiency)}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles - compact */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Tabs value={metricType} onValueChange={(v) => setMetricType(v as MetricType)} className="flex-1">
            <TabsList className="w-full">
              <TabsTrigger value="external" className="flex-1">Ext.</TabsTrigger>
              <TabsTrigger value="internal" className="flex-1">Int.</TabsTrigger>
              <TabsTrigger value="total" className="flex-1">Total</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={groupBy} onValueChange={(v) => onGroupByChange(v as GroupByType)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="exclude-weekends"
            checked={excludeWeekends}
            onCheckedChange={setExcludeWeekends}
          />
          <Label htmlFor="exclude-weekends" className="text-xs cursor-pointer">
            Exclure week-ends
          </Label>
        </div>
      </div>

      {/* Graphiques - épurés */}
      <div className="space-y-4">
        {/* Délai & SLA */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Délai médian & SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="delaip50" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="sla" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volumes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Volumes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="recus" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="envoyes" stackId="2" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Backlog */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Inbox className="h-4 w-4 text-muted-foreground" />
              Backlog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="backlog" stackId="a" fill="hsl(var(--primary))" />
                <Bar dataKey="backlogUnread" stackId="a" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights - compact */}
      {lastExternal && (
        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4 space-y-2 text-sm">
            <p className="font-medium text-foreground">Recommandations</p>
            {(lastExternal.backlog_total || 0) > 40 ? (
              <div className="flex items-start gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Backlog élevé: {lastExternal.backlog_total}</p>
                  <p className="text-xs text-muted-foreground">Priorisation recommandée</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Rythme équilibré</p>
                  <p className="text-xs text-muted-foreground">Volume maîtrisé</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

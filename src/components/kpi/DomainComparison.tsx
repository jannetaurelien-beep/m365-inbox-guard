import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainMetrics } from '@/lib/types/kpi';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Mail, Clock, AlertCircle, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DomainComparisonProps {
  domains: DomainMetrics[];
  onSelectDomain?: (domain: string) => void;
}

export function DomainComparison({ domains, onSelectDomain }: DomainComparisonProps) {
  const sortedByScore = [...domains].sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  // Données pour le graphique en barres
  const barChartData = sortedByScore.map(domain => ({
    name: domain.domain,
    'Emails reçus': domain.metrics.total.received,
    'Emails envoyés': domain.metrics.total.sent,
    'Backlog': domain.metrics.external.backlog_total || 0,
  }));

  // Données pour le pie chart des utilisateurs
  const pieChartData = sortedByScore.map(domain => ({
    name: domain.domain,
    value: domain.userCount,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-6">
      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Volume d'emails par domaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Emails reçus" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Emails envoyés" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Backlog" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Répartition des utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cartes détaillées */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Détails par domaine</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedByScore.map((domain, index) => {
            const score = domain.avgScore || 0;
            const sla = domain.metrics.external.first_reply_within_sla || 0;
            const backlog = domain.metrics.external.backlog_total || 0;

            return (
              <Card 
                key={domain.domain} 
                className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => onSelectDomain?.(domain.domain)}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getScoreGradient(score)}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {domain.domain}
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            #1
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {domain.userCount} boîte{domain.userCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        SLA respecté
                      </span>
                      <span className="font-medium">{sla.toFixed(0)}%</span>
                    </div>
                    <Progress value={sla} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                      <div className="text-2xl font-bold">
                        {domain.metrics.total.received.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Reçus
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {backlog.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Backlog
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

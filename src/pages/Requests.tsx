import { Archive, TrendingUp, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockRequests } from '@/lib/mock-data';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-5 w-5 text-warning" />;
    case 'in-progress': return <RefreshCw className="h-5 w-5 text-primary animate-spin" />;
    case 'completed': return <CheckCircle className="h-5 w-5 text-accent" />;
    case 'error': return <XCircle className="h-5 w-5 text-destructive" />;
    default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'in-progress': return 'En cours';
    case 'completed': return 'Terminé';
    case 'error': return 'Erreur';
    default: return status;
  }
};

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'in-progress': return 'default';
    case 'completed': return 'outline';
    case 'error': return 'destructive';
    default: return 'secondary';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'archivage': return <Archive className="h-5 w-5" />;
    case 'licence': return <TrendingUp className="h-5 w-5" />;
    case 'conversion': return <RefreshCw className="h-5 w-5" />;
    default: return <AlertCircle className="h-5 w-5" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'archivage': return 'Archivage';
    case 'licence': return 'Changement licence';
    case 'conversion': return 'Conversion boîte';
    default: return type;
  }
};

export default function Requests() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandes</h1>
        <p className="text-muted-foreground mt-1">Suivi des opérations en cours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['pending', 'in-progress', 'completed', 'error'].map((status) => {
          const count = mockRequests.filter(r => r.status === status).length;
          return (
            <Card key={status} className="p-6 shadow-card">
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{getStatusLabel(status)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-6">Toutes les demandes</h3>
        <div className="space-y-3">
          {mockRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => navigate(`/demandes/${request.id}`)}
              className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-smooth cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {getTypeIcon(request.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-semibold">{getTypeLabel(request.type)}</h4>
                    <p className="text-sm text-muted-foreground">{request.userName}</p>
                  </div>
                  <Badge variant={getStatusVariant(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{request.details}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Créé le {new Date(request.createdAt).toLocaleString('fr-FR')}</span>
                  {request.completedAt && (
                    <span>• Terminé le {new Date(request.completedAt).toLocaleString('fr-FR')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

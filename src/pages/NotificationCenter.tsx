import { useState, useMemo } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Bell, CheckCheck, Trash2, Search, Filter, TrendingUp, Clock, Archive, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAll } = useNotifications();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-7 w-7 text-accent" />;
      case 'error':
        return <AlertCircle className="h-7 w-7 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-7 w-7 text-warning" />;
      default:
        return <Info className="h-7 w-7 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'success': return 'Succès';
      case 'error': return 'Erreur';
      case 'warning': return 'Avertissement';
      default: return 'Information';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-accent/20 text-accent border-accent/30';
      case 'error': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'warning': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-4 border-l-accent';
      case 'error': return 'border-l-4 border-l-destructive';
      case 'warning': return 'border-l-4 border-l-warning';
      default: return 'border-l-4 border-l-primary';
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = unreadCount;
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, unread, byType };
  }, [notifications, unreadCount]);

  // Filtrage et recherche
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Filtre par statut
    if (filterStatus === 'read') {
      filtered = filtered.filter(n => n.read);
    } else if (filterStatus === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }

    // Tri
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === 'type') {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    }

    return filtered;
  }, [notifications, searchQuery, filterType, filterStatus, sortBy]);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-12 w-12 text-primary animate-bounce-in" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center animate-pulse-soft">
              {unreadCount}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Centre de notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez toutes vos notifications en un seul endroit
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4 animate-slide-in">
        <Card className="hover:shadow-card-hover transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">notifications</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
            <div className="p-2 rounded-full bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.unread}</div>
            <p className="text-xs text-muted-foreground mt-1">à traiter</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Succès</CardTitle>
            <div className="p-2 rounded-full bg-accent/10">
              <CheckCircle className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.byType.success || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">réussies</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-destructive/5 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.byType.error || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">à vérifier</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre d'actions et filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="warning">Avertissement</SelectItem>
                  <SelectItem value="error">Erreur</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="unread">Non lus</SelectItem>
                  <SelectItem value="read">Lus</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'type')}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div className="relative mb-6">
                <Bell className="h-24 w-24 text-muted-foreground/30" />
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Aucune notification
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                  ? '🔍 Aucun résultat ne correspond à vos critères de recherche'
                  : '✨ Vous êtes à jour ! Aucune notification pour le moment.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-card-hover hover:-translate-y-1 relative overflow-hidden group ${
                      !notification.read
                        ? 'bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/30 shadow-card'
                        : 'bg-card border-border/50 hover:bg-accent/5'
                    } ${getCardColor(notification.type)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {!notification.read && (
                      <div className="absolute top-0 right-0 w-2 h-2 m-4">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
                          notification.type === 'success' ? 'bg-accent/10' :
                          notification.type === 'error' ? 'bg-destructive/10' :
                          notification.type === 'warning' ? 'bg-warning/10' :
                          'bg-primary/10'
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-bold text-lg">{notification.title}</h4>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`${getTypeColor(notification.type)} font-semibold`}>
                                {getTypeLabel(notification.type)}
                              </Badge>
                              {!notification.read && (
                                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold animate-pulse-soft">
                                  ✨ Nouveau
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0 hover:bg-destructive/10 hover:text-destructive transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-muted/50">
                              {format(notification.timestamp, 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Voir les détails
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                Marquer comme lu
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

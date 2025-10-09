import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Archive, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { User } from '@/lib/mock-data';
import { userService, licenseService, mailboxService } from '@/lib/services';
import { PasswordSection } from '@/components/user-detail/PasswordSection';
import { AliasSection } from '@/components/user-detail/AliasSection';
import { MembersSection } from '@/components/user-detail/MembersSection';
import { toast } from 'sonner';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('');

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await userService.getUser(id);
      setUser(data || null);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeLicense = async () => {
    if (!user || !selectedLicense) return;
    try {
      await licenseService.upgradeLicense(user.id, selectedLicense);
      toast.success('Demande d\'upgrade envoyée');
      setShowUpgradeDialog(false);
    } catch (error) {
      toast.error('Erreur lors de l\'upgrade');
    }
  };

  const handleRequestArchive = async () => {
    if (!user) return;
    try {
      await mailboxService.requestArchive(user.id, '2020-01-01', '2023-12-31');
      toast.success('Demande d\'archivage créée');
      setShowArchiveDialog(false);
    } catch (error) {
      toast.error('Erreur lors de la demande');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Utilisateur introuvable</h2>
        <Button onClick={() => navigate('/utilisateurs')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const storagePercent = (user.stockage.utiliseGo / user.stockage.quotaGo) * 100;
  const licenses = licenseService.getLicenses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/utilisateurs')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Fiche utilisateur</h1>
          <p className="text-muted-foreground">Détails et gestion</p>
        </div>
      </div>

      {/* En-tête carte utilisateur */}
      <Card className="p-6 shadow-card">
        <div className="flex items-start gap-6">
          <img
            src={user.avatarUrl}
            alt={`${user.prenom} ${user.nom}`}
            className="w-24 h-24 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {user.prenom} {user.nom}
                </h2>
                <p className="text-muted-foreground mt-1">{user.metier}</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Badge variant="outline">
                    {user.typeBoite === 'nominative' ? 'Nominative' : 'Partagée'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="text-sm font-medium">{user.telephone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Agence</p>
                  <p className="text-sm font-medium">{user.agence}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-6">
          {/* Boîte mail */}
          <Card className="p-6 shadow-card">
            <div className="flex items-start gap-3 mb-4">
              <Briefcase className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold">Boîte mail</h3>
                <p className="text-sm text-muted-foreground">Stockage et licence</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stockage</span>
                  <span className="text-sm text-muted-foreground">
                    {user.stockage.utiliseGo} Go / {user.stockage.quotaGo} Go
                  </span>
                </div>
                <Progress value={storagePercent} className="h-3" />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Licence actuelle</span>
                <Badge>{user.licence.label}</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowUpgradeDialog(true)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade licence
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowArchiveDialog(true)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Demander archivage
                </Button>
              </div>
            </div>
          </Card>

          {/* Graphiques activité */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Activité emails</h3>
                <p className="text-sm text-muted-foreground">Messages envoyés et reçus</p>
              </div>
              <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                <TabsList>
                  <TabsTrigger value="7j">7j</TabsTrigger>
                  <TabsTrigger value="30j">30j</TabsTrigger>
                  <TabsTrigger value="90j">90j</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={user.activite.envoyes.map((e, i) => ({
                date: e.date,
                envoyes: e.count,
                recus: user.activite.recus[i]?.count || 0,
              }))}>
                <defs>
                  <linearGradient id="colorEnvoyes2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecus2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="envoyes"
                  name="Envoyés"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorEnvoyes2)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="recus"
                  name="Reçus"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorRecus2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Audit log */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Journal d'audit</h3>
            <div className="space-y-3">
              {user.auditLog.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Aucune activité récente</p>
              ) : (
                user.auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{log.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.date).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          <PasswordSection userId={user.id} />
          <AliasSection userId={user.id} aliases={user.aliases} onUpdate={loadUser} />
          {user.boitePartagee.estPartagee && user.boitePartagee.membres && (
            <MembersSection
              mailboxId={user.id}
              members={user.boitePartagee.membres}
              onUpdate={loadUser}
            />
          )}
        </div>
      </div>

      {/* Dialog upgrade licence */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade de licence</DialogTitle>
            <DialogDescription>
              Sélectionnez la nouvelle licence pour cet utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedLicense} onValueChange={setSelectedLicense}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une licence" />
              </SelectTrigger>
              <SelectContent>
                {licenses.map((lic) => (
                  <SelectItem key={lic.skuId} value={lic.skuId}>
                    {lic.label} - {lic.prixMensuel}€/mois
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLicense && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">
                  {licenses.find(l => l.skuId === selectedLicense)?.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpgradeLicense} disabled={!selectedLicense}>
              Confirmer l'upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog archivage */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demande d'archivage</DialogTitle>
            <DialogDescription>
              Cette action créera une demande d'archivage pour les emails anciens
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Les emails de plus de 2 ans seront archivés automatiquement.
              Cette opération libérera de l'espace de stockage.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRequestArchive}>
              Créer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

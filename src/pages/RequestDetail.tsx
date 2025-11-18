import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Archive, TrendingUp, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, Send, Paperclip, User, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { mockRequests } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';

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

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = mockRequests.find(r => r.id === id);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'cmt_001',
      author: 'admin@exemple.fr',
      content: 'Demande prise en compte, traitement en cours.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    }
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  if (!request) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/demandes')}>
          <ArrowLeft className="h-4 w-4" />
          Retour aux demandes
        </Button>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Demande introuvable</p>
        </Card>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!comment.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le commentaire ne peut pas être vide',
        variant: 'destructive',
      });
      return;
    }

    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      author: 'admin@exemple.fr',
      content: comment,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setComment('');
    toast({
      title: 'Succès',
      description: 'Commentaire ajouté',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `att_${Date.now()}_${file.name}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadedAt: new Date().toISOString(),
    }));

    setAttachments([...attachments, ...newAttachments]);
    toast({
      title: 'Succès',
      description: `${newAttachments.length} fichier(s) ajouté(s)`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/demandes')}>
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Détails de la demande */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {getTypeIcon(request.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold">{getTypeLabel(request.type)}</h2>
                  <Badge variant={getStatusVariant(request.status)} className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">Demande #{request.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Détails</h3>
                <p className="text-muted-foreground">{request.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Utilisateur</p>
                  <p className="font-medium">{request.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                  <p className="font-medium">{new Date(request.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                {request.completedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date de fin</p>
                    <p className="font-medium">{new Date(request.completedAt).toLocaleString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Commentaires */}
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Commentaires</h3>
            
            <div className="space-y-4 mb-6">
              {comments.map((cmt) => (
                <div key={cmt.id} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{cmt.author}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(cmt.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{cmt.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder="Ajouter un commentaire..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddComment} className="w-full">
                <Send className="h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar - Pièces jointes */}
        <div className="space-y-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Pièces jointes</h3>
            
            <div className="space-y-3 mb-4">
              {attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune pièce jointe</p>
              ) : (
                attachments.map((att) => (
                  <div key={att.id} className="p-3 rounded-lg border bg-background">
                    <div className="flex items-center gap-2 mb-1">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-sm truncate flex-1">{att.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{att.size}</span>
                      <span>•</span>
                      <span>{new Date(att.uploadedAt).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <label htmlFor="file-upload">
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Paperclip className="h-4 w-4" />
                  Ajouter une pièce jointe
                </span>
              </Button>
            </label>
            <Input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>ID: {request.userId}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Créée {new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

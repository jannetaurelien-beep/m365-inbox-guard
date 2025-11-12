import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { userService } from '@/lib/services';
import { mockLicenses } from '@/lib/mock-data';

export default function CreateUser() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    metier: '',
    agence: '',
    password: '',
    confirmPassword: '',
    typeBoite: 'nominative' as 'nominative' | 'partagee',
    licenceSkuId: 'SPB',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await userService.createUser({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        metier: formData.metier,
        agence: formData.agence,
        password: formData.password,
        typeBoite: formData.typeBoite,
        licenceSkuId: formData.licenceSkuId,
      });

      if (result.success) {
        toast.success('Utilisateur créé avec succès');
        navigate('/utilisateurs');
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Créer un utilisateur</h1>
          <p className="text-muted-foreground mt-1">Ajouter une nouvelle boîte mail Microsoft 365</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 shadow-card">
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">
                    Prénom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    placeholder="Ex: Marie"
                    className={errors.prenom ? 'border-destructive' : ''}
                  />
                  {errors.prenom && (
                    <p className="text-sm text-destructive">{errors.prenom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom">
                    Nom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    placeholder="Ex: Dubois"
                    className={errors.nom ? 'border-destructive' : ''}
                  />
                  {errors.nom && (
                    <p className="text-sm text-destructive">{errors.nom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metier">Métier</Label>
                  <Input
                    id="metier"
                    value={formData.metier}
                    onChange={(e) => handleChange('metier', e.target.value)}
                    placeholder="Ex: Responsable RH"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agence">Agence</Label>
                  <Input
                    id="agence"
                    value={formData.agence}
                    onChange={(e) => handleChange('agence', e.target.value)}
                    placeholder="Ex: Paris"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className={errors.telephone ? 'border-destructive' : ''}
                  />
                  {errors.telephone && (
                    <p className="text-sm text-destructive">{errors.telephone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations de connexion */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Informations de connexion</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">
                    Adresse email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="marie.dubois@exemple.fr"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mot de passe <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Retapez le mot de passe"
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Configuration de la boîte */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Configuration de la boîte</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeBoite">Type de boîte</Label>
                  <Select
                    value={formData.typeBoite}
                    onValueChange={(value) => handleChange('typeBoite', value)}
                  >
                    <SelectTrigger id="typeBoite">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nominative">Nominative</SelectItem>
                      <SelectItem value="partagee">Partagée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licence">Licence</Label>
                  <Select
                    value={formData.licenceSkuId}
                    onValueChange={(value) => handleChange('licenceSkuId', value)}
                  >
                    <SelectTrigger id="licence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLicenses.map((license) => (
                        <SelectItem key={license.skuId} value={license.skuId}>
                          {license.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {mockLicenses.find(l => l.skuId === formData.licenceSkuId)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {isSubmitting ? 'Création en cours...' : 'Créer l\'utilisateur'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

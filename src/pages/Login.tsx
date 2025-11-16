import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de connexion (à remplacer par vraie authentification)
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/");
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Identifiant / Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="nom.prenom@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

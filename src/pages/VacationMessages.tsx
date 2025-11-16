import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VacationMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;
  internalMessage: string;
  externalMessage: string;
  status: "active" | "upcoming" | "past";
}

const mockMessages: VacationMessage[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Jean Dupont",
    userEmail: "jean.dupont@entreprise.fr",
    startDate: new Date(2025, 0, 10),
    endDate: new Date(2025, 0, 24),
    internalMessage: "En congés, urgent uniquement contacter Marie Martin.",
    externalMessage: "Absent du bureau, de retour le 24 janvier. Pour toute urgence, contacter contact@entreprise.fr",
    status: "active",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sophie Lambert",
    userEmail: "sophie.lambert@entreprise.fr",
    startDate: new Date(2025, 1, 15),
    endDate: new Date(2025, 1, 28),
    internalMessage: "En congés d'hiver, joignable en cas d'urgence sur mon mobile.",
    externalMessage: "Absente du 15 au 28 février. Vos messages seront traités à mon retour.",
    status: "upcoming",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Pierre Martin",
    userEmail: "pierre.martin@entreprise.fr",
    startDate: new Date(2024, 11, 20),
    endDate: new Date(2025, 0, 5),
    internalMessage: "Congés de fin d'année.",
    externalMessage: "Absent pour les fêtes, de retour en janvier.",
    status: "past",
  },
];

export default function VacationMessages() {
  const [messages, setMessages] = useState<VacationMessage[]>(mockMessages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<VacationMessage | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const activeMessages = messages.filter((m) => m.status === "active");
  const upcomingMessages = messages.filter((m) => m.status === "upcoming");
  const pastMessages = messages.filter((m) => m.status === "past");

  const handleDelete = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleEdit = (message: VacationMessage) => {
    setEditingMessage(message);
    setStartDate(message.startDate);
    setEndDate(message.endDate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMessage(null);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const renderTable = (data: VacationMessage[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Date début</TableHead>
          <TableHead>Date fin</TableHead>
          <TableHead>Message interne</TableHead>
          <TableHead>Message externe</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              Aucun message d'absence dans cette catégorie
            </TableCell>
          </TableRow>
        ) : (
          data.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{message.userName}</span>
                  <span className="text-sm text-muted-foreground">{message.userEmail}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(message.startDate, "dd MMM yyyy", { locale: fr })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(message.endDate, "dd MMM yyyy", { locale: fr })}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{message.internalMessage}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{message.externalMessage}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(message)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Messages d'absence
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les messages de vacances et d'absence des utilisateurs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMessage(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMessage ? "Modifier le message d'absence" : "Nouveau message d'absence"}
              </DialogTitle>
              <DialogDescription>
                Configurez les dates et les messages d'absence pour un utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Utilisateur</Label>
                <Input
                  id="userName"
                  placeholder="Nom de l'utilisateur"
                  defaultValue={editingMessage?.userName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="email@entreprise.fr"
                  defaultValue={editingMessage?.userEmail}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalMessage">Message interne</Label>
                <Textarea
                  id="internalMessage"
                  placeholder="Message visible uniquement par les collègues..."
                  defaultValue={editingMessage?.internalMessage}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="externalMessage">Message externe</Label>
                <Textarea
                  id="externalMessage"
                  placeholder="Message visible par les correspondants externes..."
                  defaultValue={editingMessage?.externalMessage}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button onClick={handleCloseDialog}>
                {editingMessage ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="active"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Badge variant="default" className="mr-2">
                {activeMessages.length}
              </Badge>
              Actifs
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Badge variant="secondary" className="mr-2">
                {upcomingMessages.length}
              </Badge>
              À venir
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Badge variant="outline" className="mr-2">
                {pastMessages.length}
              </Badge>
              Passés
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 animate-fade-in">
            {renderTable(activeMessages)}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6 animate-fade-in">
            {renderTable(upcomingMessages)}
          </TabsContent>

          <TabsContent value="past" className="mt-6 animate-fade-in">
            {renderTable(pastMessages)}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

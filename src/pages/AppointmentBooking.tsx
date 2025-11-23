import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { appointmentService } from "@/lib/services";
import { useNotifications } from "@/contexts/NotificationContext";

const formSchema = z.object({
  problemType: z.enum(["informatique", "telephonique"], {
    required_error: "Veuillez sélectionner un type de problème",
  }),
  agence: z.string().min(1, "Veuillez sélectionner une agence"),
  personName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  appointmentDate: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const agencies = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Bordeaux",
];

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personName: "",
      description: "",
      agence: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await appointmentService.createAppointment({
        problemType: data.problemType,
        agence: data.agence,
        personName: data.personName,
        description: data.description,
        appointmentDate: data.appointmentDate.toISOString(),
      });

      if (result.success) {
        toast({
          title: "Rendez-vous créé",
          description: `Votre demande de rendez-vous a été enregistrée avec succès. ID: ${result.appointmentId}`,
        });
        addNotification({
          type: 'success',
          title: 'Rendez-vous créé',
          message: `Rendez-vous ${data.problemType} pour ${data.personName} le ${format(data.appointmentDate, 'dd MMMM yyyy', { locale: fr })}`,
          actionUrl: '/demandes'
        });
        navigate("/demandes");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
      addNotification({
        type: 'error',
        title: 'Erreur de rendez-vous',
        message: 'Impossible de créer le rendez-vous',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/actions")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Prise de rendez-vous technicien</h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire pour planifier une intervention technique
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la demande</CardTitle>
          <CardDescription>
            Décrivez votre problème et choisissez une date pour l'intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="problemType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de problème</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="informatique">Informatique</SelectItem>
                          <SelectItem value="telephonique">Téléphonique</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agence</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une agence" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {agencies.map((agence) => (
                            <SelectItem key={agence} value={agence}>
                              {agence}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="personName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la personne</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description du problème</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez en détail le problème rencontré..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date du rendez-vous</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/actions")}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer le rendez-vous"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

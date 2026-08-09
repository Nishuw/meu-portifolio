import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Github, Linkedin, Globe, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSEO } from "@/hooks/useSEO";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome (mínimo 2 caracteres)."),
  email: z.string().trim().email("Informe um e-mail válido."),
  subject: z.string().trim().max(120, "Assunto muito longo.").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Escreva uma mensagem com pelo menos 10 caracteres."),
  // Honeypot anti-spam: deve permanecer vazio.
  company: z.string().max(0).optional().or(z.literal("")),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EMAIL = "ryan.nishikawa@hotmail.com";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com/Nishuw" },
  { name: "LinkedIn", icon: Linkedin, url: "http://www.linkedin.com/in/ryan-nishikawa" },
  { name: "Portfólio", icon: Globe, url: "https://www.nishikawa.app/" },
];

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useSEO({
    title: "Contato | Ryan Nishikawa",
    description:
      "Fale com Ryan Nishikawa sobre projetos de automação, IA, RPA e integrações. Envie uma mensagem pelo formulário.",
    type: "profile",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", company: "" },
  });

  const sendViaMailto = (data: ContactFormValues) => {
    const subject = data.subject?.trim() || `Contato pelo portfólio: ${data.name}`;
    const body = `Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (data: ContactFormValues) => {
    // Honeypot preenchido => provável bot: finge sucesso e ignora.
    if (data.company) {
      setStatus("success");
      reset();
      return;
    }

    setStatus("idle");

    // Sem serviço de e-mail configurado: usa mailto como fallback.
    if (!WEB3FORMS_KEY) {
      sendViaMailto(data);
      setStatus("success");
      toast.success("Abrindo seu app de e-mail para enviar a mensagem.");
      reset();
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: data.name,
          email: data.email,
          subject: data.subject?.trim() || `Contato pelo portfólio: ${data.name}`,
          message: data.message,
          from_name: "Portfólio Ryan Nishikawa",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        toast.success("Mensagem enviada! Retornarei em breve.");
        reset();
      } else {
        throw new Error(result.message || "Falha no envio");
      }
    } catch (error) {
      setStatus("error");
      toast.error("Não foi possível enviar. Tente novamente ou use o e-mail direto.");
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar />

        <section className="px-6 pt-28 md:pt-32 pb-32">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4 fade-in-up">
              Contato
            </p>
            <h1 className="text-display font-serif max-w-3xl fade-in-up fade-in-up-delay-1">
              Vamos conversar sobre o seu próximo projeto.
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
              {/* Formulário */}
              <div className="lg:col-span-7 fade-in-up fade-in-up-delay-2">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  {/* Honeypot invisível */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    {...register("company")}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        aria-invalid={!!errors.name}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="voce@exemplo.com"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto (opcional)</Label>
                    <Input
                      id="subject"
                      placeholder="Sobre o que deseja falar?"
                      aria-invalid={!!errors.subject}
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="Conte um pouco sobre a sua ideia ou necessidade..."
                      aria-invalid={!!errors.message}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="rounded-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" /> Enviando...
                        </>
                      ) : (
                        <>
                          <Send /> Enviar mensagem
                        </>
                      )}
                    </Button>

                    {status === "success" && (
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Mensagem recebida. Obrigado!
                      </span>
                    )}
                    {status === "error" && (
                      <span className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle size={16} />
                        Algo deu errado. Tente novamente.
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Informações diretas */}
              <div className="lg:col-span-5 fade-in-up fade-in-up-delay-3">
                <div className="space-y-8 lg:pl-8 lg:border-l border-border">
                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                      Direto
                    </h2>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${EMAIL}`}
                        className="text-sm hover:opacity-70 transition-opacity flex items-center gap-2"
                      >
                        <Mail size={14} />
                        {EMAIL}
                      </a>
                      <a
                        href="tel:+5519983284798"
                        className="text-sm hover:opacity-70 transition-opacity flex items-center gap-2"
                      >
                        <Phone size={14} />
                        +55 19 98328-4798
                      </a>
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <MapPin size={14} />
                        Campinas, Brasil
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                      Redes
                    </h2>
                    <div className="flex gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-border rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
                          aria-label={social.name}
                        >
                          <social.icon size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FloatingNav />
    </>
  );
};

export default Contact;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import ScrollRevealText from "@/components/ScrollRevealText";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { Mail, MapPin, Github, Linkedin, Globe, Phone } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const About = () => {
  const location = useLocation();

  useSEO({
    title: "Sobre | Ryan Nishikawa",
    description:
      "Ryan Nishikawa é desenvolvedor de software focado em Python, automação e IA: agentes com LLMs, sistemas RAG, APIs e integrações. Conheça a trajetória, stack e formação.",
    type: "profile",
  });

  useEffect(() => {
    if (location.hash === "#contact") {
      const element = document.getElementById("contact");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const skills = [
    "Python · Flask · Java",
    "RPA & Web Scraping",
    "LLMs · RAG · MCP",
    "APIs REST & Microsserviços",
    "Docker · Kubernetes",
    "SQL · NoSQL",
    "Git · CI/CD · DevOps · IaC",
    "Clean Arch · DDD · TDD",
    "AWS · GCP · Azure",
  ];

  const education = [
    { award: "Redes de Computadores · Cruzeiro do Sul", year: "cursando" },
    { award: "Back-end Python · EBAC", year: "concluído" },
    { award: "Python com Flask · Rocketseat", year: "concluído" },
    { award: "Gemini do zero ao avançado · Descomplica", year: "concluído" },
    { award: "Scripting e Automação · Udemy", year: "concluído" },
    { award: "Banco de dados MySQL · Udemy", year: "concluído" },
    { award: "Técnico em Informática · Dell", year: "concluído" },
    { award: "Scrum · Global Hitss", year: "concluído" },
  ];

  const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com/Nishuw" },
    { name: "LinkedIn", icon: Linkedin, url: "http://www.linkedin.com/in/ryan-nishikawa" },
    { name: "Portfólio", icon: Globe, url: "https://www.nishikawa.app/" },
  ];

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar />

        {/* Hero Bio Section */}
        <section className="min-h-[60vh] max-h-[70vh] flex flex-col justify-center px-6 pt-24 pb-8">
          <div className="max-w-[95%]">
            <ScrollRevealText
              text="Ryan Nishikawa transforma processos manuais em sistemas que rodam sozinhos: robôs de RPA em produção, agentes com LLMs, sistemas RAG e integrações que conectam a IA aos sistemas reais das empresas."
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-serif"
            />
          </div>
        </section>

        <ExperienceTimeline />

        {/* Bottom Info Section */}
        <section className="px-6 pt-16 pb-32 border-t border-border" id="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 fade-in-up">
            {/* Skills */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                Stack
              </h3>
              <ul className="space-y-1">
                {skills.map((skill) => (
                  <li key={skill} className="text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                Formação
              </h3>
              <ul className="space-y-1">
                {education.map((item) => (
                  <li key={item.award} className="text-sm flex justify-between gap-4">
                    <span>{item.award}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{item.year}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                Contato
              </h3>
              <div className="space-y-2">
                <a
                  href="mailto:ryan.nishikawa@hotmail.com"
                  className="text-sm hover:opacity-70 transition-opacity flex items-center gap-2"
                >
                  <Mail size={14} />
                  ryan.nishikawa@hotmail.com
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
                <div className="flex gap-2 pt-3">
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
        </section>
      </main>
      <FloatingNav />
    </>
  );
};

export default About;

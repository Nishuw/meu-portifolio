export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: string[];
  stack: string[];
}

export const experiences: ExperienceItem[] = [
  {
    role: "Analista de Desenvolvimento de RPAs",
    company: "Mix Fiscal",
    period: "2026 — atual",
    summary:
      "Automação de processos fiscais de ponta a ponta com Python, containers e boas práticas de engenharia.",
    achievements: [
      "Robôs de RPA com integração a APIs, manipulação de dados e web scraping de informações críticas",
      "Modelagem e otimização de processos operacionais, reduzindo tarefas manuais e aumentando a confiabilidade",
      "Ambientes conteinerizados com Docker, garantindo padronização, isolamento e escalabilidade",
    ],
    stack: ["Python", "RPA", "Docker", "APIs", "IaC"],
  },
  {
    role: "Desenvolvedor Backend & Analista de Redes",
    company: "Global Hitss",
    period: "2024 — 2026",
    summary:
      "Projetos de Inteligência Artificial e automação corporativa, incluindo a Clarinha, assistente virtual da Claro.",
    achievements: [
      "Participação no desenvolvimento da Clarinha, criando integrações e automações corporativas",
      "Sistemas RAG e agentes baseados em LLMs aplicados a bases documentais internas",
      "Microsserviços, APIs e bancos SQL/NoSQL sobre infraestrutura Cisco, Nokia e FortiGate",
    ],
    stack: ["Python", "LLMs", "RAG", "Docker", "Microsserviços"],
  },
  {
    role: "Analista de Suporte Técnico & Dev Backend",
    company: "Multi360 · Supernova Telecom",
    period: "2022 — 2024",
    summary:
      "Análise de dados de telecom e automações que reduziram esforço operacional e apoiaram decisões.",
    achievements: [
      "Soluções em Python para análise de CDR e otimização de processos corporativos",
      "Agentes de IA e automações RPA para reduzir esforço manual e aumentar produtividade",
      "Monitoramento e troubleshooting de rede com Zabbix e Wireshark",
    ],
    stack: ["Python", "SQL", "Zabbix", "Wireshark"],
  },
  {
    role: "Desenvolvedor Backend & Analista de Redes",
    company: "Solution Ports",
    period: "2021 — 2022",
    summary:
      "Sistema de OCR em Java para gestão de operações portuárias e processamento inteligente de documentos.",
    achievements: [
      "Desenvolvimento, manutenção e evolução do sistema OCR de operações portuárias",
      "Processamento inteligente de documentos com ganho de precisão e confiabilidade",
      "Automação no tratamento de dados operacionais, reduzindo retrabalho",
    ],
    stack: ["Java", "OCR", "SQL"],
  },
];

const ExperienceTimeline = () => {
  return (
    <section id="experience" className="px-6 py-20 border-t border-border">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Trajetória
        </p>
        <h2 className="font-serif text-headline max-w-3xl">
          Cinco anos construindo automações, integrações e sistemas de IA.
        </h2>
      </div>

      <ol className="relative border-l border-border">
        {experiences.map((item, index) => (
          <li
            key={item.company + item.period}
            className="relative pl-8 md:pl-12 pb-14 last:pb-0 fade-in-up"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-foreground" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {item.period}
                </p>
                <p className="text-sm mt-1">{item.company}</p>
              </div>

              <div className="lg:col-span-9">
                <h3 className="font-serif text-2xl md:text-4xl leading-tight">
                  {item.role}
                </h3>
                <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">
                  {item.summary}
                </p>

                <ul className="mt-6 divide-y divide-border max-w-2xl">
                  {item.achievements.map((a, i) => (
                    <li key={a} className="flex gap-5 py-3">
                      <span className="text-xs text-muted-foreground pt-1.5 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-lg md:text-xl leading-snug">
                        {a}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-5">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ExperienceTimeline;

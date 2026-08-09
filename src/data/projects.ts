import clarinhaImg from "@/assets/proj-clarinha.jpg";
import rpaImg from "@/assets/proj-rpa.jpg";
import ragImg from "@/assets/proj-rag.jpg";
import ocrImg from "@/assets/proj-ocr.jpg";
import cdrImg from "@/assets/proj-cdr.jpg";
import devopsImg from "@/assets/proj-devops.jpg";
import clarinhaImg2 from "@/assets/proj-clarinha-2.jpg";
import rpaImg2 from "@/assets/proj-rpa-2.jpg";
import ragImg2 from "@/assets/proj-rag-2.jpg";
import ocrImg2 from "@/assets/proj-ocr-2.jpg";
import cdrImg2 from "@/assets/proj-cdr-2.jpg";
import devopsImg2 from "@/assets/proj-devops-2.jpg";

export interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  year: string;
  client?: string;
  images: string[];
  captions?: string[];
  color: string;
  role?: string;
  stack?: string[];
  highlights?: string[];
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

export const projects: Project[] = [
  {
    id: "clarinha-ai",
    title: "Clarinha — Assistente Virtual",
    tags: ["ia", "llm", "integrações"],
    description:
      "Participação no desenvolvimento da Clarinha, assistente virtual da Claro. Atuei na criação de integrações corporativas e automações que conectam o agente conversacional a sistemas internos, APIs e bases de conhecimento, com foco em respostas confiáveis, rastreáveis e em escala.",
    year: "2024 — 2026",
    client: "Global Hitss / Claro",
    images: [clarinhaImg, clarinhaImg2],
    captions: [
      "Arquitetura conversacional da Clarinha integrada aos sistemas internos da Claro.",
      "Fluxos de automação conectando o agente a APIs corporativas e bases de conhecimento.",
    ],
    role: "Desenvolvedor de integrações e IA",
    stack: ["Python", "LLMs", "APIs REST", "MCP", "Docker"],
    highlights: ["Integrações do agente com sistemas internos e bases de conhecimento", "Automação de fluxos de atendimento em escala corporativa", "Respostas com contexto rastreável para times de operação"],
    color: "#D946EF",
    aspectRatio: "portrait"
  },
  {
    id: "rpa-fiscal",
    title: "Robôs RPA para Rotinas Fiscais",
    tags: ["rpa", "automação", "python"],
    description:
      "Desenvolvimento de robôs em Python para automação de processos fiscais: integração com APIs, manipulação de dados e web scraping para extração de informações críticas. Modelagem e otimização de fluxos operacionais, reduzindo tarefas manuais e garantindo rastreabilidade completa das execuções.",
    year: "2026 — atual",
    client: "Mix Fiscal",
    images: [rpaImg, rpaImg2],
    captions: [
      "Robôs em Python executando rotinas fiscais de forma padronizada e rastreável.",
      "Pipelines de extração e integração com APIs rodando em containers isolados.",
    ],
    role: "Analista de desenvolvimento de RPAs",
    stack: ["Python", "Selenium/Scraping", "APIs", "Docker", "IaC"],
    highlights: ["Redução expressiva de tarefas manuais em rotinas fiscais", "Execuções padronizadas e rastreáveis em containers", "Código modular e reutilizável entre diferentes robôs"],
    color: "#F59E0B",
    aspectRatio: "landscape"
  },
  {
    id: "rag-knowledge",
    title: "Sistemas RAG & Agentes LLM",
    tags: ["ia", "rag", "llm"],
    description:
      "Construção de sistemas de Retrieval-Augmented Generation e agentes baseados em LLMs: ingestão e processamento de documentos, embeddings, busca semântica e integrações via MCP. O objetivo é dar contexto real e verificável aos modelos, transformando bases documentais dispersas em conhecimento consultável.",
    year: "2023 — atual",
    client: "Projetos corporativos",
    images: [ragImg, ragImg2],
    captions: [
      "Pipeline de ingestão de documentos, embeddings e busca semântica.",
      "Agentes LLM com contexto verificável via integrações MCP.",
    ],
    role: "Desenvolvedor de IA",
    stack: ["Python", "RAG", "Embeddings", "Vector DB", "MCP"],
    highlights: ["Pipelines de ingestão e processamento de documentos", "Busca semântica sobre bases documentais dispersas", "Agentes com contexto verificável, reduzindo alucinações"],
    color: "#8B5CF6",
    aspectRatio: "portrait"
  },
  {
    id: "ocr-portuario",
    title: "OCR para Operações Portuárias",
    tags: ["ocr", "java", "documentos"],
    description:
      "Desenvolvimento, manutenção e evolução de um sistema de OCR em Java para gestão de operações portuárias. Uso de processamento inteligente de documentos e automação para aumentar a precisão da leitura, reduzir retrabalho e dar confiabilidade ao tratamento de dados operacionais.",
    year: "2021 — 2022",
    client: "Solution Ports",
    images: [ocrImg, ocrImg2],
    captions: [
      "Sistema de OCR em Java para leitura de documentos portuários.",
      "Processamento inteligente reduzindo retrabalho na conferência de dados.",
    ],
    role: "Desenvolvedor Backend",
    stack: ["Java", "OCR", "Processamento de documentos", "SQL"],
    highlights: ["Maior precisão na leitura de documentos portuários", "Redução de retrabalho manual na conferência de dados", "Evolução e manutenção contínua do sistema legado"],
    color: "#10B981",
    aspectRatio: "square"
  },
  {
    id: "cdr-analytics",
    title: "Análise de CDR em Telecom",
    tags: ["dados", "python", "telecom"],
    description:
      "Soluções em Python para análise de CDR (Call Detail Records), com pipelines de processamento de dados e relatórios que apoiam decisões operacionais. Complementado por monitoramento e troubleshooting de rede com Zabbix e Wireshark para garantir disponibilidade e desempenho.",
    year: "2022 — 2024",
    client: "Multi360 · Supernova Telecom",
    images: [cdrImg, cdrImg2],
    captions: [
      "Análise de CDR com pipelines de dados e relatórios operacionais.",
      "Monitoramento e troubleshooting de rede com Zabbix e Wireshark.",
    ],
    role: "Dev Backend & Suporte Técnico",
    stack: ["Python", "SQL", "Zabbix", "Wireshark"],
    highlights: ["Relatórios de CDR para decisão operacional", "Monitoramento proativo de disponibilidade da rede", "Troubleshooting acelerado com análise de pacotes"],
    color: "#6366F1",
    aspectRatio: "landscape"
  },
  {
    id: "docker-microservices",
    title: "Containers, APIs e Infra como Código",
    tags: ["docker", "devops", "apis"],
    description:
      "Implementação e manutenção de ambientes conteinerizados com Docker, APIs REST e microsserviços, com padronização de execução, isolamento de dependências e escalabilidade entre desenvolvimento e produção. Boas práticas de versionamento, modularização e conceitos de Infraestrutura como Código.",
    year: "2024 — atual",
    client: "Multi-projetos",
    images: [devopsImg, devopsImg2],
    captions: [
      "Ambientes conteinerizados com Docker padronizados entre dev e produção.",
      "APIs REST e microsserviços com infraestrutura versionada como código.",
    ],
    role: "Desenvolvedor Backend",
    stack: ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS · GCP · Azure"],
    highlights: ["Ambientes padronizados entre dev e produção", "Isolamento de dependências e deploys previsíveis", "Infraestrutura versionada como código"],
    color: "#0EA5E9",
    aspectRatio: "portrait"
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

// Get unique categories from all project tags
export const getCategories = (): string[] => {
  const allTags = projects.flatMap(project => project.tags);
  return [...new Set(allTags)];
};

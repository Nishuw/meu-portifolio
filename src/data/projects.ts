import clarinhaImg from "@/assets/proj-clarinha.png";
import docragImg from "@/assets/proj-docrag.png";
import rpaImg from "@/assets/proj-rpa.png";
import boutiqueImg from "@/assets/proj-boutique.png";
import ragImg from "@/assets/proj-rag.png";
import ocrImg from "@/assets/proj-ocr.png";
import cdrImg from "@/assets/proj-cdr.png";
import devopsImg from "@/assets/proj-devops.png";

export interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  challenge: string;
  approach: string;
  year: string;
  client?: string;
  image: string;
  color: string;
  role?: string;
  stack?: string[];
  highlights?: string[];
  repo?: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

export const projects: Project[] = [
  {
    id: "clarinha-ai",
    title: "Assistente Virtual Clarinha",
    tags: ["ia", "llm", "integrações"],
    description:
      "A Clarinha é a assistente virtual da Claro, um agente conversacional que atende clientes em escala nacional. Construí as integrações que ligam o agente aos sistemas de verdade da empresa: APIs corporativas, automações de atendimento e bases de conhecimento.",
    challenge:
      "Um agente que atende milhões de clientes não pode inventar resposta. O desafio era conectar o LLM aos sistemas que guardam a verdade (cadastros, faturas, planos) sem abrir mão de rastreabilidade e sem degradar o tempo de resposta do atendimento.",
    approach:
      "Construí integrações entre o agente e as APIs corporativas da Claro, com automações que buscam contexto nas bases de conhecimento antes de o modelo responder. Cada resposta carrega a referência de onde a informação veio, o que permite aos times de operação auditar qualquer atendimento e evoluir os fluxos com segurança. O resultado é um agente que responde rápido, em escala, e sempre com fonte.",
    year: "2024 a 2026",
    client: "Global Hitss / Claro",
    image: clarinhaImg,
    role: "Desenvolvedor de integrações e IA",
    stack: ["Python", "LLMs", "APIs REST", "MCP", "Docker"],
    highlights: ["Agente conectado a sistemas internos e bases de conhecimento da Claro", "Fluxos de atendimento automatizados em escala corporativa", "Respostas com fonte rastreável para os times de operação"],
    color: "#D946EF",
    aspectRatio: "portrait"
  },
  {
    id: "docrag-br",
    title: "DocRAG BR: o RAG que se audita",
    tags: ["hackathon", "ia", "rag"],
    description:
      "Construído solo, em 48 horas, no hackathon do RAISE Summit 2026 em Paris. Enquanto todos faziam \"chat com PDF\", inverti o fluxo: um auditor autônomo para documentos financeiros brasileiros que fala primeiro, cruzando o que a narrativa afirma com o que as tabelas e gráficos realmente mostram.",
    challenge:
      "Documentos financeiros brasileiros têm um problema que os \"chats com PDF\" ignoram: a narrativa às vezes afirma uma coisa e as tabelas mostram outra. E os gráficos vetoriais nem sequer existem para pipelines comuns de extração de texto. A informação mais sensível do documento é justamente a que o RAG tradicional não enxerga.",
    approach:
      "Inverti o fluxo: em vez de esperar pergunta, o auditor fala primeiro, cruzando as afirmações da narrativa com os números das tabelas e sinalizando divergências. Cada número é verificado contra a fonte, o que permite ao sistema pegar inclusive as próprias alucinações. A recuperação acontece em dois estágios (roteamento de intenção por LLM e rerank sobre ChromaDB), os gráficos são lidos por Vision LLM via renderização da página, e o grounding vai até o pixel: cada citação abre a página real do PDF com o trecho destacado.",
    year: "2026",
    client: "RAISE Summit · Paris",
    image: docragImg,
    role: "Solo, em 48 horas",
    stack: ["Python", "RAG", "ChromaDB", "Vision LLM"],
    highlights: [
      "Sinaliza as próprias alucinações em tempo real, com cada número verificado contra a fonte",
      "Cada citação abre a página real do PDF, com o trecho destacado",
      "Lê gráficos vetoriais invisíveis a pipelines comuns, via renderização com Vision LLM",
      "Recuperação em dois estágios: roteamento de intenção por LLM e rerank sobre ChromaDB",
    ],
    repo: "https://github.com/Nishuw/DocRAG-BR",
    color: "#E11D48",
    aspectRatio: "landscape"
  },
  {
    id: "rpa-fiscal",
    title: "Robôs RPA para Rotinas Fiscais",
    tags: ["rpa", "automação", "python"],
    description:
      "Robôs em Python que executam rotinas fiscais de ponta a ponta: consomem APIs, raspam portais e tratam dados críticos sem intervenção humana. O que tomava horas de trabalho manual virou fluxo automático e auditável.",
    challenge:
      "Rotinas fiscais são repetitivas, críticas e punem erro: prazos legais fixos, portais governamentais instáveis e dados que precisam chegar íntegros do outro lado. Feito à mão, o processo tomava horas por dia e dependia da memória de quem executava. Sem histórico, sem padrão, sem escala.",
    approach:
      "Modelei cada rotina como um robô em Python: integração com APIs onde existe contrato, scraping resiliente onde não existe, e tratamento de dados no meio do caminho. Tudo roda em containers isolados com execução padronizada, logs estruturados e rastro completo. Dá para auditar qualquer execução, de qualquer robô, em qualquer dia. O código é modular e reaproveitado entre robôs, então cada rotina nova custa menos que a anterior.",
    year: "desde 2026",
    client: "Mix Fiscal",
    image: rpaImg,
    role: "Analista de desenvolvimento de RPAs",
    stack: ["Python", "Selenium/Scraping", "APIs", "Docker", "IaC"],
    highlights: ["Horas de trabalho manual convertidas em execuções automáticas", "Rotinas padronizadas e auditáveis, rodando em containers isolados", "Código modular, reaproveitado entre diferentes robôs"],
    color: "#F59E0B",
    aspectRatio: "landscape"
  },
  {
    id: "online-boutique-ai",
    title: "Online Boutique AI Agent",
    tags: ["hackathon", "ia", "kubernetes"],
    description:
      "Criado no hackathon do Google Cloud pelos 10 anos do GKE, em 2025. Um microsserviço, não um chatbot: agente de IA plugado ao Online Boutique do Google que analisa comportamento do usuário e tendências de mercado para gerar ofertas personalizadas, começando pela recuperação de carrinhos abandonados.",
    challenge:
      "O hackathon dos 10 anos do GKE pedia extensões ao Online Boutique, o e-commerce de demonstração do Google. O caminho fácil era plugar um chatbot na loja. Eu queria algo que operasse o negócio de verdade: atacar os carrinhos abandonados, que são receita perdida em qualquer e-commerce.",
    approach:
      "Desenhei o agente como um microsserviço de verdade, não um wrapper de LLM: FastAPI com contratos Pydantic validados de ponta a ponta, geração de ofertas personalizadas com Gemini a partir do comportamento do usuário, health checks e logging estruturado. Roda com Docker e Compose em desenvolvimento e sobe para o GKE com manifests Kubernetes, com a mesma disciplina de produção dos outros microsserviços da loja desde o primeiro commit.",
    year: "2025",
    client: "Google Cloud · GKE 10 anos",
    image: boutiqueImg,
    role: "Desenvolvedor",
    stack: ["Gemini", "FastAPI", "Kubernetes", "Docker", "Pydantic"],
    highlights: [
      "Ofertas geradas com Gemini e contratos validados por Pydantic",
      "Serviço FastAPI desenhado para Kubernetes, pronto para o GKE desde o dia um",
      "Totalmente conteinerizado: Docker e Compose local, manifests K8s para a nuvem",
      "Health checks, logging estruturado e modelos tipados de ponta a ponta",
    ],
    repo: "https://github.com/Nishuw/online-boutique-ai-agent",
    color: "#14B8A6",
    aspectRatio: "square"
  },
  {
    id: "rag-knowledge",
    title: "Sistemas RAG & Agentes LLM",
    tags: ["ia", "rag", "llm"],
    description:
      "Sistemas que dão memória e contexto real a modelos de linguagem: ingestão de documentos, embeddings, busca semântica e integrações via MCP. Bases documentais dispersas viram conhecimento consultável, e o modelo passa a responder com fonte, não com alucinação.",
    challenge:
      "Empresas têm conhecimento espalhado em PDFs, wikis, e-mails e sistemas que não conversam entre si. LLMs sozinhos respondem qualquer pergunta com confiança e sem fonte. O desafio é dar ao modelo acesso ao que a empresa realmente sabe, sem que ele invente o resto.",
    approach:
      "Construí pipelines de ingestão que processam documentos, geram embeddings e os tornam consultáveis por busca semântica sobre banco vetorial, com integrações via MCP para os agentes consumirem esse contexto no momento da resposta. O resultado são respostas ancoradas em documentos reais, com a fonte junto. Isso muda a conversa de \"será que é verdade?\" para \"onde está escrito?\".",
    year: "desde 2023",
    client: "Projetos corporativos",
    image: ragImg,
    role: "Desenvolvedor de IA",
    stack: ["Python", "RAG", "Embeddings", "Vector DB", "MCP"],
    highlights: ["Documentos dispersos transformados em base de conhecimento consultável", "Busca semântica com embeddings e banco vetorial", "Respostas com fonte, reduzindo alucinações dos modelos"],
    color: "#8B5CF6",
    aspectRatio: "portrait"
  },
  {
    id: "ocr-portuario",
    title: "OCR para Operações Portuárias",
    tags: ["ocr", "java", "documentos"],
    description:
      "Sistema em Java que lê documentos de operações portuárias e transforma papel em dado estruturado. Assumi o desenvolvimento e a evolução do OCR, elevando a precisão de leitura e cortando o retrabalho de conferência manual.",
    challenge:
      "Operação portuária roda em papel: manifestos, conhecimentos de embarque, documentos de carga. Cada conferência manual é lenta e cada erro de digitação vira atraso na liberação. E atraso em porto custa caro, para o terminal e para o navio.",
    approach:
      "Assumi o sistema de OCR em Java e o evoluí com processamento inteligente de documentos: pré-processamento de imagem para melhorar a leitura, regras de validação específicas por tipo de documento e automação do fluxo de conferência. A precisão subiu, o retrabalho caiu e o sistema seguiu evoluindo em produção, sem parar a operação enquanto era melhorado.",
    year: "2021 a 2022",
    client: "Solution Ports",
    image: ocrImg,
    role: "Desenvolvedor Backend",
    stack: ["Java", "OCR", "Processamento de documentos", "SQL"],
    highlights: ["Precisão de leitura elevada em documentos operacionais", "Retrabalho de conferência manual drasticamente reduzido", "Sistema legado mantido e evoluído em produção"],
    color: "#10B981",
    aspectRatio: "square"
  },
  {
    id: "cdr-analytics",
    title: "Análise de CDR em Telecom",
    tags: ["dados", "python", "telecom"],
    description:
      "Pipelines em Python que processam milhões de registros de chamadas (CDR) e os transformam em relatórios que orientam decisões operacionais. Do lado da rede, monitoramento com Zabbix e análise de pacotes com Wireshark.",
    challenge:
      "Cada chamada telefônica gera um registro, o CDR. São milhões por mês, e as respostas que a operação precisava (consumo, faturamento, anomalias) estavam soterradas nesse volume, dependendo de análises manuais que não acompanhavam o ritmo do negócio.",
    approach:
      "Construí pipelines em Python que coletam, tratam e agregam os CDRs em relatórios que a operação de fato usa para decidir, de conferência de faturamento a detecção de padrões anômalos de tráfego. Em paralelo, mantive a rede visível com Zabbix e análise de pacotes com Wireshark: monitoramento proativo, em vez de descobrir o problema pelo cliente.",
    year: "2022 a 2024",
    client: "Multi360 · Supernova Telecom",
    image: cdrImg,
    role: "Dev Backend & Suporte Técnico",
    stack: ["Python", "SQL", "Zabbix", "Wireshark"],
    highlights: ["Milhões de CDRs processados em relatórios de decisão operacional", "Disponibilidade da rede monitorada de forma proativa", "Troubleshooting acelerado com análise de pacotes"],
    color: "#6366F1",
    aspectRatio: "landscape"
  },
  {
    id: "docker-microservices",
    title: "Containers, APIs e Infra como Código",
    tags: ["docker", "devops", "apis"],
    description:
      "Ambientes que se comportam igual em desenvolvimento e produção: Docker, APIs REST e microsserviços com dependências isoladas e deploys previsíveis. Toda a infraestrutura é versionada como código.",
    challenge:
      "\"Na minha máquina funciona\" é sintoma de infraestrutura artesanal: ambientes montados à mão divergem com o tempo, deploys viram evento de risco e dependências quebram em produção o que passava em desenvolvimento.",
    approach:
      "Padronizei os ambientes com Docker e orquestração em Kubernetes, com APIs e microsserviços empacotados junto de suas dependências. A infraestrutura é declarada como código com Terraform e versionada no mesmo fluxo do restante: subir um ambiente novo é executar código revisado, não seguir um checklist de wiki. Deploys deixaram de ser evento para virar rotina.",
    year: "desde 2024",
    client: "Multi-projetos",
    image: devopsImg,
    role: "Desenvolvedor Backend",
    stack: ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS · GCP · Azure"],
    highlights: ["Ambientes idênticos entre desenvolvimento e produção", "Deploys previsíveis com dependências isoladas", "Infraestrutura versionada, reproduzível e revisável"],
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

# Atualização do portfólio v2 com o currículo completo

**Data:** 2026-07-30
**Arquivo alvo:** `Portfólio com design 3D/Portfolio Ryan Nishikawa v2.dc.html`

## Problema

O site publica uma versão truncada da carreira. Ele começa em ago/2024 e lista três posições; o currículo real começa em 2021 e tem cinco posições em quatro empresas. Duas empresas inteiras — Solution Ports (2021–2022) e Multi360/Supernova Telecom (2022–2024) — não aparecem em lugar nenhum. Também faltam formação acadêmica, certificações e telefone, e a seção Stack omite tecnologias que sustentam experiências reais.

Consequência narrativa: o site sugere dois anos de carreira quando são cinco, e esconde que os primeiros agentes baseados em LLM foram construídos em 2022–2024, não em 2026.

## Escopo

Reforma **de conteúdo apenas**. Não muda o layout, a paleta, a tipografia, o canvas WebGL de fundo, o canvas de morph da Trilha, o painel de log animado do hero, nem os arquivos de runtime (`support.js`, `signal.js`, `rngl.js`).

Fora de escopo: o arquivo v1 (`Portfolio Ryan Nishikawa.dc.html`), o `CURRICULO.md` da raiz e a cópia em `uploads/`. Permanecem desatualizados por decisão explícita.

## Mudanças

### 1. Seção Experiência — cinco entradas, datas em ano

Padroniza todas as datas em ano (o currículo só tem precisão de ano nas empresas antigas). Ordem da mais recente para a mais antiga.

| Período | Cargo | Empresa | Localização |
|---|---|---|---|
| 2026 — atual | Analista de Desenvolvimento de RPAs | Mix Fiscal | Campinas, BR |
| 2025 — 2026 | Desenvolvedor Backend | Global Hitss | Campinas, BR |
| 2024 — 2025 | Analista de Redes | Global Hitss | Campinas, BR |
| 2022 — 2024 | Analista de Suporte Técnico e Desenvolvedor Backend | Multi360 / Supernova Telecom | sem localização |
| 2021 — 2022 | Desenvolvedor Backend e Analista de Redes | Solution Ports | sem localização |

As duas entradas antigas omitem o `<span>` de localização; as três recentes mantêm "Campinas, BR" como já está.

Conteúdo de cada entrada:

- **Mix Fiscal** — mantém o texto atual (RPA de classificação fiscal, 98% de precisão, camada de observabilidade, posse da stack, time Scrum) e acrescenta Docker para padronização e isolamento de execução dos robôs, web scraping para extração de dados críticos e Infraestrutura como Código. Linha de stack: `Python · RPA · Docker · PostgreSQL · REST APIs · IaC · Scrum`.
- **Global Hitss / Desenvolvedor Backend** — mantém as quatro entregas atuais (ferramentas internas de automação, análise de logs Cisco/Nokia, chatbot Telegram com n8n, portal de conhecimento com OCR) e acrescenta a participação na **Clarinha, assistente virtual da Claro**, com integrações e automações corporativas, além de LLMs, sistemas RAG, microsserviços e bancos SQL/NoSQL. Linha de stack: `Python · LLMs · RAG · n8n · OCR · Docker · MySQL · NoSQL`.
- **Global Hitss / Analista de Redes** — mantém o texto atual de suporte e resolução de incidentes, acrescentando os equipamentos Cisco, Nokia e FortiGate. Linha de stack: `Redes · Cisco · Nokia · FortiGate · Linux`.
- **Multi360 / Supernova Telecom** — entrada nova. Soluções em Python para análise de CDR, automações RPA e aplicações de IA incluindo agentes baseados em LLM; integrações e fluxos automatizados para reduzir esforço operacional; monitoramento e troubleshooting de rede com Zabbix e Wireshark. Linha de stack: `Python · LLMs · RPA · CDR · Zabbix · Wireshark`.
- **Solution Ports** — entrada nova. Desenvolvimento, manutenção e evolução de sistema OCR em Java para gestão de operações portuárias, com processamento inteligente de documentos e automação para precisão e confiabilidade no tratamento de dados operacionais. Linha de stack: `Java · OCR · Automação · Redes`.

### 2. Seção Trilha — três capítulos recortados

Mantém exatamente três capítulos para preservar o pareamento com as três formas do canvas 3D (placa → feixe → globo). Só os rótulos de ano e os textos mudam.

- **2021 — 2024 · Cabo** — portos e telecom. OCR em Java para operações portuárias, análise de CDR, automações RPA, primeiros agentes LLM, monitoramento de rede com Zabbix e Wireshark. Mantém a ideia atual de que ninguém debuga o que não consegue enxergar.
- **2024 — 2026 · Sinal** — Global Hitss inteira. Das redes Cisco, Nokia e FortiGate às ferramentas internas, análise de logs, chatbot no Telegram com n8n, portal de conhecimento com OCR e a Clarinha da Claro.
- **2026 — agora · Modelo** — Mix Fiscal. RPA fiscal em produção com observabilidade própria, pipelines de RAG e agentes autônomos.

### 3. Hero — retoque de precisão

O parágrafo atual afirma "Comecei em infraestrutura de redes — cabeamento, Cisco, Nokia, diagnóstico de campo". Em 2021, na Solution Ports, o cargo já acumulava backend e redes. O texto é reescrito para preservar o arco "do cabo à rede neural" — que permanece como título do hero — sem afirmar que a origem foi exclusivamente em redes. A menção a cinco anos de trajetória substitui a impressão implícita de dois.

### 4. Nova seção "Formação e certificações"

Nova `<section id="formacao">` entre Stack e Contato, reaproveitando o padrão visual da seção Stack (grid de duas colunas, `minmax(0,0.3fr) minmax(0,1fr)`, linhas separadas por borda superior). Duas linhas:

- **Formação** — Redes de Computadores · Cruzeiro do Sul (cursando) · Desenvolvedor Back-end Python · EBAC · Técnico em Informática · Dell
- **Certificações** — Scrum · Global Hitss · Gemini do zero ao avançado · Descomplica · Python com Flask · Rocketseat · Scripting e Automação · Udemy · Banco de Dados MySQL · Udemy

Um link `Formação` entra na `<nav>` do header, entre `Stack` e `Contato`.

### 5. Seção Stack — adições seletivas

Adiciona apenas o que sustenta experiência real e remove nada:

- **Linguagens** — acrescenta `Java`
- **Web e backend** — acrescenta `microsserviços`
- **Dados e infraestrutura** — acrescenta `Terraform/IaC`, `CI/CD`, `AWS`, `Azure`, `NoSQL`

Ficam deliberadamente de fora DDD, TDD, OOP e Clean Architecture: são termos de currículo sem projeto correspondente no portfólio.

### 6. Seção Contato — telefone

Acrescenta `+55 19 98328-4798` como primeiro item da lista de contatos, antes do email, no mesmo padrão de linha com borda superior dos demais. O link usa `tel:+5519983284798`.

## Critérios de aceite

1. As cinco posições aparecem na seção Experiência, na ordem cronológica inversa da tabela acima, com as datas em ano.
2. Solution Ports e Multi360/Supernova não exibem localização; as outras três exibem "Campinas, BR".
3. A Clarinha da Claro é citada nominalmente na entrada de Desenvolvedor Backend da Global Hitss.
4. A Trilha continua com exatamente três `<article>`, com os anos 2021–2024, 2024–2026 e 2026 — agora.
5. A seção `#formacao` existe entre `#stack` e `#contato` e tem link correspondente no menu.
6. O telefone aparece na seção Contato como link `tel:`.
7. `support.js`, `signal.js` e `rngl.js` não têm nenhuma alteração.
8. O bloco `<script type="text/x-dc">` no fim do arquivo não muda: o painel de log, o morph e a animação de entrada continuam funcionando como hoje.
9. Nenhum texto do site afirma ou sugere três anos ou menos de carreira.

## Riscos

O arquivo é um documento único de 46 KB com estilos inline e um runtime React proprietário (`x-dc`). Edições precisam ser cirúrgicas por seção, preservando os atributos `style`, `style-hover` e `data-enter`, porque não há build nem linter que pegue um erro de marcação. A validação é visual, abrindo o arquivo.

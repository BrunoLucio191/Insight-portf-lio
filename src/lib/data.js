import {
  Zap,
  ClipboardCheck,
  Cpu,
  Gauge,
  PencilRuler,
  Sun,
} from "lucide-react";

export const CONTACT = {
  email: "insightjunior.dee@ufma.br",
  instagram: "insightengenhariajr",
  whatsappPrimary: "5598984081663",
  team: [
    { name: "Ester", phone: "(98) 98408-1663", raw: "5598984081663" },
    { name: "Joy", phone: "(98) 98546-5012", raw: "5598985465012" },
    { name: "Kadu", phone: "(98) 99125-6060", raw: "5598991256060" },
  ],
};

export const SERVICES = [
  {
    icon: Zap,
    title: "Instalações Elétricas",
    desc: "Execução e acompanhamento de sistemas elétricos em residências, comércios e indústrias.",
    detail: "Passagem de cabos, quadros, dispositivos de proteção e iluminação dentro das normas técnicas.",
  },
  {
    icon: ClipboardCheck,
    title: "Laudos e Manutenção",
    desc: "Laudos técnicos e manutenções preventivas e corretivas em conformidade com normas.",
    detail: "Avaliação completa, relatórios técnicos e plano de manutenção para garantir segurança e confiabilidade.",
  },
  {
    icon: Cpu,
    title: "Automação",
    desc: "Sistemas automatizados para residências, comércios e indústrias.",
    detail: "Programação, supervisórios, automação residencial e integração de dispositivos inteligentes.",
  },
  {
    icon: Gauge,
    title: "Eficiência Energética",
    desc: "Redução de desperdícios e custos com análise técnica do consumo.",
    detail: "Substituição de equipamentos, otimização de processos e adequação de iluminação.",
  },
  {
    icon: PencilRuler,
    title: "Projetos Elétricos",
    desc: "Planejamento e dimensionamento de instalações de baixa e média tensão.",
    detail: "Cargas, diagramas, quadros, proteção e aterramento conforme normas vigentes.",
  },
  {
    icon: Sun,
    title: "Consultoria em Energia",
    desc: "Assessoria em fontes renováveis e estudos de viabilidade energética.",
    detail: "Energia solar fotovoltaica e estudos técnico-econômicos para projetos sustentáveis.",
  },
];

export const PORTFOLIO = [
  {
    client: "TV Maranhão",
    sector: "Mídia",
    type: "Laudo",
    title: "Laudo técnico de aterramento",
    outcome: "Diagnóstico completo do sistema de aterramento e plano de adequação à NBR 5419.",
    metric: "100% conformidade",
  },
  {
    client: "UFMA — Santa Amélia",
    sector: "Educação",
    type: "Projeto",
    title: "Projeto elétrico Santa Amélia",
    outcome: "Projeto elétrico para edificação histórica preservando o patrimônio.",
    metric: "Patrimônio preservado",
  },
  {
    client: "Fundação Bradesco",
    sector: "Educação",
    type: "Laudo",
    title: "As built — Brigada de incêndio",
    outcome: "Documentação as built completa do sistema de brigada e instalações.",
    metric: "Documentação completa",
  },
  {
    client: "NCA — UFMA",
    sector: "Educação",
    type: "Automação",
    title: "Automação de travas eletrônicas",
    outcome: "Controle de acesso com travas RFID integradas e supervisão centralizada.",
    metric: "Acesso controlado 24/7",
  },
];

export const STATS = [
  { value: 8, suffix: "+", label: "Anos de atuação", from: 2017 },
  { value: 6, suffix: "", label: "Áreas de serviço" },
  { value: 1, suffix: "", label: "Prêmio MAJU 2025" },
  { value: 100, suffix: "%", label: "Comprometimento" },
];

export const TESTIMONIALS = [
  {
    name: "Cliente parceiro",
    role: "Gestor técnico",
    company: "Instituição parceira",
    quote: "Equipe técnica preparada e atenciosa. Entrega dentro do prazo e com qualidade.",
  },
  {
    name: "Coordenação de obras",
    role: "Engenheiro responsável",
    company: "Cliente institucional",
    quote: "Profissionalismo e precisão técnica. Recomendo a Insight para projetos elétricos.",
  },
  {
    name: "Empresa contratante",
    role: "Diretoria",
    company: "Setor privado",
    quote: "Excelente custo-benefício e transparência durante todo o projeto.",
  },
];

export const PROCESS = [
  {
    n: "01",
    title: "Briefing",
    desc: "Conversa inicial sem custo para entender escopo, prazo e restrições do seu projeto.",
  },
  {
    n: "02",
    title: "Diagnóstico técnico",
    desc: "Visita técnica ou análise documental, com escopo e cronograma claros.",
  },
  {
    n: "03",
    title: "Proposta",
    desc: "Orçamento detalhado com escopo fechado, entregáveis e condições.",
  },
  {
    n: "04",
    title: "Execução & entrega",
    desc: "Execução com acompanhamento contínuo, relatórios e suporte pós-entrega.",
  },
];

export const FAQ = [
  {
    q: "Vocês são uma empresa formal? Emitem nota fiscal?",
    a: "Sim. A Insight é Empresa Júnior formalizada e federada ao Movimento Empresa Júnior (MEJ), com CNPJ próprio e capacidade de emitir nota fiscal de serviço.",
  },
  {
    q: "Por que contratar uma empresa júnior?",
    a: "Você recebe qualidade técnica de uma universidade pública (UFMA), supervisão de professores quando aplicável e preço significativamente menor que consultorias tradicionais — com a mesma exigência de norma técnica.",
  },
  {
    q: "Qual o prazo médio de resposta a um orçamento?",
    a: "Respondemos contatos em até 1 dia útil. O orçamento detalhado é entregue em até 5 dias úteis após o briefing técnico.",
  },
  {
    q: "Atendem fora de São Luís?",
    a: "Sim. Atendemos a região metropolitana de São Luís presencialmente e demais cidades do Maranhão sob negociação de logística.",
  },
  {
    q: "Quem assina os projetos elétricos?",
    a: "Projetos com necessidade de ART são assinados por engenheiro elétrico responsável técnico parceiro da empresa.",
  },
];

export const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobreNos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Processo", href: "#processo" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Contato", href: "#contato" },
];

/* Dados do questionário Persona. Mantidos separados da interface para facilitar manutenção. */
(() => {
  "use strict";
  const dimensoes = [
    "social",
    "cognitiva",
    "decisoria",
    "organizacional",
    "comportamental"
  ];

  const alternativas = [
    "Discordo totalmente",
    "Discordo parcialmente",
    "Nem concordo nem discordo",
    "Concordo parcialmente",
    "Concordo totalmente"
  ];

  // A pontuação invertida mantém os polos das dimensões.
  const perguntas = [
    {
      id: "SOC-001",
      revisao: 1,
      texto: "Quando estou com pessoas que ainda não conheço, costumo começar uma conversa.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-001",
      revisao: 1,
      texto: "Quando começo a estudar um assunto, gosto de compreender a ideia geral antes de examinar seus detalhes.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-001",
      revisao: 1,
      texto: "Quando preciso escolher entre opções com vantagens diferentes, prefiro compará-las usando critérios claros.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-001",
      revisao: 1,
      texto: "Antes de começar uma tarefa com várias etapas, prefiro definir a ordem em que vou realizá-las.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-001",
      revisao: 1,
      texto: "Quando algo inesperado acontece durante uma atividade, prefiro entender a situação antes de tomar uma atitude.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-002",
      revisao: 1,
      texto: "Ao entrar em um grupo que já está conversando, prefiro ouvir por um tempo antes de participar.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-002",
      revisao: 1,
      texto: "Para entender um conceito novo, prefiro começar por um exemplo concreto de como ele funciona.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-002",
      revisao: 1,
      texto: "Em decisões simples do cotidiano, costumo escolher a opção que me parece melhor logo de início.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-002",
      revisao: 1,
      texto: "Ao realizar uma atividade nova, prefiro decidir os próximos passos conforme avanço.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-002",
      revisao: 1,
      texto: "Quando surge um contratempo, costumo tentar uma solução logo de início.",
      dimensao: "comportamental",
      invertida: true
    },
    {
      id: "SOC-003",
      revisao: 1,
      texto: "Em atividades de grupo, costumo apresentar minhas ideias sem esperar que me convidem a falar.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-003",
      revisao: 1,
      texto: "Quando observo situações diferentes, gosto de procurar ideias ou princípios que elas tenham em comum.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-003",
      revisao: 1,
      texto: "Mesmo quando uma alternativa me agrada de imediato, prefiro examinar seus pontos contrários antes de decidir.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-003",
      revisao: 1,
      texto: "Quando tenho várias atividades durante a semana, gosto de organizar antecipadamente quando farei cada uma.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-003",
      revisao: 1,
      texto: "Ao receber uma observação inesperada durante uma conversa, costumo pensar por um momento antes de responder.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-004",
      revisao: 1,
      texto: "Quando quero conversar com alguém, geralmente espero que essa pessoa comece.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-004",
      revisao: 1,
      texto: "Quando conheço uma teoria, minha primeira curiosidade costuma ser sobre como ela funciona na prática.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-004",
      revisao: 1,
      texto: "Em situações que já vivi muitas vezes, costumo confiar na minha experiência para decidir sem comparar cada opção detalhadamente.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-004",
      revisao: 1,
      texto: "Nos meus momentos de lazer, prefiro deixar a programação aberta para decidir o que fazer na hora.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-004",
      revisao: 1,
      texto: "Quando alguém me faz uma pergunta de surpresa, costumo responder com a primeira ideia que me ocorre.",
      dimensao: "comportamental",
      invertida: true
    },
    {
      id: "SOC-005",
      revisao: 1,
      texto: "Quando uma conversa em grupo perde o ritmo, costumo sugerir um novo assunto.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-005",
      revisao: 1,
      texto: "Gosto de explorar possibilidades hipotéticas, mesmo quando ainda não sei como poderiam ser aplicadas.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-005",
      revisao: 1,
      texto: "Quando uma decisão envolve consequências futuras, gosto de comparar diferentes cenários antes de escolher.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-005",
      revisao: 1,
      texto: "Quando uma atividade exige materiais ou informações, prefiro deixá-los preparados antes de começar.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-005",
      revisao: 1,
      texto: "Quando percebo que um plano deixou de funcionar, prefiro parar por um instante antes de definir o próximo passo.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-006",
      revisao: 1,
      texto: "Em encontros sociais, prefiro que outras pessoas me incluam nas conversas em vez de me aproximar por iniciativa própria.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-006",
      revisao: 1,
      texto: "Quando explico uma ideia a alguém, costumo recorrer primeiro a situações e exemplos do cotidiano.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-006",
      revisao: 1,
      texto: "Ao avaliar duas opções parecidas, costumo dar mais peso à impressão geral que cada uma me transmite.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-006",
      revisao: 1,
      texto: "Em projetos pessoais, prefiro ter liberdade para modificar a ordem das etapas ao longo do caminho.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-006",
      revisao: 1,
      texto: "Em mudanças de última hora, costumo agir primeiro e ajustar minha resposta conforme a situação evolui.",
      dimensao: "comportamental",
      invertida: true
    }
  ];


  window.PersonaQuizDados = Object.freeze({ dimensoes, alternativas, perguntas });
})();

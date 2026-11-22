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
      revisao: 2,
      texto: "Quando estou com pessoas que ainda não conheço, costumo começar uma conversa.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-001",
      revisao: 2,
      texto: "Quando descubro algo novo, gosto de pensar nas ideias por trás daquilo, além de entender como funciona.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-001",
      revisao: 2,
      texto: "Quando preciso escolher entre duas opções, gosto de comparar o que cada uma tem de bom e de ruim.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-001",
      revisao: 2,
      texto: "Antes de começar uma atividade com várias etapas, gosto de decidir a ordem em que vou fazer cada uma.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-001",
      revisao: 2,
      texto: "Quando acontece algo que eu não esperava, gosto de entender o que está acontecendo antes de agir.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-002",
      revisao: 2,
      texto: "Quando encontro um grupo de pessoas conversando, costumo esperar que alguém me convide a participar.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-002",
      revisao: 2,
      texto: "Quando estou aprendendo algo novo, prefiro começar por um exemplo para entender como funciona.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-002",
      revisao: 2,
      texto: "Quando tenho duas opções que me agradam, costumo escolher aquela que mais me chama a atenção de primeira.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-002",
      revisao: 2,
      texto: "Ao realizar uma atividade nova, prefiro decidir os próximos passos conforme avanço.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-002",
      revisao: 2,
      texto: "Quando surge uma dificuldade inesperada durante uma atividade, prefiro tentar resolvê-la logo em vez de esperar para pensar no que fazer.",
      dimensao: "comportamental",
      invertida: true
    },
    {
      id: "SOC-003",
      revisao: 2,
      texto: "Em atividades de grupo, costumo apresentar minhas ideias sem esperar que me convidem a falar.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-003",
      revisao: 2,
      texto: "Gosto de descobrir o que situações diferentes têm em comum, mesmo quando parecem não ter relação.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-003",
      revisao: 2,
      texto: "Mesmo quando uma opção me agrada logo de início, gosto de considerar suas possíveis desvantagens antes de escolher.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-003",
      revisao: 2,
      texto: "Quando tenho várias coisas para fazer durante a semana, gosto de planejar quando vou realizar cada uma.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-003",
      revisao: 2,
      texto: "Quando uma conversa toma um rumo inesperado, prefiro pensar por um momento antes de responder.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-004",
      revisao: 2,
      texto: "Quando tenho interesse em conhecer melhor uma pessoa, costumo esperar que ela tome a iniciativa de se aproximar.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-004",
      revisao: 2,
      texto: "Quando quero entender por que algo acontece, prefiro observar situações reais antes de pensar em explicações gerais.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-004",
      revisao: 2,
      texto: "Quando encontro uma opção que parece atender ao que preciso, costumo escolhê-la sem procurar muitas outras alternativas.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-004",
      revisao: 2,
      texto: "Quando tenho várias coisas para fazer, prefiro decidir na hora por qual delas começar.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-004",
      revisao: 2,
      texto: "Quando acontece algo inesperado e percebo uma maneira de agir, costumo colocá-la em prática logo.",
      dimensao: "comportamental",
      invertida: true
    },
    {
      id: "SOC-005",
      revisao: 2,
      texto: "Quando uma conversa em grupo perde o ritmo, costumo sugerir um novo assunto.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-005",
      revisao: 2,
      texto: "Gosto de imaginar diferentes possibilidades, mesmo quando não sei se elas poderiam acontecer de verdade.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-005",
      revisao: 2,
      texto: "Quando preciso tomar uma decisão, gosto de pensar no que pode acontecer depois de cada escolha.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-005",
      revisao: 2,
      texto: "Antes de começar uma atividade, gosto de separar tudo o que vou precisar para realizá-la.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-005",
      revisao: 2,
      texto: "Quando algo que estou fazendo não dá certo, prefiro parar um momento para entender o motivo antes de tentar novamente.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-006",
      revisao: 2,
      texto: "Quando estou em uma atividade em grupo, prefiro esperar que alguém me atribua uma tarefa em vez de me oferecer espontaneamente para ajudar.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-006",
      revisao: 2,
      texto: "Quando conheço uma ideia nova, gosto de descobrir onde ela aparece no meu dia a dia.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-006",
      revisao: 2,
      texto: "Quando preciso escolher e não tenho certeza de qual opção é melhor, costumo seguir aquela que sinto ser a escolha certa.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-006",
      revisao: 2,
      texto: "Quando organizo meu dia, prefiro deixar espaço para escolher algumas atividades conforme minha vontade.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-006",
      revisao: 2,
      texto: "Quando acontece uma mudança inesperada, minha primeira reação costuma ser agir logo para lidar com a situação.",
      dimensao: "comportamental",
      invertida: true
    }
  ];


  window.PersonaQuizDados = Object.freeze({ dimensoes, alternativas, perguntas });
})();

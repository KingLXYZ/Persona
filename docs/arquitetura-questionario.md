# Arquitetura interna do questionário Persona

Documentação técnica da estrutura atual do questionário experimental de 30 perguntas. Esta organização **não** implica validação psicométrica.

## Mapa dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `quiz.html` | Estrutura HTML, elementos acessíveis e carregamento dos scripts. |
| `quiz-perguntas.js` | Dados das 30 perguntas, dimensões e alternativas; publica `window.PersonaQuizDados`. |
| `quiz-pontuacao.js` | Calcula as pontuações das dimensões; publica `window.PersonaQuizPontuacao`. |
| `quiz-progresso.js` | Salva, recupera e verifica compatibilidade da tentativa na sessão; publica `window.PersonaQuizProgresso`. |
| `quiz-interface.js` | Atualiza barra de progresso, seleção visual e atributos de acessibilidade; publica `window.PersonaQuizInterface`. |
| `quiz-v3.js` | Controlador principal: valida perguntas, sorteia ordem, apresenta questões, trata eventos, navegação, reinício e conclusão. O sufixo v3 é técnico/interno. |
| `resultado-v3.js` | Lê e apresenta resultados; preserva compatibilidade com formatos anteriores. |
| `persona-historico.js` | Funcionalidades compartilhadas de histórico. |
| `tests/quiz.test.cjs` | Testes de estrutura e pontuação. |
| `tests/quiz-progresso.test.cjs` | Testes de salvamento, restauração e incompatibilidade. |
| `tests/quiz-navegacao.test.cjs` | Testes de sorteio, ordem e identificação de perguntas pendentes. |

## Ordem de carregamento

Em `quiz.html`, os scripts do questionário usam `defer` nesta ordem:

1. `quiz-perguntas.js`
2. `quiz-pontuacao.js`
3. `quiz-progresso.js`
4. `quiz-interface.js`
5. `quiz-v3.js`

O controlador depende dos quatro módulos anteriores. Os módulos disponibilizam APIs pelo objeto `window` e são scripts clássicos, **não** módulos ES com `import/export`. Não trocar a ordem ou mudar para `type="module"` sem revisar as dependências.

## Fluxo resumido

1. O controlador valida as 30 perguntas e tenta recuperar o progresso da sessão.
2. Se não houver tentativa recuperada, sorteia a ordem e salva o progresso.
3. Apresenta uma pergunta por vez; a interface marca a seleção e atualiza a barra.
4. Ao responder, voltar ou avançar, o controlador atualiza o estado e solicita seu salvamento.
5. Na conclusão, o controlador solicita as pontuações, salva o resultado temporário na sessão, remove o progresso e navega para `resultado.html?versao=3`.

## Contratos de compatibilidade

- Não mudar os IDs e revisões das perguntas sem planejar migração.
- Preservar a escala de 1 a 5, os itens invertidos e a fórmula de pontuação, salvo revisão metodológica deliberada.
- `sessionStorage['persona_progresso_v3']` armazena respostas individuais, ordem, posição e metadados de revisão durante a tentativa.
- `sessionStorage['persona_resultado_v3']` armazena pontuações e metadados de conclusão para a página de resultados.
- O sorteio **evita** dimensões iguais consecutivas quando há alternativas disponíveis; não garante alternância perfeita em todas as ordens possíveis.
- O armazenamento é por sessão do navegador; não equivale à sincronização entre dispositivos.

## Executar testes

Na pasta raiz do repositório, com Node.js instalado:

```powershell
node --test tests/*.test.cjs
```

Há **14 testes** nos três arquivos na data desta documentação. O último resultado comunicado pelo mantenedor foi 14 aprovados, 0 falhas. Os testes não substituem testes manuais de interface, navegação por teclado, conclusão e exibição de resultados.

## Checklist antes de publicar mudanças

1. Alterar uma responsabilidade por vez e manter um commit identificável.
2. Rodar todos os testes; corrigir falhas antes de prosseguir.
3. Conferir no navegador seleção, Voltar/Continuar, progresso e retomada na mesma aba.
4. Concluir uma tentativa de teste e verificar a página de resultados e Minha jornada, quando aplicável.
5. Se modificar a quantidade de perguntas ou a metodologia, revisar pontuação, metadados, testes, compatibilidade, documentação e interpretação dos resultados antes de publicar.

## Limites da cobertura atual

Os testes de navegação extraem funções do controlador atual para caracterização. Se essas funções forem movidas, os testes também precisarão ser atualizados. Ainda não há teste automatizado de ponta a ponta que simule o navegador completo. Evitar refatorações apenas para reduzir linhas: cada arquivo deve ter responsabilidade clara.

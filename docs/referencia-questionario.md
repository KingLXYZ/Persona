# Referência de segurança — questionário Persona

Documento interno para orientar a refatoração. Registra o comportamento observado no código atual de `quiz-v3.js` (branch `main`, novembro de 2026). **Não é evidência de execução de testes.**

## Contratos a preservar

- Questionário experimental de **30 perguntas**, com cinco dimensões (`social`, `cognitiva`, `decisoria`, `organizacional`, `comportamental`), seis itens por dimensão e três invertidos por dimensão.
- Cada pergunta tem `id` estável, `revisao`, `texto`, `dimensao` e `invertida`. Respostas são inteiros de 1 a 5; pergunta não respondida usa `null`.
- Ordem das perguntas sorteada evitando dimensões consecutivas iguais quando possível; ao restaurar progresso, manter a ordem existente.
- Pontuação por dimensão: para item invertido usar `6 - resposta`; calcular a média dos seis valores; converter para 0–100 com `Math.round(((media - 1) / 4) * 100)`.
- Progresso de tentativa em `sessionStorage['persona_progresso_v3']`: `version`, `totalPerguntas`, `revisaoInstrumento`, `revisoesPerguntas`, `atual`, `ordem`, `respostas`. Revisão incompatível não deve apagar silenciosamente a tentativa.
- Resultado em `sessionStorage['persona_resultado_v3']`: `version: 3`, `totalPerguntas: 30`, `scores` (objeto com as cinco dimensões). Após gravar resultado, limpar o progresso e navegar para `resultado.html?versao=3`.
- Preservar navegação, seleção por teclado, acessibilidade, layout e compatibilidade com `resultado-v3.js` e `persona-historico.js`.

## Casos de teste planejados (ainda não implementados)

1. Trinta itens com IDs únicos, cinco dimensões, seis itens por dimensão e três inversões por dimensão.
2. Todas as respostas 3 devem produzir pontuação 50 em cada dimensão.
3. Todas as respostas 5: dimensões com três itens diretos e três invertidos devem produzir 50.
4. Todas as respostas 1: dimensões com três itens diretos e três invertidos devem produzir 50.
5. Inversão de resposta: 1↔5 e 2↔4; 3 permanece 3.
6. Recuperação de tentativa válida preserva respostas, ordem e posição atual.
7. Tentativa incompatível ou corrompida não deve ser sobrescrita automaticamente.
8. Conclusão grava o formato esperado do resultado e limpa o progresso.

## Sequência segura

1. Implementar testes executáveis contra a lógica atual, sem alterar o comportamento público.
2. Extrair somente os dados das perguntas e validar a integração.
3. Extrair cálculos; executar testes antes e depois.
4. Isolar persistência e interface gradualmente, preservando chaves e contratos.

> Regra: não mudar conteúdo, IDs, revisões ou algoritmo durante uma refatoração estrutural. Mudanças metodológicas devem ser tratadas separadamente.

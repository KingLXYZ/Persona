# Plano de integração — questionário revisado e compartilhamento

Documento de planejamento interno. Não altera o questionário público.

## Decisões confirmadas

- Adotar as 30 redações propostas na auditoria metodológica, incluindo COM-002 e COM-003 refinadas.
- Oferecer dois cartões opcionais: completo (cinco dimensões) e resumido (duas dimensões de maior pontuação).
- Preservar a identidade visual escura e roxa do Persona, com aviso de instrumento experimental.
- Não publicar rótulos técnicos de versão para visitantes.
- Não enviar resultados a servidor ou expor dados pessoais automaticamente.
- Integrar gradualmente, com verificações de compatibilidade antes de alterar arquivos públicos.

## Dependências técnicas verificadas

- `quiz-perguntas.js`: 30 itens com `id`, `revisao: 1`, `dimensao` e `invertida`.
- `quiz-v3.js`: `VERSAO = 3`, `REVISAO_INSTRUMENTO = 1`; usa `persona_resultado_v3` e `persona_progresso_v3`. Atualmente salva pontuações e versão, mas não registra a revisão do instrumento no resultado final.
- `persona-historico.js`: valida versões 1, 2 e 3 e guarda `versao`, `totalPerguntas`, `pontuacoes`, data e ID. Não armazena a revisão do instrumento.
- `resultado-v3.js`: lê resultados e perfis de versões anteriores e atuais; necessita distinguir resultados obtidos com redações diferentes.
- `quiz.html`: referencia `quiz-perguntas.js?v=1` e `quiz-v3.js?v=10`; o cache deve ser considerado ao publicar a atualização.

## Ordem segura de implementação

1. Definir uma identidade interna inequívoca para o instrumento revisado e seu histórico, compatível com resultados antigos; inspecionar e atualizar os leitores/gravadores antes de publicar as novas perguntas. Não tratar pontuações de revisões diferentes como diretamente comparáveis.
2. Atualizar as 30 redações e revisões dos itens em `quiz-perguntas.js`, preservando IDs, dimensões, polaridades e ordem lógica. Conferir 30 IDs únicos, seis por dimensão, três itens diretos e três invertidos por dimensão.
3. Ajustar referências de cache e realizar teste completo de quiz, progresso, conclusão, resultado e histórico. Não remover dados locais antigos.
4. Criar módulo de geração de cartões usando os resultados existentes no navegador, sem dependências externas obrigatórias.
5. Integrar controles de escolha de formato, pré-visualização, salvar imagem e compartilhamento nativo com fallback de download.
6. Testar desktop/mobile, imagens e acessibilidade; documentar limitações de compartilhamento do Instagram e WhatsApp.

## Cuidados

- Evitar mudar a fórmula de pontuação sem justificativa e revisão específica.
- O cartão resumido destaca duas maiores pontuações, mas não representa necessariamente duas capacidades superiores.
- Links públicos para o Persona não devem sugerir que o destinatário terá acesso ao resultado privado de quem compartilhou.
- Alterações devem ser revisadas arquivo a arquivo; a ativação pública deve ocorrer somente quando as dependências estiverem compatíveis.

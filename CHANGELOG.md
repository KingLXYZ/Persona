# Histórico de alterações — Persona

Este arquivo registra mudanças relevantes no código e no comportamento do Persona. O projeto é **experimental**; os resultados do questionário não constituem diagnóstico nem avaliação psicométrica validada.

O histórico abaixo foi reconstruído a partir de alterações verificáveis no repositório. **Ainda não atribuímos números de lançamento retroativamente.** As datas correspondem aos commits no GitHub (UTC), não necessariamente a lançamentos públicos separados.

O versionamento dos lançamentos do site será independente da revisão metodológica do questionário, das chaves de armazenamento e dos parâmetros `?v=` usados para atualização de cache.

## [Não lançado]

Reservado para alterações futuras, ainda não incluídas em um lançamento identificado. Quando definirmos a primeira versão formal, registraremos sua data e o conjunto de mudanças correspondente.

### 2026-11-28 — Padronização da terminologia pública (correção 09)

- Padronizados os termos perguntas, exploração, perfil e salvamento, com avisos metodológicos consistentes e linguagem mais clara sobre aplicações anteriores.
- Preservados os identificadores técnicos, regras de pontuação e armazenamento. Validação manual concluída: nove verificações aprovadas pelo responsável pelo projeto, incluindo a execução do GitHub Actions. Correção 09 encerrada.

### 2026-11-28 — Encerramento da correção 08 (acessibilidade)

- Atalho para conteúdo principal, foco visível, nomes acessíveis e mensagens de erro revisados.
- Contraste, tipografia, reflow, alvos interativos e controle de pausa da órbita aprimorados.
- Testes de inicialização atualizados para simular atributos DOM.
- 178 testes manuais contabilizados e aprovados conforme relato do responsável, além de verificações complementares e GitHub Actions aprovado.
- Matriz de evidências e limitações em [docs/acessibilidade.md](docs/acessibilidade.md). Sem declaração formal de conformidade WCAG.

### 2026-11-22 — Compartilhamento, compatibilidade histórica e validação

**Adicionado**
- Cartões de compartilhamento do perfil em PNG, nos formatos completo (cinco dimensões) e resumido (duas dimensões), com identidade visual do Persona.
- Opções de baixar a imagem e compartilhar pelo recurso nativo do dispositivo, quando disponível.
- Testes automatizados do gerador de cartões, incluindo formatos, validação de pontuações e exportação PNG.
- Fluxo de integração contínua em `.github/workflows/testes.yml`, com verificação de sintaxe JavaScript e execução da suíte de testes a cada envio à branch principal.

**Corrigido**
- Proteção da interpretação de resultados de revisões anteriores ou não identificadas: pontuações históricas são preservadas sem receber automaticamente as leituras do questionário atual.
- Avisos na área Minha Jornada sobre a comparabilidade limitada entre aplicações anteriores e atuais.
- Parâmetros de cache dos scripts alterados, para facilitar a atualização do navegador.

**Validado**
- Testes manuais relatados no navegador: início do questionário em 1/30, recuperação de progresso, conclusão das 30 perguntas e exibição das cinco pontuações, visualização e download dos dois cartões, e salvamento em Minha Jornada.
- GitHub Actions: execução [45063339524](https://github.com/KingLXYZ/Persona/actions/runs/45063339524) concluída com sucesso, incluindo verificação de sintaxe e suíte automatizada.

**Limitações conhecidas da validação**
- Os testes manuais acima cobrem os fluxos relatados, não todos os navegadores ou dispositivos.
- Ainda não foram verificados manualmente todos os cenários de registros legados, armazenamento indisponível e cancelamento do compartilhamento nativo.
- A conclusão dos testes não equivale à validação psicométrica do questionário, que continua experimental.

## Histórico anterior ao versionamento formal

### 2026-11-21 — Confiabilidade, recuperação de dados e manutenção

**Adicionado**
- Testes de inicialização para módulos auxiliares ausentes e armazenamento de sessão bloqueado.
- Recuperação explícita de registros inválidos no histórico, com confirmação e tentativa de cópia de segurança do conteúdo original antes de alterá-lo.
- Testes de recuperação de histórico, incluindo dados ilegíveis e falha ao criar backup.

**Corrigido**
- Exibição de mensagem quando módulos essenciais do questionário não carregam, em vez de manter o estado de carregamento.
- Tratamento de erro quando o navegador bloqueia o acesso inicial ao `sessionStorage`.
- Aviso de registros inválidos em Minha jornada, inclusive quando não há nenhum registro válido.
- Texto da Metodologia sobre fontes: os arquivos de fonte são hospedados no próprio site.

**Alterado**
- Remoção da função vazia de estilos do QR Code e de seletores antigos `aria-pressed` do CSS do questionário.
- Atualização dos parâmetros de cache dos recursos modificados.

### 2026-11-20 — Organização modular e testes do questionário

**Adicionado**
- Documentação dos contratos do questionário, da arquitetura e das verificações de manutenção.
- Testes de estrutura das perguntas, pontuação, persistência e navegação.
- Arquivos dedicados para perguntas (`quiz-perguntas.js`), pontuação (`quiz-pontuacao.js`), progresso (`quiz-progresso.js`) e interface (`quiz-interface.js`).

**Alterado**
- `quiz-v3.js` passou a coordenar os módulos, preservando as regras de pontuação, os identificadores das perguntas e o fluxo principal do questionário.
- Fontes DM Sans e Manrope passaram a ser carregadas localmente nas páginas principais.

## Convenções para as próximas atualizações

- **Adicionado:** funcionalidades e capacidades novas.
- **Alterado:** mudanças no comportamento ou na organização existente.
- **Corrigido:** defeitos resolvidos.
- **Removido:** funcionalidades ou código retirados.
- **Segurança:** alterações relevantes à proteção de dados e à segurança técnica, quando aplicável.

Para cada lançamento formal, registrar a versão, a data e apenas as mudanças relevantes para aquele lançamento. Preferir links para commits ou tags quando existirem. Não tratar cada commit como um lançamento.

Mudanças metodológicas nas perguntas, na interpretação ou na pontuação devem ser destacadas separadamente, com atenção à compatibilidade dos resultados antigos. O número de versão do software não substitui a identificação da revisão do instrumento.

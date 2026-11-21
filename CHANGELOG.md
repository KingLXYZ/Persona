# Histórico de alterações — Persona

Este arquivo registra mudanças relevantes no código e no comportamento do Persona. O projeto é **experimental**; os resultados do questionário não constituem diagnóstico nem avaliação psicométrica validada.

O histórico abaixo foi reconstruído a partir de alterações verificáveis no repositório. **Ainda não atribuímos números de lançamento retroativamente.** As datas correspondem aos commits no GitHub (UTC), não necessariamente a lançamentos públicos separados.

O versionamento dos lançamentos do site será independente da revisão metodológica do questionário, das chaves de armazenamento e dos parâmetros `?v=` usados para atualização de cache.

## [Não lançado]

Reservado para alterações futuras, ainda não incluídas em um lançamento identificado. Quando definirmos a primeira versão formal, registraremos sua data e o conjunto de mudanças correspondente.

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

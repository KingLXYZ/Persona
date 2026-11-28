# Auditoria de acessibilidade — correção 08

## Escopo e conclusão

Referência: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), níveis A e AA. Escopo: index.html, quiz.html, resultado.html, metodologia.html e minha-jornada.html, incluindo os fluxos de questionário, histórico, QR e feedback.

Encerramento interno da correção 08: 2026-11-28. Base de código validada: `082e7de9c1ccc81997fecd0681d1483a0e1d8e8e`. Foram contabilizados 178 testes manuais aprovados pelo responsável pelo projeto, além de verificações complementares sem contagem individual. GitHub Actions aprovado conforme relato do responsável. Não se trata de certificação nem declaração formal de conformidade WCAG; não houve auditoria independente ou cobertura exaustiva de navegadores e tecnologias assistivas.

## Matriz de evidências

F = evidência favorável nos testes ou inspeções realizados; N = aparentemente não aplicável ao escopo próprio; P = evidência insuficiente para conclusão individual. F não significa certificação de atendimento integral.

| Critérios | Estado | Evidência ou limite |
|---|---|---|
| 1.1.1 | F | Nomes e descrições de imagens, cartões e QR |
| 1.2.1–1.2.5 | N | Sem mídia audiovisual identificada |
| 1.3.1–1.3.2 | F | Semântica, sequência e leitura assistiva |
| 1.3.3 | P | Instruções sensoriais não inventariadas exaustivamente |
| 1.3.4 | F | Orientação horizontal testada |
| 1.3.5 | P | Finalidade de campos externos não auditada individualmente |
| 1.4.1 | F | Seleção e estados não dependem somente da cor nos controles testados |
| 1.4.2 | N | Sem áudio automático identificado |
| 1.4.3–1.4.4 | F | Contraste amostral e zoom |
| 1.4.5 | P | Cartões de compartilhamento e exceções não classificados exaustivamente |
| 1.4.10–1.4.12 | F | Reflow, contraste de controles e espaçamento testados |
| 1.4.13 | P | Conteúdo em hover/foco não inventariado exaustivamente |
| 2.1.1–2.1.2 | F | Teclado, diálogos e retorno de foco |
| 2.1.4 | N | Sem atalhos de caracteres identificados |
| 2.2.1 | N | Sem limite de tempo imposto identificado |
| 2.2.2 | F | Controle de pausa da órbita |
| 2.3.1 | F | Inspeção sem padrão de flashes perigosos identificado |
| 2.4.1–2.4.4 | F | Atalho, títulos, foco e links |
| 2.4.5 | P | Múltiplas formas de localização não verificadas individualmente |
| 2.4.6–2.4.7 | F | Rótulos e foco visível |
| 2.4.11 | F | Foco não encoberto nos cenários testados |
| 2.5.1 | N | Sem gestos complexos obrigatórios identificados |
| 2.5.2 | P | Cancelamento do ponteiro não auditado exaustivamente |
| 2.5.3 | F | Nomes acessíveis revisados, inclusive exclusão |
| 2.5.4 | N | Sem acionamento por movimento identificado |
| 2.5.7 | N | Sem arraste obrigatório identificado |
| 2.5.8 | F | Dimensões dos principais alvos e navegação revisadas |
| 3.1.1 | F | pt-BR nas cinco páginas |
| 3.1.2 | P | Slogan marcado em inglês; demais trechos não inventariados integralmente |
| 3.2.1–3.2.4 | F | Navegação e comportamento nos fluxos testados |
| 3.2.6 | P | Consistência dos mecanismos de ajuda não auditada individualmente |
| 3.3.1–3.3.4 | F | Mensagens, instruções, confirmação e recuperação testadas |
| 3.3.7 | P | Entrada redundante não avaliada individualmente no formulário externo |
| 3.3.8 | N | Sem autenticação própria identificada |
| 4.1.2–4.1.3 | F | ARIA, estados e mensagens nos fluxos testados |

## Manutenção

Reexecutar testes automatizados e verificar teclado, foco, leitor de tela, zoom, reflow, contraste, redução de movimento, histórico e QR após mudanças relevantes. Usar ambiente isolado para testes destrutivos. O Google Forms é externo e pode mudar independentemente do Persona; sua interface foi testada pelo responsável, sem garantia permanente. Manter os critérios P como pontos de revisão futura, especialmente antes de qualquer declaração pública de conformidade. A acessibilidade não altera o caráter experimental do questionário.

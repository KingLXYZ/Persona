# PERSONA

Ferramenta **experimental** de autoconhecimento publicada no GitHub Pages. Os resultados não são diagnóstico psicológico nem avaliação psicométrica validada.

## Dados e privacidade

As respostas são processadas no navegador. Durante o preenchimento, o `sessionStorage` guarda temporariamente as respostas individuais, a ordem das perguntas, a posição atual e metadados técnicos de revisão para permitir retomar a tentativa. Ao concluir o questionário, esse progresso é removido, e as cinco pontuações permanecem temporariamente na sessão para exibir o resultado. Os dados de sessão normalmente deixam de estar disponíveis quando a sessão da aba termina, mas o comportamento de restauração varia conforme o navegador. Salvar um perfil no `localStorage` é opcional e não inclui as respostas individuais. Em **Minha jornada → Apagar todos os dados deste navegador**, o visitante pode apagar os dados do PERSONA conhecidos pelo aplicativo (perfil principal, histórico e resultados temporários). Isso não remove cópias em outros dispositivos.

A transferência por QR Code codifica as pontuações num link; **não há criptografia ou verificação criptográfica de autenticidade**. Links e imagens de QR devem ser compartilhados apenas de forma privada. A importação exige confirmação explícita.

Projetos sob a mesma origem `kinglxyz.github.io` podem compartilhar o armazenamento local do navegador. Não armazene senhas nem segredos no localStorage.

## Segurança técnica

As cinco páginas principais usam Content Security Policy (CSP) declarada via meta-tag, restringindo scripts ao próprio site. Scripts HTML internos foram separados em `home-dimensoes.js` e `minha-jornada.js`. As páginas principais carregam estilos e fontes locais; a política atual restringe `style-src` e `font-src` a `'self'`. Mudanças nas políticas devem ser conferidas diretamente nas meta-tags das páginas. O navegador recebe `referrer=no-referrer` nas páginas principais.

A CSP declarada como meta-tag tem limitações: por exemplo, a proteção `frame-ancestors` exige cabeçalhos HTTP, que não são controlados diretamente por arquivos HTML estáticos do GitHub Pages.

## Histórico de alterações

As mudanças relevantes do projeto e as convenções para futuros lançamentos estão registradas em [`CHANGELOG.md`](CHANGELOG.md). O histórico anterior ao versionamento formal não recebeu números de versão retroativos.

## Arquitetura e testes automatizados

A organização dos módulos do questionário, a ordem de carregamento, os contratos de compatibilidade e o procedimento de manutenção estão descritos em [`docs/arquitetura-questionario.md`](docs/arquitetura-questionario.md).

Com Node.js instalado, execute na raiz do repositório:

```powershell
node --test tests/*.test.cjs
```

A suíte contém testes de perguntas, pontuação, progresso, navegação, falhas de inicialização e recuperação do histórico. Os testes de navegação extraem funções do controlador e podem precisar de atualização se essas funções forem movidas. Ainda não existe teste automatizado de ponta a ponta para a interface no navegador.

## Testes manuais recomendados antes da publicação

1. Na página inicial, clicar nos cinco cartões, testar botões e links.
2. Responder às 30 perguntas, abrir resultado e salvar perfil.
3. Abrir Minha jornada, gerar QR, importar no celular e confirmar que uma segunda importação não cria duplicata.
4. Verificar o botão de exclusão completa **após preservar cópias dos perfis que deseja manter**; conferir ausência de dados em resultados e histórico.
5. Examinar no navegador o Console e a aba Network para bloqueios CSP ou recursos inesperados, em celular e computador.

Scripts antigos não referenciados foram retirados em etapas anteriores; o histórico Git preserva esses conteúdos. Os testes automatizados atuais ficam na pasta `tests/`.

## Acessibilidade

O registro da auditoria interna, das evidências e das limitações está em [`docs/acessibilidade.md`](docs/acessibilidade.md). O encerramento da correção 08 não constitui declaração formal de conformidade WCAG.

# PERSONA

Ferramenta **experimental** de autoconhecimento publicada no GitHub Pages. Os resultados não são diagnóstico psicológico nem avaliação psicométrica validada.

## Dados e privacidade

As respostas são processadas no navegador. Os indicadores permanecem na sessão, salvo quando a pessoa decide guardar o perfil em armazenamento local. Em **Minha jornada → Apagar todos os dados deste navegador**, o visitante pode apagar os dados do PERSONA conhecidos pelo aplicativo (perfil principal, histórico e resultados temporários). Isso não remove cópias em outros dispositivos.

A transferência por QR Code codifica as pontuações num link; **não há criptografia ou verificação criptográfica de autenticidade**. Links e imagens de QR devem ser compartilhados apenas de forma privada. A importação exige confirmação explícita.

Projetos sob a mesma origem `kinglxyz.github.io` podem compartilhar o armazenamento local do navegador. Não armazene senhas nem segredos no localStorage.

## Segurança técnica

As cinco páginas principais usam Content Security Policy (CSP) declarada via meta-tag, restringindo scripts ao próprio site. Scripts HTML internos foram separados em `home-dimensoes.js` e `minha-jornada.js`. A diretiva `style-src 'unsafe-inline'` permanece temporariamente por causa dos estilos inline atuais. O navegador recebe `referrer=no-referrer` nas páginas principais.

A CSP declarada como meta-tag tem limitações: por exemplo, a proteção `frame-ancestors` exige cabeçalhos HTTP, que não são controlados diretamente por arquivos HTML estáticos do GitHub Pages.

## Testes recomendados antes da nova rodada

1. Na página inicial, clicar nos cinco cartões, testar botões e links.
2. Responder às 30 perguntas, abrir resultado e salvar perfil.
3. Abrir Minha jornada, gerar QR, importar no celular e confirmar que uma segunda importação não cria duplicata.
4. Verificar o botão de exclusão completa **após preservar cópias dos perfis que deseja manter**; conferir ausência de dados em resultados e histórico.
5. Examinar no navegador o Console e a aba Network para bloqueios CSP ou recursos inesperados, em celular e computador.

Arquivos de teste e scripts anteriores não referenciados foram retirados da publicação nesta etapa. O histórico Git preserva seus conteúdos em commits anteriores.

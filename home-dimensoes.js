/* PERSONA — dimensões interativas; script local sob CSP. */
(() => {
        'use strict';
        const dimensoes = {
            social: {
                numero: '01 / SOCIAL',
                titulo: 'Conexões e interações',
                descricao: 'Explora suas preferências ao participar de conversas e se relacionar em diferentes contextos sociais. A dimensão não define se alguém é tímido ou antissocial.',
                pergunta: 'Em quais ambientes você se sente mais à vontade para iniciar uma conversa?'
            },
            cognitiva: {
                numero: '02 / COGNITIVA',
                titulo: 'Ideias e maneiras de compreender',
                descricao: 'Explora preferências entre exemplos concretos e possibilidades abstratas. A pontuação não mede inteligência, criatividade ou capacidade de aprender.',
                pergunta: 'Ao aprender algo novo, você prefere começar com exemplos ou com ideias gerais?'
            },
            decisoria: {
                numero: '03 / DECISÓRIA',
                titulo: 'Escolhas e alternativas',
                descricao: 'Explora preferências ao decidir, entre confiar na impressão inicial e analisar alternativas de forma estruturada. Nenhuma posição garante decisões melhores.',
                pergunta: 'Em quais situações você prefere comparar opções antes de decidir?'
            },
            organizacional: {
                numero: '04 / ORGANIZACIONAL',
                titulo: 'Rotina e planejamento',
                descricao: 'Explora sua preferência por flexibilidade ou planejamento ao lidar com tarefas e projetos. Não mede disciplina ou produtividade.',
                pergunta: 'O que você prefere planejar e o que gosta de deixar em aberto?'
            },
            comportamental: {
                numero: '05 / COMPORTAMENTAL',
                titulo: 'Respostas e imprevistos',
                descricao: 'Explora preferências entre reagir prontamente e fazer uma pausa para avaliar situações inesperadas. Não indica maturidade ou controle emocional.',
                pergunta: 'Quando é melhor agir de imediato e quando vale parar para avaliar?'
            }
        };

        function iniciarCartoes() {
            const botoes = Array.from(document.querySelectorAll('.dimension-choice'));
            const painel = document.getElementById('dimension-detail');
            const numero = document.getElementById('dimension-detail-number');
            const titulo = document.getElementById('dimension-detail-title');
            const descricao = document.getElementById('dimension-detail-description');
            const pergunta = document.getElementById('dimension-detail-question');
            if (!painel || !numero || !titulo || !descricao || !pergunta || !botoes.length) return;
            for (const botao of botoes) {
                botao.addEventListener('click', () => {
                    const chave = botao.dataset.dimension;
                    const dados = dimensoes[chave];
                    if (!dados || botao.getAttribute('aria-pressed') === 'true') return;
                    for (const outro of botoes) {
                        outro.setAttribute('aria-pressed', String(outro === botao));
                    }
                    numero.textContent = dados.numero;
                    titulo.textContent = dados.titulo;
                    descricao.textContent = dados.descricao;
                    pergunta.textContent = dados.pergunta;
                    painel.classList.remove('is-changing');
                    // Reinicia a transição apenas quando o usuário seleciona uma dimensão.
                    void painel.offsetWidth;
                    painel.classList.add('is-changing');
                });
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', iniciarCartoes, { once: true });
        } else {
            iniciarCartoes();
        }
    })();

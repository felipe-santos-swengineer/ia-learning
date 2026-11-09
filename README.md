# nexo — IA para a vida real

Um espaço de aprendizado de inteligência artificial para pessoas de qualquer área, sem exigir programação. A aplicação estática funciona no navegador e no GitHub Pages, sem backend ou APIs pagas.

## Como o aprendizado está organizado

- **Comece aqui:** objetivo da aplicação e mapa das atividades.
- **Como a IA escreve:** um convite de festa mostra a diferença entre texto provável e informação correta.
- **Como aproxima ideias:** uma biblioteca fictícia explica a busca por assuntos e as limitações do exemplo.
- **Como consulta fontes:** acompanhe a procura de uma regra antes de orientar alguém.
- **Experimente com textos:** compare buscas em regras da biblioteca ou textos próprios, com desafios cotidianos.
- **Confira os resultados:** confira várias perguntas, leia as evidências e salve estudos no navegador.
- **Veja a IA em ação:** acompanhe o atendimento de uma compra fictícia, com consultas, limites e falhas.

Cada atividade apresenta sua finalidade, uma situação realista, instruções e o aprendizado esperado. Números de versão não aparecem na navegação. Os nomes técnicos são explicados ou ficam em detalhes opcionais.

Os textos de biblioteca e loja são fictícios. Não há chat com IA real: a escrita e o atendimento usam regras didáticas, e as buscas usam cálculos locais. Estudos anteriores salvos continuam compatíveis e mantêm seus textos originais.

## Aprendizado visual

- Cenas vetoriais em SVG, desenhadas no código e empacotadas com o site, sem serviços ou imagens externas.
- Abertura com três cenas selecionáveis: escrever, consultar fontes e acompanhar uma entrega.
- Histórias em três quadros para ligar os conceitos a situações do cotidiano.
- Roleta proporcional às probabilidades e convite que muda com a continuação sorteada.
- Mapa ilustrativo de assuntos que reage às pistas da pergunta; as posições são fixas e não representam embeddings reais.
- Caminho visual da consulta de fontes e recortes de papel que mostram o efeito do tamanho e da sobreposição dos trechos.
- Cartões de avaliação baseados nas fontes realmente encontradas, ausentes e extras.
- Rota de atendimento e bilhetes que mostram as consultas disponíveis e usadas.

As cenas têm descrições acessíveis. As animações respeitam a preferência do dispositivo por movimento reduzido. As informações principais também aparecem em texto; nenhuma conclusão depende apenas de cor.

## Executar

Requer Node.js 22.18+ (ou Node.js 24+) e npm.

```sh
npm ci
npm run dev
```

Abra o endereço local mostrado pelo Vite. Para verificar e compilar:

```sh
npm test
npm run build
npm run preview
```

## GitHub Pages

1. Crie um repositório público e envie estes arquivos para a branch `main`, incluindo `package-lock.json`.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. O workflow `.github/workflows/deploy.yml` testa, compila e publica o site. Execute-o manualmente na aba Actions caso necessário.

O endereço será `https://USUARIO.github.io/REPOSITORIO/`. O build usa caminhos relativos e a navegação usa hashes, permitindo abrir módulos diretamente sem regras de servidor. Não é necessário comprar domínio.

## Conteúdo e limites

- LLMs: amostragem real de uma distribuição didática com logits fixos. Não há um LLM executando.
- Embeddings: vetores de quatro dimensões construídos com vocabulário fixo; cosseno real. Não são embeddings de um modelo treinado.
- RAG: divisão em trechos, recuperação por cosseno e composição de contexto reais. A resposta é uma extração dos trechos, identificada como não gerada por IA.
- Cada módulo tem explicação, aplicações, laboratório, exemplo JavaScript e desafio com feedback.
- Progresso salvo em localStorage, apenas no dispositivo; pode ser reiniciado em Sobre.
- O site não envia as entradas dos laboratórios para servidores. Links externos na página Sobre levam às fontes quando abertos.

Os tempos por módulo são estimativas editoriais. GitHub Pages tem limites de uso definidos pelo GitHub. Não há dependência de serviços com cobrança por consumo.

## Novidades da V2

Abra `#workbench` pelo menu Laboratório V2.

- Importe documentos UTF-8 .txt e .md (100 KB por arquivo), ou cole textos. A base aceita até 12 documentos e 200 mil caracteres.
- Compare tamanho de trecho, sobreposição e top-k sobre a mesma base e pergunta.
- Inspecione documentos, trechos, índice TF-IDF, ranking lexical e contexto com referências à posição na fonte.
- Faça uma previsão e exporte o experimento completo em JSON. O arquivo contém os documentos importados.
- Resolva três missões: preservar avisos de segurança, recuperar fontes suficientes e reformular consultas.

A busca TF-IDF é lexical, sem embeddings treinados nem compreensão de sinônimos. Cada configuração calcula seu próprio índice; os scores entre A e B não são diretamente comparáveis. O pipeline termina no contexto e não chama um LLM. Documentos ficam na memória da aba; recarregar os remove. O progresso das missões fica em localStorage.

## Novidades da V3

Abra `#evaluation` pelo menu Avaliação V3.

- Dez perguntas iniciais, com edição das fontes esperadas e até 30 perguntas por projeto.
- Comparação A/B em lote, Precision@k, Recall@k e MRR com fórmulas e evidências por pergunta.
- Filtros de falhas: sem resultados, fontes ausentes, fontes não esperadas e regressão de cobertura.
- Projetos salvos em IndexedDB, com abertura, exclusão e importação/exportação JSON validada.
- Exportação de relatório com o projeto congelado e os resultados para reprodução.

As métricas avaliam documentos únicos: cada documento aparece na posição de seu melhor trecho. Aqui k representa fontes, enquanto no laboratório V2 representa trechos. Precision@k divide por k, inclusive vagas não preenchidas. Recall conta fontes esperadas únicas. MRR é a média do inverso da posição da primeira fonte relevante, ou zero quando ausente. As médias são macro, por pergunta. Não avaliamos a correção de respostas de LLM nem a suficiência do trecho. Fontes esperadas são rótulos humanos editáveis.

Limites: 12 documentos, 200 mil caracteres no total, 100 mil por documento e 30 perguntas. Cada pergunta exige pelo menos uma fonte esperada. Projetos são locais ao navegador e podem desaparecer ao limpar dados do site; exporte uma cópia. Dados não são enviados a servidores.

## Novidades da V5

Abra `#agents` pelo menu Agentes V5. A numeração passa diretamente da V3 à V5 conforme solicitado.

- Quatro cenários: consulta de pedido, encadeamento com entrega, timeout e nota externa com instrução indevida.
- Máquina de estados observável: propor, validar, executar, observar e concluir.
- Contratos JSON inspecionáveis, argumentos editáveis e validação antes de executar.
- Orçamento de chamadas, política de retry e parada controlada sem inventar resultados.
- Histórico exportável em JSON e três desafios com progresso salvo no navegador.

Não há LLM: o planejador e a resposta são determinísticos e seguem regras. As ferramentas são funções locais sobre pedidos fictícios. O timeout é injetado. O histórico é de ações da aplicação, não raciocínio interno. Ignorar uma nota por regra fixa não demonstra proteção geral contra prompt injection em modelos reais.

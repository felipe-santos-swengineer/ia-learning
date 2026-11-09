# nexo — IA para a vida real

Um espaço de aprendizado de inteligência artificial para pessoas de qualquer área, sem exigir programação. A aplicação estática funciona no navegador e no GitHub Pages, sem backend ou APIs pagas.

## Como o aprendizado está organizado

- **Comece aqui:** objetivo da aplicação e mapa das atividades.
- **Missão guiada:** um percurso único para montar um convite, experimentar e conferir detalhes com a ficha da festa.
- **Como a IA escreve:** um convite de festa mostra a diferença entre texto provável e informação correta.
- **Como aproxima ideias:** uma biblioteca fictícia explica a busca por assuntos e as limitações do exemplo.
- **Como consulta fontes:** acompanhe a procura de uma regra antes de orientar alguém.
- **Oficina de pedidos:** monte pedidos com cartões de objetivo, contexto, formato e cuidados, antecipe o resultado e compare exemplos preparados.
- **Converse com uma IA:** ative opcionalmente um modelo real no dispositivo e experimente uma conversa sem API paga.
- **Experimente com textos:** compare buscas em regras da biblioteca ou textos próprios, com desafios cotidianos.
- **Confira os resultados:** confira várias perguntas, leia as evidências e salve estudos no navegador.
- **Veja a IA em ação:** acompanhe o atendimento de uma compra fictícia, com consultas, limites e falhas.

Cada atividade apresenta sua finalidade, uma situação realista, instruções e o aprendizado esperado. Números de versão não aparecem na navegação. Os nomes técnicos são explicados ou ficam em detalhes opcionais.

Os textos de biblioteca e loja são fictícios. As atividades educativas usam regras didáticas e buscas locais. A seção “Converse com uma IA” oferece um modelo real opcional, executado no dispositivo. Estudos anteriores salvos continuam compatíveis e mantêm seus textos originais.

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

## Oficina de pedidos

Abra `#workshop`. Três situações fictícias: convite de aniversário, resumo de um aviso de condomínio e planejamento de um passeio em família. O usuário combina quatro tipos de informação no pedido, escolhe uma previsão antes de revelar a comparação e confere as respostas com a fonte. A previsão não precisa estar correta para continuar.

As respostas são preparadas e seguem regras locais; não há chamada a LLM. O número de cartões selecionados não é apresentado como nota de qualidade. Alterar os cartões invalida a comparação anterior até uma nova execução. Cada situação inclui uma pergunta de verificação e progresso local. O pedido pode ser copiado ou baixado como `.txt`.

## IA real no navegador

Abra `#chat`. WebLLM 0.2.87 executa Qwen2.5-0.5B-Instruct em Web Worker, com WebGPU e respostas transmitidas progressivamente. O registro oficial da biblioteca define os arquivos de execução compatíveis. Navegadores com shader-f16 usam q4f16_1; os demais usam q4f32_1.

- A biblioteca de execução e o worker só são carregados ao clicar em **Ativar IA neste dispositivo**. Não há download automático dos pesos ao abrir o site.
- Os pesos têm aproximadamente 278 MB (f16) ou 309 MB (f32), além dos demais arquivos. O site informa cerca de 300 MB como estimativa e avisa que pode variar. A execução pode precisar de cerca de 1 GB ou mais de memória gráfica.
- Pesos e configuração são baixados publicamente do Hugging Face/MLC; o WebAssembly vem do GitHub/MLC. Não há token, segredo, proxy, serviço de inferência pago ou envio das mensagens a esses servidores.
- Verificação de HTTPS, WebGPU e adaptador antes da ativação; detecção não garante memória suficiente. Falhas de GPU, download e contexto são apresentadas sem fingir uma resposta.
- Até 1200 caracteres por pedido, 160 tokens de resposta (48 para cumprimentos) e histórico limitado aos últimos três pares completos, dentro de um orçamento de caracteres. Respostas podem atingir o limite; o usuário é avisado. O modelo é pequeno, pode errar e não acessa a internet.
- A conversa fica somente na memória da aba e sobrevive à navegação interna. Recarregar apaga as mensagens. Persistência de conversas/resumable generation não é habilitada.
- Interromper pede parada ao modelo; se não responder em oito segundos, o worker é encerrado. Cancelar o carregamento/desativar também encerra o worker e invalida operações pendentes.
- O cache de arquivos usa Cache Storage. Há controle para remover os dois modelos do cache do site, sem prometer funcionamento offline.
- **Experimentar na IA real**, na oficina, apenas prepara o texto e abre a conversa; não ativa o modelo nem envia o pedido automaticamente.

A integração é verificada por TypeScript/build, testes de política de histórico/cancelamento/registro de modelos e checagem dos endpoints públicos. A qualidade e velocidade precisam ser avaliadas em dispositivos com WebGPU; testes sem GPU não comprovam inferência real.

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

## Latência da conversa

- A ativação só termina depois de um teste real de geração de oito tokens, para executar o caminho de preparação da GPU antes da primeira pergunta. O tempo desse teste aparece na interface.
- O código não chama resetChat a cada mensagem: o WebLLM reutiliza o cache de atenção quando o histórico corresponde e reconstrói automaticamente quando necessário. O reset explícito acontece apenas após o teste inicial para descartar a conversa de aquecimento.
- A instrução fixa foi encurtada. Cumprimentos continuam sendo respondidos pelo modelo, com um limite de 48 tokens; demais pedidos usam até 160. Não há resposta pronta disfarçada de IA.
- O adaptador da verificação usa a mesma preferência high-performance do runtime WebLLM.
- A primeira parte de texto é exibida imediatamente; atualizações seguintes são agrupadas em intervalos de pelo menos 60 ms para reduzir renderizações.
- São exibidos o tempo de espera, tempo até o primeiro texto e tempo total. Após oito segundos sem texto há um aviso; o stream falha com uma mensagem explícita após 30 segundos sem primeiro texto, 20 segundos sem avanço posterior ou 60 segundos no total. O worker é encerrado na falha.

Os testes verificam o contrato de aquecimento, ausência de reset por mensagem, primeira exibição, cancelamento e limites de espera. Eles não medem ganho de velocidade em uma GPU real; desempenho depende de navegador, hardware, driver e carga do dispositivo.

## Missão guiada

Abra `#mission`, também disponível como entrada principal da página inicial. Cinco etapas: ficha de uma festa fictícia, montagem do pedido, experiência, conferência e conclusão personalizada.

- A IA local é opcional, com o mesmo aviso de download e compatibilidade. Usa o modelo já ativo quando possível; o pedido da missão não recebe o histórico do chat e não é adicionado a ele.
- Uma execução da missão bloqueia outras gerações no mesmo worker. Ao sair durante uma geração, ou escolher o exemplo preparado, a execução é cancelada. Ativações iniciadas pela missão também são canceladas ao sair ou escolher o exemplo.
- O exemplo preparado é fixo, explicitamente identificado e contém um endereço sem apoio. Sua análise tem evidências conhecidas e pistas; não pretende reproduzir as escolhas feitas no pedido.
- Na resposta real, as marcações de nome, horário, local e endereço são uma revisão humana, não uma nota automática de correção.
- Só a conclusão fica em localStorage. O pedido e a resposta da missão são descartados ao sair. A conclusão inclui o caminho usado (IA ou preparado) e pode ser refeita.

Os testes cobrem o pedido, limites de entrada, evidências do exemplo preparado, ausência de julgamento automático de respostas reais e conclusão baseada nas escolhas.

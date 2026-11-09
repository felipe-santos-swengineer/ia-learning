# nexo — IA para quem desenvolve

V2 de uma plataforma educacional gratuita em português. React, TypeScript e Vite; aplicação estática, sem backend, contas, analytics ou APIs pagas. Fontes e ícones são empacotados localmente; o site não depende de CDN.

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

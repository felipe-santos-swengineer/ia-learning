export const documents = [
  { title: 'Autenticação', text: 'Para autenticar na API, envie sua chave no cabeçalho Authorization usando Bearer. Nunca exponha a chave no frontend.' },
  { title: 'Limites de requisição', text: 'O plano gratuito permite 100 requisições por minuto. Ao exceder o limite, a API retorna o status 429. Aguarde antes de tentar novamente.' },
  { title: 'Webhooks', text: 'Os webhooks notificam eventos de pagamento por HTTP POST. Valide a assinatura do evento antes de processar o pagamento.' },
  { title: 'Paginação', text: 'Para listar resultados, use os parâmetros page e limit. Cada página pode retornar até 50 itens.' },
];
export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const groups = [['chave','autenticar','autenticacao','token','bearer','authorization','login','acesso'],['limite','limites','requisicoes','429','minuto','cota'],['webhook','webhooks','pagamento','pagamentos','evento','eventos','assinatura'],['pagina','paginacao','page','limit','listar','itens','resultados']];
export function embed(text: string): number[] { const words = normalize(text).match(/[a-z0-9]+/g) || []; return groups.map(group => words.filter(w => group.includes(w)).length); }
export function cosine(a: number[], b: number[]): number { const magnitude = Math.hypot(...a) * Math.hypot(...b); return magnitude ? a.reduce((sum,v,i)=>sum+v*b[i],0)/magnitude : 0; }
export function retrieve(query: string) { const vector = embed(query); return documents.map(doc => ({...doc, score: cosine(vector, embed(doc.text+' '+doc.title))})).sort((a,b)=>b.score-a.score); }
export function probabilities(temperature: number) { const logits = [3.2,2.5,1.6,0.9]; const weights=logits.map(v=>Math.exp(v/temperature)); return weights.map(v=>v/weights.reduce((a,b)=>a+b,0)); }
export function chunks(text: string, size: number) { const words = text.split(/\s+/).filter(Boolean); const result: string[]=[]; for(let i=0;i<words.length;i+=size) result.push(words.slice(i,i+size).join(' ')); return result; }

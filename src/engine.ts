export const documents = [
  { title: 'Cadastro na biblioteca', text: 'Para fazer seu cadastro na biblioteca do bairro, leve um documento de identificação e um comprovante de endereço. A inscrição é gratuita. Estes dados são fictícios para a atividade.' },
  { title: 'Empréstimo de livros', text: 'Cada pessoa cadastrada pode pegar até três livros por empréstimo. O prazo de devolução é de 14 dias. Para retirar um livro, apresente a carteirinha da biblioteca.' },
  { title: 'Renovação de livros', text: 'Para renovar um livro, solicite a renovação pelo telefone ou no balcão antes do prazo de devolução. A renovação dá mais sete dias. Não é possível renovar quando outra pessoa reservou o livro.' },
  { title: 'Horário de funcionamento', text: 'O horário da biblioteca é de segunda a sexta, das 9 às 18 horas. Aos sábados, abre das 9 às 12 horas. A biblioteca não abre aos domingos e feriados.' },
];
export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const groups = [['cadastro','cadastrar','inscricao','documento','identificacao','endereco'],['emprestimo','emprestimos','pegar','retirar','carteirinha','tres','14'],['renovar','renovacao','reservou','reservado','sete'],['horario','horarios','funcionamento','abre','aberta','sabado','sabados','domingo','domingos','feriados']];
export function embed(text: string): number[] { const words = normalize(text).match(/[a-z0-9]+/g) || []; return groups.map(group => words.filter(w => group.includes(w)).length); }
export function cosine(a: number[], b: number[]): number { const magnitude = Math.hypot(...a) * Math.hypot(...b); return magnitude ? a.reduce((sum,v,i)=>sum+v*b[i],0)/magnitude : 0; }
export function retrieve(query: string) { const vector = embed(query); return documents.map(doc => ({...doc, score: cosine(vector, embed(doc.text+' '+doc.title))})).sort((a,b)=>b.score-a.score); }
export function probabilities(temperature: number) { const logits = [3.2,2.5,1.6,0.9]; const weights=logits.map(v=>Math.exp(v/temperature)); return weights.map(v=>v/weights.reduce((a,b)=>a+b,0)); }
export function chunks(text: string, size: number) { const words = text.split(/\s+/).filter(Boolean); const result: string[]=[]; for(let i=0;i<words.length;i+=size) result.push(words.slice(i,i+size).join(' ')); return result; }

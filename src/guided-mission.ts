import { buildPrompt, workshopScenarios } from './prompt-workshop.ts';
import type { Choices } from './prompt-workshop.ts';
export const missionScenario=workshopScenarios[0];
export const missionSteps=['Conheça a festa','Monte o pedido','Experimente','Confira os detalhes','Ajuste e compare','Leve o aprendizado'];
export type Verdict='supported'|'missing'|'unsupported';
export type Review=Partial<Record<'name'|'when'|'place'|'address',Verdict>>;
export const reviewFields=[
 {id:'name' as const,label:'Nome da aniversariante',source:'Nina',prepared:'supported' as const,hint:'O exemplo diz “festa de Nina”, o mesmo nome da ficha.'},
 {id:'when' as const,label:'Dia e horário',source:'Dia 20, às 16h',prepared:'supported' as const,hint:'Compare “dia 20, às 16h” com a ficha: os dois dados conferem.'},
 {id:'place' as const,label:'Nome do local',source:'Salão Aurora',prepared:'missing' as const,hint:'O exemplo não menciona Salão Aurora. A rua inventada não substitui esse dado.'},
 {id:'address' as const,label:'Endereço completo',source:'Não foi informado. Precisa ser confirmado.',prepared:'unsupported' as const,hint:'“Rua das Flores, 100” não aparece na ficha. É uma informação sem apoio.'},
];
export function missionPrompt(choices:Choices){return buildPrompt(missionScenario,choices);}
export function auditReview(review:Review,origin:'real'|'prepared'){
 const complete=reviewFields.every(f=>!!review[f.id]);
 const corrections=origin==='prepared'?reviewFields.filter(f=>review[f.id]!==f.prepared).map(f=>({id:f.id,hint:f.hint})):[];
 return {complete,canContinue:complete&&(origin==='real'||corrections.length===0),corrections,counts:{supported:reviewFields.filter(f=>review[f.id]==='supported').length,missing:reviewFields.filter(f=>review[f.id]==='missing').length,unsupported:reviewFields.filter(f=>review[f.id]==='unsupported').length}};
}
export function missionSkills(choices:Choices,review:Review){const audit=auditReview(review,'real');return [{title:'Dar contexto',detail:choices.context?'Você incluiu os dados da festa no pedido.':'Os dados da festa não entram no seu pedido. Inclua-os quando forem necessários para a resposta.'},{title:'Reconhecer limites',detail:choices.limits?'Você pediu para não inventar um endereço.':'Você pode melhorar o pedido explicitando o que não foi informado.'},{title:'Conferir a resposta',detail:`Na sua revisão: conferem com a ficha: ${audit.counts.supported}. Ausentes ou incompletos: ${audit.counts.missing}. Alterados ou sem apoio: ${audit.counts.unsupported}.`}];}

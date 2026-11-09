import { searchSources, splitSources } from './retrieval.ts';
import type { Source, Config, Passage } from './retrieval.ts';
export type Question = { id: string; query: string; expected: string[] };
export type Project = { version: 3; id: string; name: string; sources: Source[]; questions: Question[]; a: Config; b: Config; updated: string };
export type Metrics = { precision: number; recall: number; rr: number; hits: number; first: number; missing: string[]; results: Passage[] };
export function measure(results: Passage[], expected: string[], k: number): Metrics {
  const seen = new Set<string>();
  const unique = results.filter(p=>{if(seen.has(p.sourceId))return false;seen.add(p.sourceId);return true;}).slice(0,k);
  const truth = [...new Set(expected)]; const found = new Set(unique.map(p=>p.sourceId));
  const hits = truth.filter(id=>found.has(id)).length;
  const first = unique.findIndex(p=>truth.includes(p.sourceId)) + 1;
  return { precision: hits/k, recall: truth.length ? hits/truth.length : 0, rr: first ? 1/first : 0, hits, first, missing: truth.filter(id=>!found.has(id)), results: unique };
}
export function evaluate(project: Project) {
  function run(question: Question, config: Config) {
    const all = searchSources(project.sources, question.query, {...config, topK: splitSources(project.sources, config).length});
    const seen = new Set<string>(); const docs=all.filter(p=>{if(seen.has(p.sourceId))return false;seen.add(p.sourceId);return true;}).slice(0,config.topK);
    return measure(docs,question.expected,config.topK);
  }
  return project.questions.map(q=>({ question:q, a:run(q,project.a), b:run(q,project.b) }));
}
export function average(values: Metrics[]) { const n=values.length||1;return {precision:values.reduce((s,m)=>s+m.precision,0)/n,recall:values.reduce((s,m)=>s+m.recall,0)/n,mrr:values.reduce((s,m)=>s+m.rr,0)/n}; }
export function validateProject(value: unknown): Project {
  const fail=()=>{throw new Error('Projeto inválido. Use um JSON exportado pela bancada V3, com fontes, perguntas e configurações válidas.');};
  if(!value || typeof value!=='object')return fail();
  const p=value as Project;
  if(p.version!==3 || typeof p.id!=='string' || !p.id || p.id.length>100 || typeof p.name!=='string' || !p.name.trim() || p.name.length>100 || typeof p.updated!=='string')return fail();
  if(!Array.isArray(p.sources)||!p.sources.length||p.sources.length>12)return fail();
  const ids=new Set<string>();let length=0;
  for(const s of p.sources){if(!s||typeof s.id!=='string'||!s.id||s.id.length>100||ids.has(s.id)||typeof s.title!=='string'||!s.title.trim()||s.title.length>100||typeof s.text!=='string'||!s.text.trim()||s.text.length>100000)return fail();ids.add(s.id);length+=s.text.length;}
  if(length>200000||!Array.isArray(p.questions)||!p.questions.length||p.questions.length>30)return fail();
  const qids=new Set<string>();for(const q of p.questions){if(!q||typeof q.id!=='string'||!q.id||qids.has(q.id)||typeof q.query!=='string'||!q.query.trim()||q.query.length>500||!Array.isArray(q.expected)||!q.expected.length||q.expected.some(id=>!ids.has(id)))return fail();qids.add(q.id);}
  for(const c of [p.a,p.b])if(!c||![c.size,c.overlap,c.topK].every(Number.isInteger)||c.size<8||c.size>80||c.overlap<0||c.overlap>Math.floor(c.size/2)||c.topK<1||c.topK>5)return fail();
  return {version:3,id:p.id,name:p.name,sources:p.sources.map(s=>({id:s.id,title:s.title,text:s.text})),questions:p.questions.map(q=>({id:q.id,query:q.query,expected:[...new Set(q.expected)]})),a:{...p.a},b:{...p.b},updated:p.updated};
}

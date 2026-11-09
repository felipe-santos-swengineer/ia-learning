// @ts-nocheck -- Node built-in test runner.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { average, evaluate, measure, validateProject } from './evaluation.ts';
const passage=(id:string)=>({id,sourceId:id,title:id,text:id,start:0,end:1,score:1});
const project=()=>({version:3,id:'project',name:'Example',updated:'2026-11-09',sources:[{id:'a',title:'A',text:'Chave de autenticação secreta.'},{id:'b',title:'B',text:'Limite de chamadas por minuto.'}],questions:[{id:'q1',query:'chave',expected:['a']}],a:{size:12,overlap:0,topK:1},b:{size:24,overlap:4,topK:2}});
test('metrics count unique sources and penalize empty slots',()=>{const m=measure([passage('wrong'),passage('a'),passage('a')],['a','b'],3);assert.equal(m.precision,1/3);assert.equal(m.recall,.5);assert.equal(m.rr,.5);assert.deepEqual(m.missing,['b']);assert.equal(m.results.length,2);});
test('zero results and macro averages have exact values',()=>{const empty=measure([],['a'],2);assert.equal(empty.rr,0);assert.equal(empty.precision,0);const perfect=measure([passage('a')],['a'],1);assert.deepEqual(average([empty,perfect]),{precision:.5,recall:.5,mrr:.5});});
test('batch evaluation uses immutable expected sources and unique document ranks',()=>{const p=project();const before=JSON.stringify(p);const rows=evaluate(p);assert.equal(rows[0].a.recall,1);assert.equal(rows[0].b.precision,.5);assert.equal(JSON.stringify(p),before);});
test('project JSON round-trips and deduplicates expected labels',()=>{const p=project();p.questions[0].expected=['a','a'];const result=validateProject(JSON.parse(JSON.stringify(p)));assert.deepEqual(result.questions[0].expected,['a']);assert.equal(result.name,'Example');});
test('invalid imports reject dangling labels, dangerous sizes, duplicates and empty questions',()=>{const invalid=[p=>p.questions[0].expected=['missing'],p=>p.a.size=0,p=>p.a.overlap=99,p=>p.b.topK=100000,p=>p.sources.push(p.sources[0]),p=>p.questions[0].query='',p=>p.questions[0].expected=[],p=>p.version=2,p=>p.sources[0].text='x'.repeat(100001)];for(const mutate of invalid){const p=project();mutate(p);assert.throws(()=>validateProject(p));}});

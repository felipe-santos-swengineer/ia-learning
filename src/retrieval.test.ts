// @ts-nocheck -- executed directly by Node.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContext, missions, searchSources, splitSources, terms } from './retrieval.ts';
test('normalization handles accents and arbitrary document vocabulary', () => {
  assert.deepEqual(terms('Qual é a conexão PostgreSQL?'), ['conexao','postgresql']);
  const sources = [{ id:'x', title:'Banco', text:'PostgreSQL suporta transações e índices.' },{ id:'y', title:'CSS', text:'Use grid para layouts responsivos.' }];
  assert.equal(searchSources(sources,'transações PostgreSQL',{size:20,overlap:0,topK:1})[0].sourceId,'x');
  assert.deepEqual(searchSources(sources,'dinossauro',{size:20,overlap:0,topK:2}),[]);
});
test('overlap preserves boundaries without repeating a trailing chunk', () => {
  const result=splitSources([{id:'a',title:'A',text:'um dois três quatro cinco seis sete oito nove dez'}],{size:6,overlap:2,topK:2});
  assert.equal(result.length,2); assert.equal(result[1].start,4); assert.equal(result[1].end,10);
  assert.equal(result[1].text,'cinco seis sete oito nove dez');
  assert.equal(splitSources([{id:'a',title:'A',text:''}],{size:8,overlap:0,topK:1}).length,0);
});
test('missions fail initially and pass after meaningful fixes', () => {
  for (const mission of missions) {
    assert.equal(mission.check(searchSources(mission.sources,mission.query,mission.initial)),false,mission.id);
    const query=mission.id==='vocabulary'?'reembolso':mission.query;
    const config=mission.id==='context'?{size:32,overlap:0,topK:1}:mission.id==='coverage'?{...mission.initial,topK:2}:mission.initial;
    assert.equal(mission.check(searchSources(mission.sources,query,config)),true,mission.id);
  }
});
test('context includes source provenance and no invented answer', () => {
  const m=missions[1];const ranked=searchSources(m.sources,m.query,{...m.initial,topK:2});
  const context=buildContext(m.query,ranked);
  assert.ok(context.includes('[1]'));assert.ok(context.includes('palavras 1'));assert.ok(context.includes(m.query));assert.ok(context.includes('12 horas'));
});

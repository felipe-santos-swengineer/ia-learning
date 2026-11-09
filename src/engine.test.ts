// @ts-nocheck -- executed directly by Node; no runtime dependencies.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunks, cosine, embed, probabilities, retrieve } from './engine.ts';
test('probabilities sum to one and flatten with temperature',()=>{const low=probabilities(.2),high=probabilities(2);assert.ok(Math.abs(low.reduce((a,b)=>a+b,0)-1)<1e-10);assert.ok(low[0]>high[0]);assert.ok(low[3]<high[3]);});
test('retrieval recognizes accents and ranks everyday library topics',()=>{assert.equal(retrieve('Qual o horário de funcionamento?')[0].title,'Horário de funcionamento');assert.equal(retrieve('Como fazer cadastro?')[0].title,'Cadastro na biblioteca');assert.equal(retrieve('Como renovar?')[0].title,'Renovação de livros');});
test('unknown vocabulary does not invent relevant results',()=>{assert.ok(retrieve('borboleta azul').every(r=>r.score===0));assert.equal(cosine(embed(''),embed('chave')),0);});
test('chunking preserves all words including final partial chunk',()=>{assert.deepEqual(chunks('um dois três quatro cinco',2),['um dois','três quatro','cinco']);assert.deepEqual(chunks('',8),[]);});

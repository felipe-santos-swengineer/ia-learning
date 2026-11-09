// @ts-nocheck -- IndexedDB transactions exercised with a standards-compatible in-memory implementation.
import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteProject, listProjects, saveProject } from './projects.ts';
test('project persistence round-trips, updates, rejects invalid data and deletes',async()=>{
 const project={version:3,id:'persist-test',name:'Saved',updated:'2026-11-09',sources:[{id:'doc',title:'API',text:'Chave de autenticação.'}],questions:[{id:'q',query:'chave',expected:['doc']}],a:{size:12,overlap:0,topK:1},b:{size:32,overlap:4,topK:2}};
 await saveProject(project);assert.deepEqual((await listProjects()).find(p=>p.id===project.id),project);
 await saveProject({...project,name:'Updated'});assert.equal((await listProjects()).find(p=>p.id===project.id)?.name,'Updated');
 await assert.rejects(()=>saveProject({...project,questions:[]}));assert.equal((await listProjects()).find(p=>p.id===project.id)?.name,'Updated');
 await deleteProject(project.id);assert.equal((await listProjects()).some(p=>p.id===project.id),false);
});

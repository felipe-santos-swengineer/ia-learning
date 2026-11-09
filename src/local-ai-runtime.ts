import { WebWorkerMLCEngine, prebuiltAppConfig, deleteModelAllInfoInCache } from '@mlc-ai/web-llm';
import { abortable, buildChatRequest, MODEL_F16, MODEL_F32 } from './chat-policy.ts';
import { consumeChatStream, responseTokenLimit } from './chat-stream.ts';
export function createEngineSession(engine:Pick<WebWorkerMLCEngine,'reload'|'resetChat'|'chat'>,model:string,onWarmup:()=>void){return {
 async load(signal:AbortSignal){await abortable(engine.reload(model,{context_window_size:4096}),signal);onWarmup();const result=await consumeChatStream(engine.chat.completions.create({messages:buildChatRequest([],'Oi'),stream:true,max_tokens:8,temperature:0}),signal,()=>{});await abortable(engine.resetChat(),signal);return result.timing.totalMs;},
 async generate(messages:ReturnType<typeof buildChatRequest>,onText:(text:string)=>void,signal:AbortSignal){return consumeChatStream(engine.chat.completions.create({messages,stream:true,max_tokens:responseTokenLimit(messages.at(-1)!.content),temperature:.5}),signal,onText);},
};}
export function createLocalRuntime(model:string,onProgress:(progress:number,text:string)=>void,onFailure:(error:Error)=>void){
 const record=prebuiltAppConfig.model_list.find(m=>m.model_id===model);if(!record)throw new Error('Modelo não encontrado.');
 const worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
 worker.onerror=event=>onFailure(new Error(event.message||'O worker da IA foi interrompido.'));
 const engine=new WebWorkerMLCEngine(worker,{appConfig:{model_list:[record],cacheBackend:'cache'},logLevel:'ERROR',initProgressCallback:report=>onProgress(Math.max(0,Math.min(.95,report.progress*.95)),report.text)});
 // Let WebLLM reuse matching KV cache; changed histories are reset by the SDK.
 const session=createEngineSession(engine,model,()=>onProgress(.97,'Arquivos carregados. Preparando a GPU e testando a primeira geração…'));
 return {...session,interrupt:()=>engine.interruptGenerate(),dispose:()=>{worker.onerror=null;worker.terminate();}};
}
export async function removeModelCache(){for(const model of [MODEL_F16,MODEL_F32])await deleteModelAllInfoInCache(model,prebuiltAppConfig);}

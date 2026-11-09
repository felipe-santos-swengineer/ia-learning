import { WebWorkerMLCEngine, prebuiltAppConfig, deleteModelAllInfoInCache } from '@mlc-ai/web-llm';
import { abortable, MODEL_F16, MODEL_F32 } from './chat-policy';
import type { buildChatRequest } from './chat-policy';
export function createLocalRuntime(model:string,onProgress:(progress:number,text:string)=>void,onFailure:(error:Error)=>void){
 const record=prebuiltAppConfig.model_list.find(m=>m.model_id===model);if(!record)throw new Error('Modelo não encontrado.');
 const worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
 worker.onerror=event=>onFailure(new Error(event.message||'O worker da IA foi interrompido.'));
 const engine=new WebWorkerMLCEngine(worker,{appConfig:{model_list:[record],cacheBackend:'cache'},logLevel:'ERROR',initProgressCallback:report=>onProgress(Math.max(0,Math.min(1,report.progress)),report.text)});
 return {load:(signal:AbortSignal)=>abortable(engine.reload(model,{context_window_size:4096}),signal),async generate(messages:ReturnType<typeof buildChatRequest>,onText:(text:string)=>void,signal:AbortSignal){await abortable(engine.resetChat(),signal);const stream=await abortable(engine.chat.completions.create({messages,stream:true,max_tokens:320,temperature:.6,repetition_penalty:1.1}),signal);let text='';let limited=false;const iterator=stream[Symbol.asyncIterator]();while(true){const next=await abortable(iterator.next(),signal);if(next.done)break;text+=next.value.choices[0]?.delta.content||'';if(next.value.choices[0]?.finish_reason==='length')limited=true;onText(text);}return {text,limited};},interrupt:()=>engine.interruptGenerate(),dispose:()=>{worker.onerror=null;worker.terminate();}};
}
export async function removeModelCache(){for(const model of [MODEL_F16,MODEL_F32])await deleteModelAllInfoInCache(model,prebuiltAppConfig);}

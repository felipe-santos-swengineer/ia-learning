import { abortable } from './chat-policy.ts';
export const FIRST_TEXT_TIMEOUT_MS=30_000;
export const GENERATION_TIMEOUT_MS=60_000;
type Chunk={choices?:{delta?:{content?:string|null};finish_reason?:string|null}[]};
export type GenerationTiming={firstTextMs:number|null;totalMs:number};
export class ChatTimeoutError extends Error {phase:'first'|'stalled'|'total';constructor(phase:'first'|'stalled'|'total'){super(phase);this.phase=phase;this.name='ChatTimeoutError';}}
export function responseTokenLimit(input:string){return /^(?:oi|ol[aá]|bom dia|boa tarde|boa noite|tudo bem|obrigad[oa])(?:[!?.\s])*$/iu.test(input.trim())?48:160;}
export async function consumeChatStream(task:Promise<AsyncIterable<Chunk>>,signal:AbortSignal,onText:(text:string)=>void,limits={first:FIRST_TEXT_TIMEOUT_MS,idle:20_000,total:GENERATION_TIMEOUT_MS}){
 const started=performance.now();let firstTextMs:number|null=null;let lastTextAt=started;let lastPaint=0;let text='';let limited=false;
 async function wait<T>(promise:Promise<T>):Promise<T>{const now=performance.now();const initial=firstTextMs===null;const phaseRemaining=initial?limits.first-(now-started):limits.idle-(now-lastTextAt);const totalRemaining=limits.total-(now-started);const phase=totalRemaining<=phaseRemaining?'total':initial?'first':'stalled';const remaining=Math.min(phaseRemaining,totalRemaining);if(remaining<=0)throw new ChatTimeoutError(phase);let timer:ReturnType<typeof setTimeout>|undefined;try{return await abortable(Promise.race([promise,new Promise<T>((_,reject)=>{timer=setTimeout(()=>reject(new ChatTimeoutError(phase)),remaining);})]),signal);}finally{if(timer)clearTimeout(timer);}}
 const stream=await wait(task);const iterator=stream[Symbol.asyncIterator]();
 while(true){const next=await wait(iterator.next());if(next.done)break;const choice=next.value.choices?.[0];if(choice?.finish_reason==='length')limited=true;const delta=choice?.delta?.content||'';if(!delta)continue;text+=delta;const now=performance.now();const first=firstTextMs===null;if(first)firstTextMs=now-started;lastTextAt=now;if(first||now-lastPaint>=60){onText(text);lastPaint=now;}}
 if(text)onText(text);return {text,limited,timing:{firstTextMs,totalMs:performance.now()-started}};
}

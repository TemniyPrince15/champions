import { NextResponse } from 'next/server';
import { programs } from '@/data/universities';
import { calculateJourney } from '@/engine/journeyEngine';
import type { Profile } from '@/engine/types';

const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
const apiKey = process.env.OPENAI_API_KEY?.trim();

function fallback(profile: Profile, mode: string, message = '') {
  const journey = calculateJourney(profile);
  const top = journey.recommendations.slice(0, 5);
  const base = {
    mode,
    local: true,
    recommendations: top.map(p => ({ id:p.id, university:p.university, program:p.program, fit:p.fit, reason:p.wins.slice(0,2).join(' · ') })),
    actions: journey.roadmap.slice(0,3).map(x => x.title)
  };
  if (mode === 'chat') return { ...base, summary: message ? `Based on your profile, ${top[0] ? `${top[0].university} is currently one of your stronger matches (${top[0].fit} Pathly Fit).` : 'I do not have enough matching programs yet.'} Your biggest visible constraints are ${journey.risks.slice(0,2).join(' and ').toLowerCase() || 'the current requirements of each program'}. I can also compare a specific university if you name it.` : 'Tell me what you want to know about your route, a university, requirements, funding or your next step.' };
  return { ...base, summary:`Your profile is strongest around ${profile.major}. I would focus first on the highest-fit programs that also make sense for your budget and funding goal.` };
}

function outputText(data:any){
  if(typeof data?.output_text === 'string') return data.output_text;
  const chunks = data?.output?.flatMap((x:any)=>x?.content||[]) || [];
  return chunks.filter((x:any)=>typeof x?.text==='string').map((x:any)=>x.text).join('\n');
}

function parseJson(text:string){
  try{return JSON.parse(text)}catch{
    const cleaned=text.replace(/^```json\s*/i,'').replace(/```\s*$/,'').trim();
    try{return JSON.parse(cleaned)}catch{}
    const match=cleaned.match(/\{[\s\S]*\}/);
    if(match) try{return JSON.parse(match[0])}catch{}
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(apiKey),
    model,
    hint: apiKey ? 'Server key is visible to Next.js.' : 'Create .env.local in the project root, set OPENAI_API_KEY=sk-..., and restart Next.js.'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = String(body?.mode || 'analysis');
    const profile = body?.profile as Profile;
    const message = String(body?.message || '').trim();
    const shortlist = Array.isArray(body?.recommendations) ? body.recommendations : calculateJourney(profile).recommendations.slice(0,8).map(p=>({id:p.id,university:p.university,program:p.program,fit:p.fit,tuition:p.tuition.value,ielts:p.ielts.value,sat:p.sat.value,gpa:p.gpa.value,scholarship:p.scholarship.value,deadline:p.deadline.value,country:p.country,description:p.description}));

    if(!apiKey) return NextResponse.json({...fallback(profile, mode, message), errorCode:'MISSING_OPENAI_API_KEY', errorMessage:'OPENAI_API_KEY is not available to the Next.js server. Put it in .env.local at the project root and restart the dev server.'});

    const catalog = programs.map(p=>({id:p.id,university:p.university,country:p.country,city:p.city,program:p.program,description:p.description,tuition:p.tuition.value,gpa:p.gpa.value,ielts:p.ielts.value,sat:p.sat.value,scholarship:p.scholarship.value,deadline:p.deadline.value}));
    const system = `You are Pathly AI, an admissions planning assistant. Analyze only the supplied student profile and university records. Never invent requirements, deadlines, scholarships, photos, or facts. Recommendations must use only supplied program IDs. Be concise, practical and explain trade-offs. If a fact is marked demo, tell the user to verify it on the official university site. Return ONLY valid JSON with keys summary (string), actions (array of strings), recommendations (array of objects with id, university, program, reason).`;
    const user = JSON.stringify({profile, currentMatches:shortlist, catalog, question:message || 'Analyze this route and suggest the most relevant universities.'});
    const response = await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body:JSON.stringify({
        model,
        input:[
          {role:'system',content:[{type:'input_text',text:system}]},
          {role:'user',content:[{type:'input_text',text:user}]}
        ],
        max_output_tokens:900
      })
    });

    if(!response.ok){
      const detail=await response.text();
      console.error('OpenAI API error',response.status,detail);
      return NextResponse.json({mode,local:false,provider:'openai',summary:'OpenAI could not complete this request.',actions:[],recommendations:[],errorCode:'OPENAI_HTTP_ERROR',errorMessage:`OpenAI returned HTTP ${response.status}. Check the API key, project billing/access, and OPENAI_MODEL.`,providerStatus:response.status},{status:502});
    }
    const data=await response.json();
    const raw=outputText(data);
    const parsed=parseJson(raw);
    if(!parsed){
      console.error('OpenAI response could not be parsed:',raw);
      return NextResponse.json({mode,local:false,provider:'openai',summary:'OpenAI returned an unexpected response format.',actions:[],recommendations:[],errorCode:'OPENAI_PARSE_ERROR',errorMessage:'OpenAI responded, but Pathly could not parse the JSON response.'},{status:502});
    }
    return NextResponse.json({mode,local:false,summary:String(parsed.summary||''),actions:Array.isArray(parsed.actions)?parsed.actions.slice(0,5):[],recommendations:Array.isArray(parsed.recommendations)?parsed.recommendations.slice(0,5):[]});
  } catch (error) {
    console.error('Pathly AI route error',error);
    return NextResponse.json({summary:'Pathly AI could not complete the request right now.',actions:[],recommendations:[],local:false,provider:'openai',errorCode:'SERVER_ERROR',errorMessage:'Check the terminal running Next.js for the exact server error.'},{status:500});
  }
}

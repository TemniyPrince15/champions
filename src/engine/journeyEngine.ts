import { programs, type UniversityProgram } from '@/data/universities';
import type { Profile, ScoredProgram, Journey, Factor, Task, DeadlineStatus } from './types';

const level = (score:number):Factor['level'] => score>=.9?'Excellent':score>=.75?'Strong':score>=.6?'Good':score>=.45?'Moderate':'Limited';
const currency = (n:number|null) => n==null?'Flexible':`$${n.toLocaleString()}`;
const today = new Date('2026-09-16T12:00:00Z');
export const getDeadlineStatus = (iso?:string):DeadlineStatus => { if(!iso) return 'unknown'; const d=new Date(`${iso}T23:59:59Z`); return d.getTime() < today.getTime() ? 'passed' : 'upcoming'; };

function budgetFit(profile:Profile,p:UniversityProgram){
 const tuition=Number(p.tuition.value); if(profile.fullyFunded) return String(p.scholarship.value).toLowerCase().includes('full')?1:.55;
 if(profile.budget==null) return .65; return tuition<=profile.budget?1:Math.max(.1,1-(tuition-profile.budget)/Math.max(profile.budget,1));
}

function scoreProgram(profile:Profile,p:UniversityProgram):ScoredProgram{
 const academic=Math.min(1,profile.gpa/Math.max(Number(p.gpa.value),4));
 const major=/computer|software|data|artificial|engineering|science/i.test(p.program)&&new RegExp(profile.major.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(p.program)?1:/computer|software|data|artificial|engineering|science/i.test(p.program)&&/computer|software|data|ai|engineering|physics/i.test(profile.major)?0.82:.5;
 const budget=budgetFit(profile,p);
 const country=profile.preferredCountries.length===0?.7:profile.preferredCountries.includes(p.country)?1:.35;
 const test=Math.min(1,profile.ielts/Math.max(Number(p.ielts.value),7));
 const sat=typeof p.sat.value==='number'?Math.min(1,profile.sat/Math.max(Number(p.sat.value),1500)):1;
 const scholarship=String(p.scholarship.value).toLowerCase().includes('full')?1:.6;
 const fit=Math.round((academic*.2+major*.24+budget*.22+country*.1+test*.1+sat*.06+scholarship*.08)*100);
 const factors:Factor[]=[
  {label:'Academic',level:level(academic),reason:`GPA ${profile.gpa} vs ${p.gpa.value} profile baseline.`},
  {label:'Major',level:level(major),reason:`${profile.major} compared with ${p.program}.`},
  {label:'Financial',level:level(budget),reason:profile.fullyFunded?'Funding is a primary constraint.':`Budget ${currency(profile.budget)} vs tuition ${currency(Number(p.tuition.value))}.`},
  {label:'Location',level:level(country),reason:profile.preferredCountries.includes(p.country)?`${p.country} is in your preferred list.`:'Outside your current preferred-country list.'},
  {label:'Tests',level:level((test+sat)/2),reason:`IELTS ${profile.ielts}; SAT ${profile.sat}.`},
  {label:'Funding',level:level(scholarship),reason:`Funding signal: ${p.scholarship.value}.`}
 ];
 const gaps:string[]=[],wins:string[]=[];
 if(profile.ielts<Number(p.ielts.value)) gaps.push(`IELTS +${(Number(p.ielts.value)-profile.ielts).toFixed(1)}`); else wins.push('IELTS target aligned');
 if(typeof p.sat.value==='number'&&profile.sat<Number(p.sat.value)) gaps.push(`SAT +${Math.round(Number(p.sat.value)-profile.sat)}`); else wins.push('SAT optional or aligned');
 if(budget<.75) gaps.push('Funding gap'); else wins.push('Financial fit');
 const dStatus=getDeadlineStatus(p.deadline.iso);
 if(dStatus==='passed') gaps.push('Deadline appears passed for the current cycle');
 const hardBlock=!Boolean(p.international.value)||dStatus==='passed';
 let tier:ScoredProgram['tier']='Discovery';
 if(hardBlock) tier='Ambitious'; else if(profile.fullyFunded&&scholarship>=.9) tier='Financial Match'; else if(fit>=82) tier='Strong Match'; else if(fit<=58) tier='Safer Fit';
 return {...p,fit,tier,factors,gaps,wins,hardBlock,deadlineStatus:dStatus};
}

export function calculateJourney(profile:Profile,previousProfile?:Profile):Journey{
 const scored=programs.map(p=>scoreProgram(profile,p)).filter(p=>!p.hardBlock).sort((a,b)=>b.fit-a.fit);
 const recommendations=scored.slice(0,10);
 const risks:string[]=[];
 if(profile.ielts<7) risks.push('English score limits part of the shortlist.');
 if(profile.fullyFunded||((profile.budget??999999)<15000)) risks.push('Funding is a major constraint.');
 if(profile.sat<1400) risks.push('A stronger SAT may unlock more ambitious options.');
 if(!profile.preferredCountries.length) risks.push('Country preference is broad.');
 const scholarships=recommendations.filter(r=>String(r.scholarship.value).toLowerCase().includes('full')).map(r=>`${r.university} — ${r.scholarship.value}`);
 const deadlines=recommendations.slice(0,6).map(r=>`${r.university}: ${r.deadline.value}`);
 const roadmap:Task[]=[
  {id:'lang',title:profile.ielts<7?'Book an IELTS diagnostic / test date':'Verify your English test result',why:'Language readiness affects several programs.',priority:'High',due:'Within 7 days',status:'todo'},
  {id:'sat',title:profile.sat<1400?'Start a SAT improvement sprint':'Confirm SAT score reporting plan',why:'A stronger test position can unlock more programs.',priority:'High',due:'Within 14 days',status:'todo'},
  {id:'docs',title:'Build your application document pack',why:'Prepare transcripts, passport, CV and references.',priority:'Medium',due:'Within 21 days',status:'todo'},
  {id:'scholarship',title:profile.fullyFunded?'Shortlist full-funding opportunities':'Review scholarship options',why:'Funding strategy is linked to your stated goal.',priority:'High',due:'Within 30 days',status:'todo'},
  {id:'essay',title:'Draft a personal statement outline',why:'Connect goals, evidence and academic direction.',priority:'Medium',due:'Within 35 days',status:'todo'}
 ];
 const nextAction=roadmap.find(t=>t.status==='todo')??null;
 const profileImpact=previousProfile?[previousProfile.budget!==profile.budget||previousProfile.fullyFunded!==profile.fullyFunded?'Budget/funding changed → financial fit recalculated.':'',previousProfile.ielts!==profile.ielts?'IELTS changed → test readiness recalculated.':'',previousProfile.sat!==profile.sat?'SAT changed → test readiness recalculated.':'',JSON.stringify(previousProfile.preferredCountries)!==JSON.stringify(profile.preferredCountries)?'Countries changed → recommendation mix recalculated.':'',previousProfile.major!==profile.major?'Major changed → program alignment recalculated.':''].filter(Boolean):[];
 const diagnosis={headline:profile.major?`You are targeting ${profile.major} programmes.`:'Define your academic direction.',strengths:[profile.gpa>=4?'Strong academic profile':'Competitive academic profile',profile.ielts>=7?'Strong English readiness':'English can improve shortlist breadth',profile.fullyFunded?'Clear funding priority':'Flexible budget strategy'],constraints:risks.slice(0,3),goal:profile.goal};
 return {diagnosis,recommendations,risks,scholarships,deadlines,roadmap,nextAction,profileImpact};
}

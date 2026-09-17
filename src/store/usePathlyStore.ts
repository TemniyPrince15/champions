'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Journey } from '@/engine/types';
import { calculateJourney } from '@/engine/journeyEngine';

export const goldenProfile:Profile={age:17,country:'Kazakhstan',grade:'Grade 11',major:'Computer Science',interests:['AI','Software','Engineering'],gpa:4.4,ielts:6.5,sat:1400,budget:10000,fullyFunded:true,preferredCountries:['China','Germany','Netherlands','Singapore'],targetYear:2027,goal:'fully-funded',degree:'Bachelor',targetIntake:'Fall 2027',portfolio:'Strong school projects',activities:['Programming club','Volunteering'],achievements:['Physics competitions','School programming project']};

type State={profile:Profile;previousProfile?:Profile;journey:Journey;selected:string[];setProfile:(patch:Partial<Profile>)=>void;recalculate:()=>void;resetDemo:()=>void;completeTask:(id:string)=>void;toggleSelected:(id:string)=>void};
export const usePathlyStore=create<State>()(persist((set,get)=>({
 profile:goldenProfile,previousProfile:undefined,journey:calculateJourney(goldenProfile),selected:[],
 setProfile:(patch)=>set(s=>({profile:{...s.profile,...patch}})),
 recalculate:()=>set(s=>({journey:calculateJourney(s.profile,s.previousProfile),previousProfile:s.profile})),
 resetDemo:()=>set({profile:goldenProfile,previousProfile:undefined,journey:calculateJourney(goldenProfile),selected:[]}),
 completeTask:(id)=>set(s=>{const roadmap=s.journey.roadmap.map(t=>t.id===id?{...t,status:t.status==='done'?'todo':'done'}:t);return{journey:{...s.journey,roadmap,nextAction:roadmap.find(t=>t.status==='todo')??null}}}),
 toggleSelected:(id)=>set(s=>({selected:s.selected.includes(id)?s.selected.filter(x=>x!==id):s.selected.length<3?[...s.selected,id]:s.selected}))
}),{name:'pathly-state-v3'}));

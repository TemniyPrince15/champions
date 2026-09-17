import type { UniversityProgram } from '@/data/universities';

export type Profile = {
  age: number; country: string; grade: string; major: string; interests: string[]; gpa: number; ielts: number; sat: number;
  budget: number | null; fullyFunded: boolean; preferredCountries: string[]; targetYear: number; goal: 'fully-funded'|'top-academic'|'study-abroad'|'career';
  degree: 'Bachelor'|'Master'; targetIntake: string; portfolio: string; activities: string[]; achievements: string[];
};
export type Factor = { label: string; level: 'Excellent'|'Strong'|'Good'|'Moderate'|'Limited'; reason: string };
export type DeadlineStatus = 'upcoming'|'passed'|'unknown';
export type ScoredProgram = UniversityProgram & { fit:number; tier:'Strong Match'|'Financial Match'|'Ambitious'|'Safer Fit'|'Discovery'; factors:Factor[]; gaps:string[]; wins:string[]; hardBlock:boolean; deadlineStatus:DeadlineStatus };
export type Task = { id:string; title:string; why:string; priority:'High'|'Medium'|'Low'; due:string; status:'todo'|'done'; source?:string };
export type Journey = { diagnosis:any; recommendations:ScoredProgram[]; risks:string[]; scholarships:string[]; deadlines:string[]; roadmap:Task[]; nextAction:Task|null; profileImpact:string[] };

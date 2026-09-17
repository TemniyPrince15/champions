import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams.get('q')?.trim()||'';
 const country=req.nextUrl.searchParams.get('country')?.trim()||'';
 if(!q && !country) return NextResponse.json({items:[]});
 const url=new URL('https://universities.hipolabs.com/search');
 if(q) url.searchParams.set('name',q);
 if(country) url.searchParams.set('country',country);
 try{
  const res=await fetch(url.toString(),{next:{revalidate:3600},headers:{accept:'application/json'}});
  if(!res.ok) return NextResponse.json({items:[],error:'Directory temporarily unavailable'},{status:502});
  const raw=await res.json();
  const items=(Array.isArray(raw)?raw:[]).slice(0,60).map((u:any)=>({
   source:'global-directory',name:u.name,country:u.country||'Unknown',alpha2:u.alpha_two_code||'',domains:u.domains||[],webPages:u.web_pages||[]
  }));
  return NextResponse.json({items});
 }catch{return NextResponse.json({items:[],error:'Global directory unavailable offline'},{status:502});}
}

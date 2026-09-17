import { NextResponse } from 'next/server';

function initials(name:string){
  return name.split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase();
}

function placeholder(name:string){
  const text=initials(name).replace(/&/g,'&amp;');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#13212a"/><stop offset="1" stop-color="#31596a"/></linearGradient></defs><rect width="1200" height="700" fill="url(#g)"/><circle cx="950" cy="130" r="220" fill="#93f3c5" opacity=".12"/><text x="80" y="420" fill="white" font-family="Arial,sans-serif" font-size="110" font-weight="700">${text}</text><text x="82" y="500" fill="#cfe0e8" font-family="Arial,sans-serif" font-size="28">Campus image unavailable</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

async function wikiImage(name:string){
  const q=encodeURIComponent(`${name} university`);
  const url=`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=0&gsrlimit=5&prop=pageimages&pithumbsize=1200&format=json&origin=*`;
  const r=await fetch(url,{headers:{'User-Agent':'Pathly/1.0 university image resolver'},next:{revalidate:86400}});
  if(!r.ok) return null;
  const data=await r.json();
  const pages=Object.values(data?.query?.pages||{}) as any[];
  const exact=pages.find(p=>String(p.title||'').toLowerCase().includes(name.toLowerCase()));
  return (exact||pages.find(p=>p.thumbnail?.source))?.thumbnail?.source || null;
}

export async function GET(req:Request){
  const name=new URL(req.url).searchParams.get('name')?.trim()||'University';
  try{
    const image=await wikiImage(name);
    return NextResponse.json({name,url:image||placeholder(name),source:image?'Wikimedia/Wikipedia':'Pathly placeholder'});
  }catch{
    return NextResponse.json({name,url:placeholder(name),source:'Pathly placeholder'});
  }
}

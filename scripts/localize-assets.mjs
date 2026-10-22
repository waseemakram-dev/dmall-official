import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const file=path.resolve('app/reference.json');
const data=JSON.parse(await fs.readFile(file,'utf8'));
const $=cheerio.load(data.hero,null,false);
await fs.mkdir('public/assets',{recursive:true});
const urls=new Set();
$('img').each((_,el)=>{const src=$(el).attr('src');if(src?.startsWith('https://framerusercontent.com/')) urls.add(src);});
$('video').each((_,el)=>{const src=$(el).attr('src');if(src) urls.add(src);});
const map=new Map();
await Promise.all([...urls].map(async(url)=>{
  const name=path.basename(new URL(url).pathname);
  const local='/assets/'+name;
  const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
  if(!response.ok) throw new Error(`${response.status}: ${name}`);
  await fs.writeFile('public'+local,Buffer.from(await response.arrayBuffer()));
  map.set(url,local);
}));
$('img').each((_,el)=>{const src=$(el).attr('src');if(map.has(src)){ $(el).attr('src',map.get(src)).removeAttr('srcset').removeAttr('sizes'); }});
$('video').each((_,el)=>{const src=$(el).attr('src');if(map.has(src)) $(el).attr('src',map.get(src));});
data.hero=$.html();
await fs.writeFile(file,JSON.stringify(data));
for(const [source,target] of [['hG3wmGmFwadB6X5XPVXkMlmLr8o.woff2','open-runde-semibold.woff2'],['3exmuO07FP19gMM08TQrpXl3BGQ.woff2','open-runde-regular.woff2']]){
 const response=await fetch('https://framerusercontent.com/assets/'+source);
 if(!response.ok)throw new Error('Font download failed');
 await fs.writeFile('public/assets/'+target,Buffer.from(await response.arrayBuffer()));
}
let css=await fs.readFile('app/reference.css','utf8');
css=css.replaceAll('https://framerusercontent.com/assets/hG3wmGmFwadB6X5XPVXkMlmLr8o.woff2','/assets/open-runde-semibold.woff2').replaceAll('https://framerusercontent.com/assets/3exmuO07FP19gMM08TQrpXl3BGQ.woff2','/assets/open-runde-regular.woff2');
await fs.writeFile('app/reference.css',css);
console.log(`Saved ${map.size} original image/video assets and both reference fonts locally.`);

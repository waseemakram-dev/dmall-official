import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const section=$('[data-framer-name="Section/Problem"]').first();
if(!section.length)throw new Error('Reference problem section missing');
section.attr('id','problem');
section.find('script').remove();
section.find('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{}))if(/^on/i.test(key))$(el).removeAttr(key);});
const media=section.find('video').toArray();
await Promise.all(media.map(async(el)=>{
  const source=$(el).attr('src');
  const name=path.basename(new URL(source).pathname);
  const destination=path.join('public/assets',name);
  let exists=false;
  try { exists=(await fs.stat(destination)).size>0; } catch {}
  if(!exists){
    const response=await fetch(source,{signal:AbortSignal.timeout(60000)});
    if(!response.ok)throw new Error(`${response.status}: ${name}`);
    await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
  }
  $(el).attr('src','/assets/'+name).attr('aria-hidden','true').attr('tabindex','-1');
}));
await fs.writeFile('app/problem-reference.json',JSON.stringify({html:$.html(section)}));
let readme=await fs.readFile('README.md','utf8');
readme=readme.replace('The hero and the following “Unlock a free preview” section are implemented.','The hero, “Unlock a free preview”, and “Still trading time for money?” sections are implemented.');
readme+='\nThe problem section retains the original three-card layout, responsive styles and three looping background videos. Videos play when visible and pause when offscreen or reduced motion is enabled.\n';
await fs.writeFile('README.md',readme);
console.log(`Problem section extracted with ${media.length} original local videos.`);

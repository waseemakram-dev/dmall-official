import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const section=$('[data-framer-name="Section/Solution"]').first();
if(!section.length)throw new Error('Reference solution section missing');
section.attr('id','solution');
section.find('script').remove();
section.find('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{}))if(/^on/i.test(key))$(el).removeAttr(key);});
const media=section.find('video').toArray();
await Promise.all(media.map(async(el)=>{
  const source=$(el).attr('src');
  const name=path.basename(new URL(source).pathname);
  const destination=path.join('public/assets',name);
  let exists=false;
  try {exists=(await fs.stat(destination)).size>0;}catch{}
  if(!exists){
    const response=await fetch(source,{signal:AbortSignal.timeout(60000)});
    if(!response.ok)throw new Error(`${response.status}: ${name}`);
    await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
  }
  $(el).attr('src','/assets/'+name).attr('aria-hidden','true').attr('tabindex','-1');
}));
await fs.writeFile('app/solution-reference.json',JSON.stringify({html:$.html(section)}));
await fs.appendFile('README.md','\nThe “Instead, build assets that earn” solution section is implemented with the original responsive markup, typography, three-card composition and original local videos. Live visual comparison remains pending.\n');
console.log(`Solution section extracted with ${media.length} original local videos.`);

import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const section=$('[data-framer-name="Section/Users"]').first();
if(!section.length||!section.text().includes('Burnt out'))throw new Error('Audience section missing');
section.attr('id','is-this-you');
section.find('script').remove();
section.find('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{}))if(/^on/i.test(key))$(el).removeAttr(key);});
await Promise.all(section.find('video').toArray().map(async(el)=>{
  const src=$(el).attr('src');
  const name=path.basename(new URL(src).pathname);
  const destination='public/assets/'+name;
  let exists=false;try{exists=(await fs.stat(destination)).size>0;}catch{}
  if(!exists){
    const response=await fetch(src,{signal:AbortSignal.timeout(60000)});
    if(!response.ok)throw new Error(`${response.status}: ${name}`);
    await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
  }
  $(el).attr('src','/assets/'+name).attr('aria-hidden','true').attr('tabindex','-1');
}));
await fs.writeFile('app/audience-reference.json',JSON.stringify({html:$.html(section)}));
await fs.appendFile('README.md','\nThe first audience bento (“Burnt out from the rat race”) is implemented using original markup, inline video, SVG icons and message cards. The purple custom cursor uses the exact path and gradient recovered from the reference runtime; it is enabled only for fine mouse pointers and cleans up on unmount. Message entrance timing is recreated and awaits visual comparison.\n');
console.log('Audience section extracted with original local video and graphic markup.');

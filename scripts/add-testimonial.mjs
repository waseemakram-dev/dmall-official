import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const section=$('[data-framer-name="Section/Testimonial"]').first();
if(!section.length)throw new Error('Reference testimonial section missing');
section.attr('id','testimonials');
section.find('script').remove();
section.find('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{}))if(/^on/i.test(key))$(el).removeAttr(key);});
const urls=[...new Set(section.find('img').map((_,el)=>$(el).attr('src')).get())];
const assets=new Map();
await Promise.all(urls.map(async(url)=>{
  const name=path.basename(new URL(url).pathname);
  const destination=path.join('public/assets',name);
  let exists=false;try{exists=(await fs.stat(destination)).size>0;}catch{}
  if(!exists){
    const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
    if(!response.ok)throw new Error(`${response.status}: ${name}`);
    await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
  }
  assets.set(url,'/assets/'+name);
}));
section.find('img').each((_,el)=>{$(el).attr('src',assets.get($(el).attr('src'))).removeAttr('srcset').removeAttr('sizes');});
await fs.writeFile('app/testimonial-reference.json',JSON.stringify({html:$.html(section)}));
await fs.appendFile('README.md','\nThe first testimonial carousel is implemented with all four original quotes, profile photos, stars and responsive markup. It supports automatic rotation, swipe, keyboard navigation and the reference mobile dots. Autoplay pauses while hovered, focused or offscreen; reduced motion disables autoplay. Exact transition timing remains pending live comparison.\n');
console.log(`Testimonial section extracted; ${urls.length} original images localized.`);

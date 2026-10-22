import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const sections=[{key:'instructor',name:'Section/Instructor'},{key:'blog',name:'Section/Blog'}];
const assets=new Map();
for(const item of sections){
  item.section=$(`[data-framer-name="${item.name}"]`).first();
  if(!item.section.length)throw new Error(`Missing ${item.name}`);
  item.section.attr('id',item.key).find('script').remove();
  item.section.find('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{}))if(/^on/i.test(key))$(el).removeAttr(key);});
  item.section.find('img,video').each((_,el)=>{const src=$(el).attr('src');if(src?.startsWith('https://'))assets.set(src,path.basename(new URL(src).pathname));});
}
await Promise.all([...assets].map(async([url,name])=>{
  const destination='public/assets/'+name;
  try{if((await fs.stat(destination)).size>0)return;}catch{}
  const response=await fetch(url,{signal:AbortSignal.timeout(90000)});
  if(!response.ok)throw new Error(`${response.status}: ${name}`);
  await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
}));
for(const {key,section} of sections){
  section.find('img,video').each((_,el)=>{
    const src=$(el).attr('src');
    if(assets.has(src))$(el).attr('src','/assets/'+assets.get(src)).removeAttr('srcset').removeAttr('sizes');
  });
  section.find('a[href]').each((_,el)=>{const href=$(el).attr('href');if(href?.startsWith('./'))$(el).attr('href',new URL(href,'https://monetize.framer.media/').href);});
  await fs.writeFile(`app/${key}-reference.json`,JSON.stringify({html:$.html(section)}));
}
const reference=JSON.parse(await fs.readFile('app/reference.json','utf8'));
reference.navigation=reference.navigation.replaceAll('https://monetize.framer.media/#instructor','#instructor').replaceAll('href="https://monetize.framer.media/blog"','href="#blog"');
await fs.writeFile('app/reference.json',JSON.stringify(reference));
await fs.appendFile('README.md','\nInstructor and Blog sections are implemented using original responsive markup, copy and local media assets. Header Instructor/Blog links now scroll locally; article and View all links open their original reference pages. Instructor video plays only when visible and respects reduced motion.\n');
console.log(`Added Instructor and Blog; localized ${assets.size} original media assets.`);

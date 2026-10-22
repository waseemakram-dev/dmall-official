import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const source=$('[data-framer-name="Section/Users"]');
const sections=[{key:'freedom',section:source.eq(1)},{key:'curriculum',section:source.eq(2)}];
for(const {key,section} of sections){
  if(!section.length)throw new Error(`Missing ${key} section`);
  section.attr('id',key);
  section.find('script').remove();
  section.find('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{}))if(/^on/i.test(key))$(el).removeAttr(key);});
}
const assets=new Map();
for(const {section} of sections)section.find('video,img').each((_,el)=>{const src=$(el).attr('src');if(src?.startsWith('https://'))assets.set(src,path.basename(new URL(src).pathname));});
await Promise.all([...assets].map(async([url,name])=>{
  const destination=path.join('public/assets',name);
  try{if((await fs.stat(destination)).size>0)return;}catch{}
  const response=await fetch(url,{signal:AbortSignal.timeout(90000)});
  if(!response.ok)throw new Error(`${response.status}: ${name}`);
  await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
}));
for(const {key,section} of sections){
  section.find('video,img').each((_,el)=>{
    const src=$(el).attr('src');
    if(assets.has(src))$(el).attr('src','/assets/'+assets.get(src)).removeAttr('srcset').removeAttr('sizes');
    if(el.tagName==='video')$(el).attr('aria-hidden','true').attr('tabindex','-1');
  });
  await fs.writeFile(`app/${key}-reference.json`,JSON.stringify({html:$.html(section)}));
}
await fs.appendFile('README.md','\nThe second audience bento (“For anyone who wants freedom”) and the four-module Curriculum carousel are implemented with original markup, fonts, graphics, local video and image assets. Curriculum supports next/previous, keyboard and swipe. Decorative videos play only while visible. Exact motion timing and visual equality remain pending live browser comparison.\n');
console.log(`Added freedom and curriculum sections; checked ${assets.size} original assets.`);

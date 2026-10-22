import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const sections=[
  {key:'case-studies',name:'Section/Case Study'},
  {key:'pricing',name:'Section/Pricing'},
];
for(const {key,name} of sections){
  const section=$(`[data-framer-name="${name}"]`).first();
  if(!section.length)throw new Error(`Missing ${name}`);
  section.attr('id',key);
  section.find('script').remove();
  section.find('*').each((_,el)=>{for(const attr of Object.keys(el.attribs||{}))if(/^on/i.test(attr))$(el).removeAttr(attr);});
  await Promise.all(section.find('img').toArray().map(async(el)=>{
    const src=$(el).attr('src');
    const filename=path.basename(new URL(src).pathname);
    const destination=path.join('public/assets',filename);
    let exists=false;try{exists=(await fs.stat(destination)).size>0;}catch{}
    if(!exists){
      const response=await fetch(src,{signal:AbortSignal.timeout(60000)});
      if(!response.ok)throw new Error(`${response.status}: ${filename}`);
      await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
    }
    $(el).attr('src','/assets/'+filename).removeAttr('srcset').removeAttr('sizes');
  }));
  section.find('a[target="_blank"]').attr('rel','noopener noreferrer');
  await fs.writeFile(`app/${key}-reference.json`,JSON.stringify({html:$.html(section)}));
}
const reference=JSON.parse(await fs.readFile('app/reference.json','utf8'));
reference.navigation=reference.navigation.replaceAll('https://monetize.framer.media/#pricing','#pricing');
await fs.writeFile('app/reference.json',JSON.stringify(reference));
await fs.appendFile('README.md','\nCase Studies and Pricing are implemented with the original alternating photo/text rows, original case-study copy and metrics, both original pricing plans and their CTA destinations. Case-study photos are local assets; the header Pricing link now scrolls to the local section. Content remains reference-template content, not verified Dmall business claims. No checkout or payment processing is added.\n');
console.log('Added Case Studies and Pricing with localized photos and local pricing navigation.');

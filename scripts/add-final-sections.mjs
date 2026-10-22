import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
const $=cheerio.load(await fs.readFile(path.resolve('../../work/monetize-source.html'),'utf8'));
const runtime=await fs.readFile(path.resolve('../../work/monetize-page.mjs'),'utf8');
const keys=['lvMeUTpra','nNR17NJf8','f6MCfUa9_','WxP8IYtCW','Bh2xSMa6o','AlJAYqzCM','REXEE9Oc3','iPWl2gc9j'];
const answers=keys.map(key=>{
  const match=runtime.match(new RegExp(key+':`([^`]+)`'));
  if(!match)throw new Error(`Missing original answer ${key}`);
  return match[1];
});
const faq=$('[data-framer-name="Section/Contact"]').first();
const closing=$('[data-framer-name="Section/Testimonials"]').first();
const footer=$('footer').first().parent().parent();
if(!faq.length||!closing.length||footer.find('footer').length!==3)throw new Error('Missing final sections');
faq.attr('id','faqs');closing.attr('id','closing-testimonials');
faq.find('h6').each((index,el)=>{
  const question=$(el).closest('[data-framer-name="Top"]');
  const card=question.parent();
  question.attr('role','button').attr('tabindex','0').attr('aria-expanded','false').attr('aria-controls',`faq-answer-${index}`).attr('id',`faq-question-${index}`);
  const panel=$('<div>').addClass('faq-answer-wrap').attr('id',`faq-answer-${index}`).attr('role','region').attr('aria-labelledby',`faq-question-${index}`).attr('aria-hidden','true');
  const body=$('<div>').addClass('framer-189ts4c').attr('data-framer-name','Answer');
  const text=$('<div>').addClass('framer-yxkrhn').append($('<p>').addClass('framer-text framer-styles-preset-a0sxmw').text(answers[index]));
  body.append(text);panel.append(body);card.append(panel);
});
const sections=[{key:'faq',node:faq},{key:'closing-testimonials',node:closing},{key:'footer',node:footer}];
const assets=new Map();
for(const {node} of sections){
  node.find('script').remove();
  node.find('*').each((_,el)=>{for(const attr of Object.keys(el.attribs||{}))if(/^on/i.test(attr))$(el).removeAttr(attr);});
  node.find('img').each((_,el)=>{const src=$(el).attr('src');if(src?.startsWith('https://'))assets.set(src,path.basename(new URL(src).pathname));});
}
await Promise.all([...assets].map(async([url,name])=>{
  const destination='public/assets/'+name;
  try{if((await fs.stat(destination)).size>0)return;}catch{}
  const response=await fetch(url,{signal:AbortSignal.timeout(90000)});
  if(!response.ok)throw new Error(`${response.status}: ${name}`);
  await fs.writeFile(destination,Buffer.from(await response.arrayBuffer()));
}));
function localLink(href){
  if(!href)return href;
  if(href==='./'||href==='https://monetize.framer.media/')return '#';
  if(href==='./blog'||href==='https://monetize.framer.media/blog')return '#blog';
  if(href.startsWith('./#'))return href.slice(2);
  if(href.startsWith('https://monetize.framer.media/#'))return '#'+href.split('#')[1];
  return href.startsWith('./')?new URL(href,'https://monetize.framer.media/').href:href;
}
for(const {key,node} of sections){
  node.find('img').each((_,el)=>{const src=$(el).attr('src');if(assets.has(src))$(el).attr('src','/assets/'+assets.get(src)).removeAttr('srcset').removeAttr('sizes');});
  node.find('a[href]').each((_,el)=>$(el).attr('href',localLink($(el).attr('href'))));
  await fs.writeFile(`app/${key}-reference.json`,JSON.stringify({html:$.html(node)}));
}
const reference=JSON.parse(await fs.readFile('app/reference.json','utf8'));
reference.navigation=reference.navigation.replaceAll('https://monetize.framer.media/#faqs','#faqs');
await fs.writeFile('app/reference.json',JSON.stringify(reference));
await fs.appendFile('README.md','\nFAQ, closing testimonial rows, and all three responsive footer variants are implemented. All eight FAQ answers are recovered from the reference page module, including its original policy copy; these are template claims, not Dmall policies. FAQ uses keyboard-accessible expandable controls. Closing testimonial rows loop in opposing directions and pause for hover, focus, reduced motion and offscreen state. Footer section links scroll locally; external links retain their reference destinations. No publication was performed.\n');
console.log(`Added FAQ with ${answers.length} original answers, closing testimonials and responsive footer; checked ${assets.size} media assets.`);

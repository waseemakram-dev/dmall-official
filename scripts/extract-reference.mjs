import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const root = process.cwd();
const source = fs.readFileSync(path.resolve(root, '../../work/monetize-source.html'), 'utf8');
const $ = cheerio.load(source);
const section = $('[data-framer-name="Section/Hero"]').first();
if (!section.length) throw new Error('Reference hero missing');
const styles = $('style').map((_, el) => $(el).html()).get().join('\n');
const outerClass = section.parent().parent().attr('class');
const pageClass = section.parent().attr('class');
// Keep the published responsive DOM and scoped CSS; discard scripts and handlers.
section.find('script').remove();
section.find('*').each((_, el) => {
  for (const key of Object.keys(el.attribs || {})) {
    if (/^on/i.test(key)) $(el).removeAttr(key);
  }
});
const appear = JSON.parse($('#__framer__appearAnimationsContent').text());
const navigation = $('[data-framer-name="Desktop"]').filter((_, el) => $(el).find('a[href="./#pricing"]').length > 0).first();
const navContainer = navigation.parent().parent();
const shellClass = navContainer.parent().attr('class');
navContainer.find('a[href]').each((_,el)=>{const href=$(el).attr('href');if(href?.startsWith('./'))$(el).attr('href',new URL(href,'https://monetize.framer.media/').href);});
const svgDefs = '<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><defs>'+$('svg[id]').map((_,el)=>$.html(el)).get().join('\n')+'</defs></svg>';
const data = { outerClass, pageClass, shellClass, hero: $.html(section), navigation: $.html(navContainer), svgDefs, appear };
fs.mkdirSync(path.join(root, 'app'), { recursive: true });
fs.writeFileSync(path.join(root, 'app/reference.json'), JSON.stringify(data));
fs.writeFileSync(path.join(root, 'app/reference.css'), styles);
fs.writeFileSync(path.join(root, 'scripts/reference-summary.json'), JSON.stringify({outerClass,pageClass,navigationFound:!!navigation.length,navContainerClass:navContainer.attr('class'),heroElements:section.find('*').length,media:section.find('video').map((_,el)=>({src:$(el).attr('src'),style:$(el).attr('style')})).get(),slideshow:section.find('ul').map((_,el)=>({style:$(el).attr('style'),parent:$(el).parent().attr('style'),count:$(el).children().length})).get()},null,2));
console.log('Extracted reference hero, scoped styles, SVG definitions and appear configuration.');

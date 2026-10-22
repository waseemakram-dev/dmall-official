import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
const app='app',backup='../../work/monetize-content-backup';fs.mkdirSync(backup,{recursive:true});
const live=JSON.parse(fs.readFileSync('../../work/dmall-live-data.json'));
const wa='https://wa.me/923268669646';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const clean=s=>s.replace(/^[^A-Za-z]*\d*\.\s*/u,'').replace(/^[^A-Za-z]+/u,'');
const stories=live.storiesList.map((s,i)=>{const file=`dmall-result-${i+1}.webp`;fs.writeFileSync('public/assets/'+file,Buffer.from(s.image.split(',')[1],'base64'));return '/assets/'+file;});
fs.writeFileSync('app/dmall-content.json',JSON.stringify({brand:'D-Mall OFFICIAL',contact:{phone:live.contactPhone,email:live.contactEmail,address:live.contactAddress,whatsapp:wa},stats:{projects:live.statProjects,clients:live.statClients,students:live.statStudents,years:live.statExp},services:live.servicesList,training:live.trainingsList[0],stories,sources:['https://www.dmallofficial.com/','https://www.dmallofficial.com/services','https://www.dmallofficial.com/trainings','https://www.dmallofficial.com/success','https://www.dmallofficial.com/api/load.php']},null,2));
const common={
'Pricing':'Packages','Instructor':'About Dmall','Blog':'Services','Sign Up':'Contact Us','Contact':'Contact Us','Terms':'Services','404':'Success Stories','X (Twitter)':'WhatsApp','YouTube':'Call Dmall','Instagram':'Email Dmall',
'Rated excellent':'D-Mall OFFICIAL','1k+ students':'Live + recorded','Start earning online':'Explore services','Watch free training':'Explore training',
'If you’ve got a skill, this course teaches you how to package it, sell it, and create steady income on autopilot.':'Build your online business with Shopify development, digital marketing and practical e-commerce training.',
'Is this you?':'For your business','Burnt out':'Ready to','from':'grow','the rat race':'your business?',
'Are you stuck chasing the weekend, working endless hours just to stay afloat, with no time left to actually live?':'Get support with your Shopify store, advertising and online business through Dmall’s digital services and training.',
'Hey, do you need a website?':'I need a Shopify store.','I can 10x your business, let\'s have a call?':'Dmall can help with setup.','Let\'s have a call':'Let’s discuss your business.','Are you still able to join?':'Can I join the training?',
'Tired of chasing clients?':'Need a Shopify store?','Constant follow-ups, unpaid invoices, and endless revisions — it never seems to stop.':'Custom Shopify development, branding, product listings and payment setup for your business.',
"Don't want fixed hours?":'Need practical training?','Every hour is tracked, every break feels rushed, and freedom is nowhere in sight.':'45 days of live and recorded Shopify e-commerce training with personal guidance.',
'Always constantly':'Build your','money':'online','money stressed?':'online business','stressed?':'business',
'Is this what you want?':'Your growth partner','For anyone':'For brands','who':'and','who wants':'and new','wants freedom':'new founders','freedom':'founders',
'Earn whilst you sleep':'Launch your Shopify store','Your ideas keep earning — long after you’ve logged off.':'Mobile-optimized stores with branding, product listings and payment integration.',
'Make':'Start','on autopilot':'with support','Work Wherever Whenever':'Support across markets','Work on your terms, live on your time, and let your products do the rest.':'Shopify solutions for Pakistan and international markets, including UAE and KSA.',
'London':'Islamabad','Dubai':'Kohat','MON, 1:24 PM':'G-13/4','MON, 9:55 PM':'Bin-Asif Plaza','Hey, want to work at Starbucks today?':'Let’s build your online business.',
'Still trading time for money?':'Ready to grow online?','pain points':'your next step','Exhausted from long hours, unpredictable pay, and starting from zero every month?':'Shopify, advertising and training services to support your next business step.',
'You’re stuck in the cycle of selling your time — deliver a project, get paid, repeat.':'Build a custom Shopify store with a premium theme, product listings and mobile optimization.',
'Every month feels like a reset button, with no guarantee of income unless you keep showing up.':'Get help with Meta and Google Ads, TikTok business setup and search optimization.',
'Your skills are making money… just not for you, but for clients, employers, and platforms.':'Learn Shopify e-commerce through live and recorded lessons, personal guidance and team support.',
'Trapped by trading time':'Shopify development','The monthly reset struggle':'Digital marketing','Your skills, their profit':'Expert training','Freedom to choose how you work':'Shopify store setup','Earn without constant hustle':'Performance marketing','Ownership & leverage':'Practical e-commerce training','Revenue':'Dmall milestones','Build time':'Training lectures','Email growth':'Guidance',
'Instead, build assets that earn':'Build with Dmall','dream life':'our expertise','Turn your knowledge into products that sell on repeat — without relying on your time.':'End-to-end e-commerce services for your online business.',
'Spend your time creating, travelling, or resting — your income keeps working even when you’re offline.':'Shopify store development, branding and product setup for Pakistan and international markets.',
'Instead of trading hours for income, you’ll build digital assets that continue selling long after the work is done.':'Performance marketing across Meta, Google and TikTok, with SEO services for organic discovery.',
'Take control of your life. No need to clock in/out and work on projects that you want to.':'Practical e-commerce training with a dedicated private group and first live sale support.',
'Built for anyone who wants freedom':'Learn Shopify with Dmall','Curriculum':'Training highlights',
'Module 1: The Digital Product Mindset':'Shopify E-Commerce Training','Learn to escape client work by building scalable digital assets that earn passively and give you control over your time.':'Complete Shopify e-commerce training with a business startup plan and practical learning.',
'Module 2: Finding Your Profitable Idea':'Live + Recorded Learning','Discover what to sell by validating ideas fast, identifying your niche, and matching your skills with real market demand.':'45 days of learning, 14 detailed lectures and lifetime access to the training.',
'Module 3: Creating Your First Digital Product':'Personal Guidance','Turn your ideas into high-quality products like templates or eBooks that attract buyers and build trust instantly.':'Personal 1-on-1 guidance and a dedicated private group with the D Mall team.',
'Module 4: Setting Up Your Sales System':'Launch Support','Create a seamless funnel — landing page, payments, and automation — that handles sales and delivery for you.':'First live sale support, an official company certificate and lifetime access and support.',
'#1 rated lesson':'Shopify e-commerce training','Unlock':'Learn','a':'with','free preview':'Dmall','Get a sneak peek inside the course and see how simple it can be to turn your skills into digital income.':'45 days. Live + recorded. Personal guidance and 14 detailed lectures to help you build your online business.',
'Pricing plans':'Service packages','Build once':'Choose your','Earn forever':'next step','Learn the exact system to create digital products that keep earning long after you’ve done the work.':'Explore Dmall’s published Shopify and TikTok service packages. Contact the team to discuss your requirements.',
'Hey, I\'m Ramish':'Meet D-Mall OFFICIAL','I knew early on the 9–5 path wasn’t for me. I wanted control over my time, the freedom to build my own projects, and the ability to make money while I sleep.':'Your trusted partner for specialized e-commerce solutions and results-driven digital marketing.',
'I tried everything, freelancing, agency work, client projects and while I made good money, I was still trading hours for it.':'Dmall provides Shopify store development, digital advertising, SEO and expert business training.',
'Eventually, I realised the real leverage was in digital products. You build them once, and they keep earning long after.':'Services cover Pakistan and international markets, with support for store setup, branding and marketing.',
'After years of freelancing and client work, I realised digital products offered the most leverage and freedom. Now, through Browser.supply, I teach others how to turn their skills into scalable income and design a life on their own terms.':'The Shopify E-Commerce Training Program combines live and recorded lessons, personal guidance and a dedicated private group.',
'Now my focus is simple: helping people escape client work, build freedom, and design a life that doesn’t revolve around a calendar.':'Visit our Islamabad G-13/4 branch or our Kohat office at Bin-Asif Plaza, College Town, Pindi Road.',
'proof that it works':'Dmall success stories','Real people turning their skills into sales':'Student & client results','Testimonials':'Dmall support','Join creators who stopped trading time':'Build your business with Dmall','Start earning your freedom today':'Get a free consultation',
'From ideas to income':'Explore our services','blog':'our services','View all':'View all services','Created by':'Contact Dmall','Ramish Aziz':live.contactPhone,'browser.supply. Framer templates':live.contactEmail,'Monetize':'D-Mall OFFICIAL',
};
const faqQuestions=['What services does Dmall offer?','How long is the Shopify training?','What does the training include?','Does Dmall offer personal guidance?','Which Shopify markets do you support?','How can I contact the Dmall team?','Where are the Dmall branches?','How can I check selection or certificate status?'];
const faqAnswers=['Dmall offers Shopify store development, digital advertising, SEO, TikTok business setups and Shopify e-commerce training.','The Shopify E-Commerce Training Program runs for 45 days with live and recorded learning.','The program lists 14 detailed lectures, a complete business startup plan, an official company certificate and lifetime access and support.','The training includes personal 1-on-1 guidance, a dedicated private group and first live sale support from the team.','Dmall lists Shopify packages for Pakistan and international markets, including UAE and KSA business setups.','WhatsApp or call +92 326 8669646, or email dmallofficial.pk@gmail.com.','Islamabad: G-13/4. Kohat: Pindi Road, College Town, Bin-Asif Plaza, Office #7.','Use the course selection checker on Dmall’s original homepage and the certificate verification center on its Success page.'];
function swap($,dict){$('[data-framer-component-type="RichTextContainer"]').each((i,e)=>{const node=$(e),text=node.text().replace(/\s+/g,' ').trim();if(!(text in dict))return;const child=node.find('h1,h2,h3,h4,h5,h6,p').first();if(child.length)child.text(dict[text]);else node.text(dict[text]);});}
for(const file of fs.readdirSync(app).filter(f=>f.endsWith('reference.json')||f==='reference.json')){
 const saved=path.join(backup,file);if(!fs.existsSync(saved))fs.copyFileSync(path.join(app,file),saved);
 const data=JSON.parse(fs.readFileSync(saved));
 for(const key of ['hero','navigation','html'])if(data[key]){
  const $=load(data[key],null,false);
  swap($,common);
  if(file==='reference.json'&&key==='hero'){
   $('h1').html('<span>Scale</span> <span>Your</span> <span>E-Commerce</span> <span>Business</span> <span>Faster.</span>');
   swap($,{'EARN $$$ ON AUTOPILOT':'YOUR DIGITAL GROWTH PARTNER','Turn your knowledge into digital products that sell themselves and give you freedom over your time.':live.heroSub});
   const notices=[['Shopify','Store Development'],['Meta & Google','Digital Marketing'],['Dmall Training','Live + Recorded'],['SEO','Search Optimization']];
   $('h6').each((i,e)=>$(e).text(notices[i%4][0]));
   let noticeIndex=0; $('p').each((i,e)=>{const t=$(e).text();if(t.includes('You received a payment'))$(e).text(notices[noticeIndex++%4]?.[1]||'Dmall Services');if(/\d+m ago/.test(t))$(e).text('D-Mall OFFICIAL');});
   // Decorative template avatars and star ratings must not imply Dmall endorsements.
   $('[aria-label*="star" i]').remove();
   $('img').attr({src:'/assets/dmall-logo.png',alt:'D-Mall OFFICIAL'}).removeAttr('srcset').removeAttr('sizes');
  }
  if(file==='reference.json'&&key==='navigation'){
   $('a').each((i,e)=>{if(!$(e).text().trim())$(e).html('<img class="dmall-logo" src="/assets/dmall-logo.png" alt="D-Mall OFFICIAL" width="132" height="52">').attr({'href':'#','aria-label':'D-Mall OFFICIAL home'});});
  }
  if(file==='preview-reference.json')$('form').replaceWith(`<a class="dmall-cta" href="${wa}" target="_blank" rel="noopener noreferrer">Ask about training ↗</a>`);
  if(file==='testimonial-reference.json'){
   const current=JSON.parse(fs.readFileSync('app/testimonial-reference.json')).html;
   // Preserve the reviewed mockup treatment when refreshing business copy.
   if(current.includes('dmall-proof-stage')){const proof=load(current,null,false);$('#testimonials').replaceWith(proof('#testimonials'));}
  }
  $('a').each((i,e)=>{const a=$(e),href=a.attr('href')||'',t=a.text().trim();if(href.startsWith('/assets/'))return;let to;
   if(/WhatsApp|Contact Us|consultation|Ask about|Discuss this/i.test(t))to=href.includes('?text=')?href:wa;
   else if(/Call Dmall/.test(t))to='tel:+923268669646';else if(/Email Dmall/.test(t))to='mailto:'+live.contactEmail;
   else if(/Explore services|Packages/.test(t))to='#pricing';else if(/Explore training/.test(t))to='#curriculum';else if(/About Dmall/.test(t))to='#instructor';else if(/FAQs/.test(t))to='#faqs';else if(/Services/.test(t))to='https://www.dmallofficial.com/services';else if(/Success Stories/.test(t))to='https://www.dmallofficial.com/success';
   if(!to&&(/framer|browser.supply|lemonsqueezy|gumroad|payhip|stripe|twitter|instagram|youtube/i.test(href)||href.startsWith('/blog')))to=wa;
   if(to)a.attr('href',to);if((a.attr('href')||'').startsWith('https://'))a.attr({'target':'_blank',rel:'noopener noreferrer'});
  });
  $('[data-framer-name="Row/Stars"],[data-framer-name="star"]').remove();
  $('[alt]').each((i,e)=>{if(/Ramish|Monetize|Emma|Daniel/i.test($(e).attr('alt')))$(e).attr('alt','Dmall digital business services');});
  data[key]=$.html();
 }
 fs.writeFileSync(path.join(app,file),JSON.stringify(data));
}
console.log('Dmall content applied; local result assets:',stories.length);

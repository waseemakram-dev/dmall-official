import fs from 'node:fs';
const file='app/testimonial.jsx';
let source=fs.readFileSync(file,'utf8');
source=source.replace('const slides=[...track.children];',`const slides=[...track.children];
      const before=slides.map(slide=>{const clone=slide.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;return clone;});
      const after=before.map(slide=>slide.cloneNode(true));
      track.prepend(...before);track.append(...after);
      const count=slides.length;
      let physical=count;
      let generation=0;
      const logical=n=>((n%count)+count)%count;`);
const start=source.indexOf('      function show(next,instant=false){');
const end=source.indexOf('      function schedule(){',start);
source=source.slice(0,start)+`      function show(next,instant=false){
        const token=++generation;
        const previousIndex=index;
        index=logical(next);
        const width=slider.getBoundingClientRect().width;
        const gap=parseFloat(getComputedStyle(track).gap)||24;
        const perView=innerWidth>=810?3:1;
        const cardWidth=(width-gap*(perView-1))/perView;
        [...track.children].forEach(slide=>{
          const card=slide.firstElementChild;
          if(card)card.style.setProperty('width',cardWidth+'px','important');
        });
        const step=cardWidth+gap;
        movement?.stop();
        if(instant)physical=count+index;
        else if(next===previousIndex+1)physical+=1;
        else if(next===previousIndex-1)physical-=1;
        else physical=count+index;
        const normalize=()=>{
          if(token!==generation)return;
          if(physical>=2*count)physical-=count;
          else if(physical<count)physical+=count;
          track.style.transform='translateX('+(-step*physical)+'px)';
        };
        if(instant||reduced.matches){track.style.transform='translateX('+(-step*physical)+'px)';normalize();}
        else movement=animate(track,{x:-step*physical},{duration:.55,ease:[.22,1,.36,1],onComplete:normalize});
        slides.forEach((slide,i)=>{
          const visibleCard=Array.from({length:perView},(_,offset)=>logical(index+offset)).includes(i);
          slide.setAttribute('aria-hidden',String(!visibleCard));
          slide.setAttribute('aria-label',(i+1)+' of '+count);
          slide.setAttribute('role','group');
        });
        dots.forEach((dot,i)=>{
          dot.disabled=false;dot.style.pointerEvents='auto';dot.setAttribute('aria-current',String(i===index));
          if(dot.firstElementChild)dot.firstElementChild.style.opacity=i===index?'1':'.2';
          dot.parentElement.style.opacity='1';dot.parentElement.style.pointerEvents='auto';
        });
      }
`+source.slice(end);
source=source.replace('5000','1800');
source=source.replace('stop();observe.disconnect();movement?.stop();clearInterval(timer);dotHandlers.forEach(fn=>fn());','stop();observe.disconnect();movement?.stop();clearInterval(timer);dotHandlers.forEach(fn=>fn());before.forEach(node=>node.remove());after.forEach(node=>node.remove());');
fs.writeFileSync(file,source);
console.log('Rating carousel: 3 desktop cards, 1 mobile card, 1800 ms autoplay, seamless cloned loop.');

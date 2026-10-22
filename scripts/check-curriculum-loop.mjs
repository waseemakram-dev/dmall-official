import fs from 'node:fs';
import assert from 'node:assert/strict';
let source=fs.readFileSync('app/curriculum.jsx','utf8').replace(/^import .*;\r?\n/gm,'').replace('export default function Curriculum()', 'function Curriculum()');
source=source.slice(0,source.indexOf('  return <div'))+'}\nCurriculum();';
let animations=[], cleanup;
const style=()=>({setProperty(k,v){this[k]=v;}});
const slide=id=>({id,style:style(),firstElementChild:{style:style(),getBoundingClientRect:()=>({width:420})},attrs:{},setAttribute(k,v){this.attrs[k]=v;},querySelectorAll:()=>[],cloneNode(){return slide(id);},remove(){const i=track.children.indexOf(this);if(i>=0)track.children.splice(i,1);}});
const track={children:[1,2,3,4].map(slide),style:style(),querySelectorAll:()=>[],addEventListener(){},removeEventListener(){},prepend(...nodes){for(const n of nodes){const i=this.children.indexOf(n);if(i>=0)this.children.splice(i,1);}this.children.unshift(...nodes);},append(...nodes){for(const n of nodes){const i=this.children.indexOf(n);if(i>=0)this.children.splice(i,1);}this.children.push(...nodes);},get firstElementChild(){return this.children[0];},get lastElementChild(){return this.children.at(-1);},animate(frames){const a={frames,cancel(){},onfinish:null};animations.push(a);return a;}};
const button=()=>({style:style(),parentElement:{style:style()},addEventListener(name,fn){this[name]=fn;},removeEventListener(){}});
const prev=button(),next=button();
const slider={style:style(),querySelector:s=>s==='ul'?track:s.includes('Previous')?prev:next,getBoundingClientRect:()=>({width:444}),setAttribute(){},addEventListener(){},removeEventListener(){}};
const root={querySelectorAll:()=>[slider]};
const reduced={matches:false,addEventListener(){},removeEventListener(){}};
new Function('useEffect','useRef','inView','matchMedia','ResizeObserver','getComputedStyle',source)(fn=>{cleanup=fn();},()=>({current:root}),()=>()=>{},()=>reduced,class {observe(){}disconnect(){}},()=>({gap:'24px'}));
const visible=()=>track.children.slice(4,7).map(s=>s.id);
assert.deepEqual(visible(),[1,2,3]);
for(let i=1;i<=20;i++){
 next.click();const a=animations.at(-1);
 assert.equal(a.frames[0].transform,'translateX(-1776px)');
 assert.equal(a.frames[1].transform,'translateX(-2220px)','Next must always move forward, including module four');
 a.onfinish();
 assert.deepEqual(visible(),Array.from({length:3},(_,j)=>(i+j)%4+1));
}
for(let i=1;i<=20;i++){prev.click();animations.at(-1).onfinish();assert.deepEqual(visible(),Array.from({length:3},(_,j)=>((20-i+j)%4+4)%4+1));}
next.click();next.click();next.click();
for(let i=0;i<3;i++)animations.at(-1).onfinish();
assert.deepEqual(visible(),[4,1,2]);
assert.equal(track.style.transform,'translateX(-1776px)');
cleanup();assert.deepEqual(track.children.map(s=>s.id),[1,2,3,4]);
console.log('PASS: 20 forward + 20 backward slides, fourth/first direction, rapid click queue, visible 4-1-2, cleanup.');

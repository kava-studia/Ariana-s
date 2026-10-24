import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../dist/privacy.js',import.meta.url),'utf8');
function setup(seed={},blocked=false){
 const data=new Map(Object.entries(seed)),elements=new Map(),events={};
 function element(id){if(!elements.has(id))elements.set(id,{hidden:false,checked:false,textContent:'',classList:{toggle(){},add(){},remove(){}},addEventListener(){},focus(){},showModal(){},close(){},querySelector:()=>element('close')});return elements.get(id)}
 const context={document:{body:{insertAdjacentHTML(){},classList:{toggle(){},add(){},remove(){}}},getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:(n,fn)=>{events[n]=fn}},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>{if(blocked)throw Error('blocked');data.set(k,v)},removeItem:k=>data.delete(k)},navigator:{},Event:class{constructor(type){this.type=type}},window:{dispatchEvent(){},addEventListener:(n,fn)=>{events[n]=fn}},Date,JSON,Boolean,Number};
 vm.runInNewContext(source,context);return {api:context.window.ArianaPrivacy,data,element,events};
}
let t=setup({'arianas-profile':JSON.stringify({name:'old'})});
assert.equal(t.data.has('arianas-profile'),false,'Legacy personal data must not survive without permission');
t.api.storage.write('arianas-cart',{samsa:2});assert.equal(t.data.size,0,'Default refusal must not persist optional data');
t.element('rememberCart').checked=true;t.element('rememberPersonal').checked=false;t.element('savePrivacy').onclick();
t.api.storage.write('arianas-cart',{samsa:2});t.api.storage.write('arianas-profile',{name:'test'});
assert.equal(JSON.parse(t.data.get('arianas-cart')).value.samsa,2);assert.equal(t.data.has('arianas-profile'),false);
let reloaded=setup(Object.fromEntries(t.data));assert.equal(reloaded.api.storage.read('arianas-cart',{}).samsa,2);
t.element('rememberPersonal').checked=true;t.element('savePrivacy').onclick();t.api.storage.write('arianas-profile',{name:'test'});t.api.storage.write('arianas-orders',[{id:'test'}]);assert(t.data.has('arianas-profile'));
t.element('rememberPersonal').checked=false;t.element('savePrivacy').onclick();assert.equal(t.data.has('arianas-profile'),false);assert.equal(t.data.has('arianas-orders'),false);assert(t.data.has('arianas-cart'));
t.data.set('arianas-cart',JSON.stringify({value:{samsa:3},expires:Date.now()-1}));assert.equal(Object.keys(t.api.storage.read('arianas-cart',{})).length,0);assert(!t.data.has('arianas-cart'));
t.api.storage.write('arianas-cart',{samsa:3});t.element('confirmDelete').onclick();assert.deepEqual([...t.data.keys()],['arianas-privacy-v1']);assert.equal(t.api.get().cart,false);assert.equal(t.api.get().personal,false);
let expired=setup({'arianas-privacy-v1':JSON.stringify({version:1,cart:true,personal:true,expires:0}),'arianas-profile':JSON.stringify({value:{name:'test'},expires:Date.now()+999999})});assert.equal(expired.data.size,0);
let denied=setup({},true);denied.element('rememberPersonal').checked=true;assert.doesNotThrow(()=>denied.element('savePrivacy').onclick());assert.equal(denied.api.storage.write('arianas-profile',{name:'test'}),false);
console.log('PASS: opt-in, independent categories, persistence, withdrawal, expiry, deletion and blocked storage.');

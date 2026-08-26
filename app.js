const KEY='ourtime_v2';
const defaultMessages=[
"Every love story is beautiful, but ours is my favourite. ❤️",
"Still my favourite person, every single day. ✨",
"Home isn't a place. It's a person. 💕",
"After all this time, I'd still choose you. ❤️",
"Together is my favourite place to be. 🌙",
"Here's to every moment we've shared and every one still to come. ✨",
"You make ordinary days feel like something special. 💛"
];
let d=JSON.parse(localStorage.getItem(KEY)||'null')||{
 your:'Ethan Busuttil',partner:'Karla Kilpatrick',date:'2014-07-15T08:00',
 partnerBirthday:'1995-04-07',yourBirthday:'1995-04-07',photo:null,
 messages:defaultMessages,customMessages:[],history:[],lastDay:'',widgetStyle:'balanced',
 widgetPhotoMode:'dashboard'
};
const $=s=>document.querySelector(s);
function save(){localStorage.setItem(KEY,JSON.stringify(d))}
function esc(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function dateParts(){
 let a=new Date(d.date),n=new Date(),y=n.getFullYear()-a.getFullYear(),m=n.getMonth()-a.getMonth(),day=n.getDate()-a.getDate();
 if(day<0){m--;day+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}
 if(m<0){y--;m+=12}
 let base=new Date(a);base.setFullYear(a.getFullYear()+y);base.setMonth(a.getMonth()+m);base.setDate(base.getDate()+day);
 let sec=Math.max(0,Math.floor((n-base)/1000)),h=Math.floor(sec/3600);sec%=3600;let min=Math.floor(sec/60);sec%=60;
 let total=Math.max(0,Math.floor((n-new Date(a.getFullYear(),a.getMonth(),a.getDate()))/86400000));
 return {y,m,day,h,min,s:sec,total}
}
function nextAnnual(x){if(!x)return null;let a=new Date(x),n=new Date();a.setFullYear(n.getFullYear());if(a<=n)a.setFullYear(n.getFullYear()+1);return a}
function until(x){return x?Math.max(0,Math.ceil((new Date(x)-new Date())/86400000)):null}
function fmt(x){return new Date(x).toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'})}
function todayKey(){return new Date().toISOString().slice(0,10)}
function allMessages(){return [...defaultMessages,...(d.customMessages||[])]}
function ensureDaily(){
 let k=todayKey(),msgs=allMessages();
 if(d.lastDay!==k){
   let idx=Math.floor((new Date().setHours(0,0,0,0)/86400000))%msgs.length;
   let msg=msgs[(idx+msgs.length)%msgs.length];
   d.currentMessage=msg;d.lastDay=k;
   d.history=d.history||[];
   if(!d.history.some(x=>x.day===k))d.history.unshift({day:k,text:msg});
   save();
 }
}
function shell(content,active='home'){
 document.querySelector('#app').innerHTML=`<div class="app">${content}<nav class="bottom">
 <button class="${active==='home'?'active':''}" onclick="home()">♥<small>Together</small></button>
 <button class="${active==='birth'?'active':''}" onclick="birthdays()">🎂<small>Birthdays</small></button>
 <button class="${active==='mile'?'active':''}" onclick="milestones()">✦<small>Milestones</small></button>
 <button class="${active==='settings'?'active':''}" onclick="settings()">⚙<small>Settings</small></button>
 </nav></div>`;
}
function home(){
 ensureDaily();let x=dateParts(),bd=until(nextAnnual(d.partnerBirthday)),ann=until(nextAnnual(d.date)),next=[1000,2000,3000,4000,5000,6000,10000].find(v=>v>x.total);
 let photo=d.photo?`<img class="heroPhoto" src="${d.photo}">`:'';
 shell(`<header class="top"><button class="icon" onclick="settings()">⚙</button><div class="brand"><h1>OUR TIME <span class="heart">♥</span></h1><div class="sub">${esc(d.your)} ❤️ ${esc(d.partner)}</div></div><button class="icon" onclick="partner()">♧</button></header>
 <section class="hero">${photo}<div class="heroShade"></div><div class="heroContent"><div class="eyebrow">TOGETHER FOR</div><div class="heroYears">${x.y} YEARS</div><div class="heroLine"></div><div class="heroDuration">${x.m} MONTHS · ${x.day} DAYS</div><div class="daysBadge"><div class="days">${x.total.toLocaleString()}</div><div class="tiny">DAYS TOGETHER</div></div></div></section>
 <section class="quick">
 <div class="card"><div class="qicon">♡</div><div class="qtitle">Since</div><div class="qvalue">${new Date(d.date).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'})}</div></div>
 <div class="card"><div class="qicon">🎂</div><div class="qtitle">Next Birthday</div><div class="qvalue">${bd??'—'}<div class="tiny">DAYS</div></div></div>
 <div class="card"><div class="qicon">☆</div><div class="qtitle">Next Milestone</div><div class="qvalue">${next?next.toLocaleString():'✓'}<div class="tiny">${next?'DAYS':''}</div></div></div></section>
 <section class="card loveCard"><div class="eyebrow">DAILY LOVE MESSAGE ♥</div><div class="quote">${esc(d.currentMessage)}</div><button class="goldBtn" onclick="newMessage()">↻ NEW MESSAGE</button></section>`, 'home');
}
function newMessage(){let msgs=allMessages(),cur=d.currentMessage||'',idx=msgs.indexOf(cur);d.currentMessage=msgs[(idx+1)%msgs.length];d.lastDay=todayKey();d.history=d.history||[];d.history.unshift({day:new Date().toLocaleDateString(),text:d.currentMessage});save();home()}
function birthdays(){shell(`<button class="goldBtn back" onclick="home()">‹ Back</button><h2 class="pageTitle">Birthdays 🎂</h2>
<div class="card"><div class="eyebrow">PARTNER</div><h2>${esc(d.partner)}</h2><p>${d.partnerBirthday?fmt(d.partnerBirthday):'Not set'}</p><p class="gold">${d.partnerBirthday?until(nextAnnual(d.partnerBirthday))+' days to go':''}</p></div>
<div class="card"><div class="eyebrow">YOUR BIRTHDAY</div><h2>${esc(d.your)}</h2><p>${d.yourBirthday?fmt(d.yourBirthday):'Not set'}</p></div>
<div class="card"><div class="eyebrow">ANNIVERSARY</div><h2>${until(nextAnnual(d.date))} days</h2><p>Next anniversary</p></div>`,'birth')}
function milestones(){let x=dateParts(),arr=[100,365,500,1000,1500,2000,2500,3000,4000,5000,6000,10000];shell(`<button class="goldBtn back" onclick="home()">‹ Back</button><h2 class="pageTitle">Milestones ✦</h2>`+arr.map(v=>`<div class="card row"><div><b>${v.toLocaleString()} days together</b><div class="tiny">${x.total>=v?'MILESTONE REACHED':(v-x.total)+' days to go'}</div></div><div class="qicon">${x.total>=v?'♥':'☆'}</div></div>`).join(''),'mile')}
function settings(){shell(`<button class="goldBtn back" onclick="home()">‹ Back</button><h2 class="pageTitle">Settings</h2>
<div class="card"><div class="eyebrow">OUR DETAILS</div>
<div class="field"><label>Your name</label><input id="your" value="${esc(d.your)}"></div>
<div class="field"><label>Partner's name</label><input id="partnerName" value="${esc(d.partner)}"></div>
<div class="field"><label>Together since</label><input id="date" type="datetime-local" value="${new Date(d.date).toISOString().slice(0,16)}"></div>
<div class="field"><label>Partner birthday</label><input id="pb" type="date" value="${d.partnerBirthday||''}"></div>
<div class="field"><label>Your birthday</label><input id="yb" type="date" value="${d.yourBirthday||''}"></div>
<div class="field"><label>Dashboard photo</label><input id="photo" type="file" accept="image/*"></div>
${d.photo?`<img class="photoPreview" src="${d.photo}">`:''}
<button class="goldBtn" onclick="saveSettings()">SAVE CHANGES</button></div>
<div class="card"><div class="eyebrow">WIDGET APPEARANCE</div>
<div class="field"><label>Widget style</label><select id="ws"><option ${d.widgetStyle==='photo'?'selected':''} value="photo">Photo Focused</option><option ${d.widgetStyle==='balanced'?'selected':''} value="balanced">Balanced</option><option ${d.widgetStyle==='minimal'?'selected':''} value="minimal">Minimal & Elegant</option><option ${d.widgetStyle==='icons'?'selected':''} value="icons">Icon Strip</option></select></div>
<div class="field"><label>Widget photo</label><select id="wp"><option ${d.widgetPhotoMode==='dashboard'?'selected':''} value="dashboard">Use Dashboard Photo</option><option ${d.widgetPhotoMode==='none'?'selected':''} value="none">No Photo — Celestial</option></select></div>
<button class="goldBtn" onclick="saveWidget()">SAVE WIDGET OPTIONS</button></div>
<div class="card"><div class="eyebrow">YOUR MESSAGES</div><p class="notice">Create your own messages. Our Time will include them in the daily rotation, and you can browse the message history.</p><button class="goldBtn" onclick="messages()">MANAGE MESSAGES</button></div>
<div class="card"><div class="eyebrow">PARTNER</div><p class="notice">Invite your loved one to connect. This is the test interface for the cross-platform partner feature.</p><button class="goldBtn" onclick="partner()">INVITE PARTNER</button></div>
<div class="footer">Our Time ♥<br>Made by Ethan Busuttil<br>© 2026 Ethan Busuttil</div>`,'settings')}
function saveSettings(){d.your=$('#your').value;d.partner=$('#partnerName').value;d.date=new Date($('#date').value).toISOString();d.partnerBirthday=$('#pb').value;d.yourBirthday=$('#yb').value;let f=$('#photo').files[0];if(f){let r=new FileReader();r.onload=()=>{d.photo=r.result;save();home()};r.readAsDataURL(f)}else{save();home()}}
function saveWidget(){d.widgetStyle=$('#ws').value;d.widgetPhotoMode=$('#wp').value;save();alert('Widget options saved ❤️')}
function messages(){shell(`<button class="goldBtn back" onclick="settings()">‹ Back</button><h2 class="pageTitle">Love Messages 💌</h2>
<div class="card"><div class="eyebrow">WRITE YOUR OWN</div><div class="field"><textarea id="newMsg" placeholder="Write something special..."></textarea></div><button class="goldBtn" onclick="addMessage()">ADD MESSAGE</button></div>
<div class="card"><div class="eyebrow">MESSAGE HISTORY</div>${(d.history||[]).length?(d.history||[]).map(x=>`<div class="card messageItem"><div><span class="pill">${esc(x.day)}</span><p class="messageText">${esc(x.text)}</p></div></div>`).join(''):'<p class="notice">No messages yet.</p>'}</div>
<div class="card"><div class="eyebrow">YOUR CUSTOM MESSAGES</div>${(d.customMessages||[]).length?(d.customMessages||[]).map((x,i)=>'<div class="messageItem"><div class="messageText">'+esc(x)+'</div><button class="goldBtn" onclick="removeMessage('+i+')">×</button></div><hr style="border-color:#3b2a16">').join(''):"<p class='notice'>You haven't added any custom messages yet.</p>"}</div>`,'settings')}
function addMessage(){let v=$('#newMsg').value.trim();if(!v)return;d.customMessages=d.customMessages||[];d.customMessages.push(v);save();messages()}
function removeMessage(i){d.customMessages.splice(i,1);save();messages()}
function partner(){shell(`<button class="goldBtn back" onclick="settings()">‹ Back</button><h2 class="pageTitle">Partner ♥</h2><div class="card"><div class="eyebrow">INVITATION</div><h2>Connect Our Time</h2><p class="notice">This test version demonstrates the invitation flow. The final native build will connect your iPhone and your partner's Android account.</p><div class="field"><input id="inviteLink" readonly value="OURTIME-${Math.random().toString(36).slice(2,8).toUpperCase()}"></div><button class="goldBtn" onclick="copyInvite()">COPY INVITE</button></div><div class="card"><div class="eyebrow">WHAT WILL SYNC</div><p class="notice">Relationship date • shared milestones • birthdays • love messages • connection status</p></div>`,'settings')}
function copyInvite(){navigator.clipboard?.writeText($('#inviteLink').value);alert('Invite copied ❤️')}
ensureDaily();home();setInterval(()=>{if(document.querySelector('.bottom')&&!document.querySelector('#your'))home()},1000);
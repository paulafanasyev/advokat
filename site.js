(function(){
try{
const L=(t)=>`<span class="law">${t}</span>`;
const T={
  detained:{more:'#first-hours',label:'Памятка при задержании',s:[
    ['Позвоните адвокату сейчас.','Чем раньше подключится защитник, тем больше можно сделать до&nbsp;первого допроса.'],
    ['Дальше действуйте по&nbsp;памятке ниже:','что записать, как вести себя на&nbsp;допросе, какие сроки действуют.']]},
  search:{more:'#search',label:'Памятка при обыске',s:[
    ['Позвоните адвокату сразу','и не&nbsp;мешайте обыску физически.'],
    ['Дальше действуйте по&nbsp;памятке ниже:','постановление, изъятие, протокол и его копия.']]},
  summons:{more:'#faq',label:'Частые вопросы',s:[
    ['Уточните, в&nbsp;каком статусе вызывают:','свидетель, подозреваемый или обвиняемый. От&nbsp;этого зависят ваши права.'],
    ['Свидетель вправе прийти с&nbsp;адвокатом.','Позвоните до&nbsp;явки, а&nbsp;не&nbsp;после.','п.&nbsp;6 ч.&nbsp;4 ст.&nbsp;56 УПК&nbsp;РФ'],
    ['Сохраните повестку','или запишите, кто, куда и когда вызывает.'],
    ['Прочитайте протокол целиком.','Замечания внесите до&nbsp;подписи.','ч.&nbsp;6 ст.&nbsp;190 УПК&nbsp;РФ']]},
  civil:{more:'#practice',label:'Гражданские дела',s:[
    ['Соберите документы:','договоры, расписки, переписку, претензии, судебные извещения.'],
    ['Проверьте сроки.','Апелляционная жалоба подаётся в&nbsp;течение месяца со&nbsp;дня принятия решения в&nbsp;окончательной форме.','ч.&nbsp;1 ст.&nbsp;321 ГПК&nbsp;РФ'],
    ['Не подписывайте','мировые соглашения и расписки без консультации.'],
    ['Напишите письмо','с&nbsp;кратким описанием и сканами документов.']]},
  doc:{more:'#contact',label:'Написать письмо',s:[
    ['Опишите, что нужно:','иск, отзыв, жалоба, ходатайство, претензия.'],
    ['Укажите срок,','к&nbsp;которому документ нужно подать.'],
    ['Пришлите то, что есть:','решения, протоколы, договоры, письма другой стороны.'],
    ['Объём и стоимость обсудим','до&nbsp;начала работы.']]}
};
const stepsEl=document.getElementById('steps'),more=document.getElementById('triage-more');
document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const k=T[b.dataset.s];
  stepsEl.innerHTML=k.s.map(r=>`<li><span><strong>${r[0]}</strong> ${r[1]}${r[2]?L(r[2]):''}</span></li>`).join('');
  more.href=k.more;more.textContent=k.label;
}));

const B={
  'Уголовное дело':['Постановления, повестки, протоколы, если есть на&nbsp;руках','Где сейчас находится человек и какой орган ведёт дело','Номер дела и статья, если известны','Даты: задержание, ближайшее заседание'],
  'Гражданский спор':['Договор, расписка или другое основание требований','Переписка и претензии','Иск или судебное извещение, если уже есть','Дата ближайшего заседания'],
  'Документ':['Какой документ нужен и куда его подавать','Срок подачи','Решение или документ, который обжалуется'],
  'Другое':['Кратко: что произошло и когда','Документы, которые кажутся важными']
};
const bringEl=document.getElementById('bring');
document.querySelectorAll('input[name=situation]').forEach(r=>r.addEventListener('change',()=>{
  bringEl.innerHTML=B[r.value].map(t=>`<li>${t}</li>`).join('');
}));

const $=id=>document.getElementById(id);
const f=$('f'),done=$('done');
f.setAttribute('novalidate','');
let lastBody='',lastHref='mailto:Negnyurov@mail.ru';
const setErr=(id,on)=>{const w=$(id);w.classList.toggle('err',on);const c=w.querySelector('input,textarea');if(c)c.setAttribute('aria-invalid',String(on))};
['name','tel','msg'].forEach(id=>$(id).addEventListener('input',e=>{const w=e.target.closest('.field');if(w.classList.contains('err'))setErr(w.id,false)}));
$('ok').addEventListener('change',()=>setErr('fc',false));
$('privacy-link').addEventListener('click',()=>{$('privacy').open=true});
f.addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('name').value.trim(),tel=$('tel').value.trim(),msg=$('msg').value.trim(),ok=$('ok').checked;
  const d=tel.replace(/\D/g,'');
  const bad={fn:!name,fp:d.length<10||d.length>11,fm:msg.length<10,fc:!ok};
  Object.entries(bad).forEach(([k,v])=>setErr(k,v));
  const first=Object.keys(bad).find(k=>bad[k]);
  if(first){const el=$(first).querySelector('input,textarea');if(el)el.focus();return}
  const sit=document.querySelector('input[name=situation]:checked').value;
  lastBody=`Здравствуйте, Иван Юрьевич.\n\nСитуация: ${sit}\n\n${msg}\n\n${name}\nТелефон: ${tel}`;
  lastHref=`mailto:Negnyurov@mail.ru?subject=${encodeURIComponent('Обращение: '+sit.toLowerCase()+', '+name)}&body=${encodeURIComponent(lastBody)}`;
  $('reopen').href=lastHref;
  const btn=f.querySelector('.submit'),bl=btn.innerHTML;btn.disabled=true;btn.textContent='Отправляю…';
  const showDone=(ok)=>{btn.disabled=false;btn.innerHTML=bl;
    $('done-h').textContent=ok?'Обращение отправлено':'Почтовая программа должна открыться';
    $('done-p').textContent=ok?'Письмо ушло адвокату на почту. Он свяжется с вами по номеру '+tel+'. Если вопрос срочный, позвоните: +7 964 423-68-89.':'Автоматически отправить не получилось. Проверьте текст в почтовой программе и нажмите «Отправить». Если программа не открылась, скопируйте текст и отправьте его на Negnyurov@mail.ru или просто позвоните.';
    $('reopen').hidden=ok;$('copy-body').hidden=ok;
    f.hidden=true;done.classList.add('show');done.focus();};
  const S=window.__advSend;
  if(S){S.send({subject:'Обращение с сайта: '+sit.toLowerCase()+', '+name,fields:{'Ситуация':sit,'Имя':name,'Телефон':tel,'Суть вопроса':msg,'Источник':'Форма на сайте'}}).then(()=>showDone(true)).catch(()=>{window.location.href=lastHref;showDone(false);});}
  else{window.location.href=lastHref;showDone(false);}
});
$('again').addEventListener('click',()=>{done.classList.remove('show');f.hidden=false;$('msg').focus()});
async function copyText(t,btn){
  const old=btn.textContent;
  try{await navigator.clipboard.writeText(t);btn.textContent='Скопировано'}catch(_){btn.textContent='Не удалось, выделите вручную'}
  setTimeout(()=>{btn.textContent=old},1800);
}
$('copy-body').addEventListener('click',e=>copyText('Кому: Negnyurov@mail.ru\n\n'+lastBody,e.currentTarget));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText(b.dataset.copy,b)));
}catch(err){/* контент виден и без скрипта */}
})();

/* ---------- Отправка заявок и помощник ---------- */
(function(){
'use strict';
var CFG={
  email:'Negnyurov@mail.ru',
  /* Сервис отправки писем без почтовой программы. Пустая строка: только через почтовую программу посетителя. */
  endpoint:'https://formsubmit.co/ajax/Negnyurov@mail.ru',
  tel:'+79644236889',telText:'+7\u00a0964\u00a0423-68-89'
};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function mailtoHref(p){
  var body=Object.keys(p.fields).map(function(k){return k+': '+p.fields[k];}).join('\n');
  return 'mailto:'+CFG.email+'?subject='+encodeURIComponent(p.subject)+'&body='+encodeURIComponent('Здравствуйте, Иван Юрьевич.\n\n'+body);
}
function send(p){
  if(!CFG.endpoint||!window.fetch)return Promise.reject(new Error('no-endpoint'));
  var data={_subject:p.subject,_template:'table',_captcha:'false',_honey:p.honey||''};
  Object.keys(p.fields).forEach(function(k){data[k]=p.fields[k];});
  var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort();},15000);
  return fetch(CFG.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:ctl?ctl.signal:undefined})
    .then(function(r){return r.json();})
    .then(function(j){clearTimeout(tm);if(String(j.success)!=='true')throw new Error(j.message||'fail');return j;})
    .catch(function(e){clearTimeout(tm);throw e;});
}
window.__advSend={send:send,mailtoHref:mailtoHref,cfg:CFG};

var cb=document.getElementById('cb'),launch=document.getElementById('cb-launch'),logEl=document.getElementById('cb-log'),inp=document.getElementById('cb-input');
if(!cb)return;
var D={},started=false,busy=false;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function scroll(){logEl.scrollTop=logEl.scrollHeight;}
function add(html,who,cls){var m=document.createElement('div');m.className='msg '+(who||'bot')+(cls?' '+cls:'');if(who==='me')m.textContent=html;else m.innerHTML=html;logEl.appendChild(m);scroll();if(!RM&&m.animate)m.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});return m;}
function say(list,done){
  list=list.slice();
  (function next(){
    if(!list.length){done&&done();return;}
    var t=list.shift();
    if(RM){add(t);next();return;}
    var ty=add('<i></i><i></i><i></i>','bot','typing');
    setTimeout(function(){ty.remove();add(t);next();},Math.min(900,280+t.length*4));
  })();
}
function law(t){return '<span class="law">'+t+'</span>';}
function clearInput(){inp.innerHTML='';}
function opts(list){
  clearInput();
  list.forEach(function(o){
    var el;
    if(o.href){el=document.createElement('a');el.href=o.href;if(o.href.charAt(0)==='#')el.addEventListener('click',function(){if(innerWidth<=700)close();});}
    else{el=document.createElement('button');el.type='button';el.addEventListener('click',function(){if(busy)return;add(o.t,'me');if(o.set)Object.keys(o.set).forEach(function(k){D[k]=o.set[k];});clearInput();go(o.go);});}
    el.className='cb-opt'+(o.cls?' '+o.cls:'');el.textContent=o.t;inp.appendChild(el);
  });
  focusFirst();
}
function focusFirst(){var f=inp.querySelector('input,textarea,button,a');if(f&&cb.contains(document.activeElement))f.focus({preventScroll:true});}
function ask(cfg){
  clearInput();
  var f=document.createElement('form');f.className='cb-form';f.noValidate=true;
  var id='cbf-'+cfg.key;
  var field=cfg.type==='textarea'?'<textarea id="'+id+'" maxlength="1500" placeholder="'+(cfg.ph||'')+'"></textarea>':'<input id="'+id+'" type="'+cfg.type+'" '+(cfg.attrs||'')+' placeholder="'+(cfg.ph||'')+'">';
  f.innerHTML='<label for="'+id+'">'+cfg.label+'</label>'+field+'<span class="err" id="'+id+'-e" aria-live="polite"></span><div class="row"><button class="cb-opt primary" type="submit">Далее</button>'+(cfg.skip?'<button class="cb-opt quiet" type="button" data-skip>Пропустить</button>':'')+(cfg.back?'<button class="cb-opt quiet" type="button" data-back>Назад</button>':'')+'</div>';
  inp.appendChild(f);
  var el=f.querySelector('#'+id);el.setAttribute('aria-describedby',id+'-e');if(D[cfg.key])el.value=D[cfg.key];
  f.addEventListener('submit',function(e){e.preventDefault();var v=el.value.trim(),er=cfg.check?cfg.check(v):'';
    if(er){f.querySelector('.err').textContent=er;el.setAttribute('aria-invalid','true');el.focus();return;}
    D[cfg.key]=v;add(cfg.echo?cfg.echo(v):v,'me');clearInput();go(cfg.go);});
  var sk=f.querySelector('[data-skip]');if(sk)sk.addEventListener('click',function(){D[cfg.key]='';add('Пропустить','me');clearInput();go(cfg.go);});
  var bk=f.querySelector('[data-back]');if(bk)bk.addEventListener('click',function(){add('Назад','me');clearInput();go(cfg.back);});
  setTimeout(function(){el.focus({preventScroll:true});},30);
}
var CALL={t:'Позвонить сейчас',href:'tel:'+CFG.tel,cls:'primary'};
var HOME={t:'В начало',go:'start',cls:'quiet'};
var N={
  start:function(){D={};return{say:['Здравствуйте! Я помощник адвоката Ивана Юрьевича Негнюрова.','Подскажу первые шаги и помогу записаться на консультацию. Что у вас случилось?'],
    opts:[{t:'Задержали близкого',go:'detained'},{t:'Проводят обыск',go:'search'},{t:'Вызывают на допрос',go:'summons'},{t:'Уголовное дело',go:'criminal'},{t:'Гражданский спор',go:'civil'},{t:'Нужен документ',go:'doc'},{t:'Записаться на консультацию',go:'book',cls:'primary'},{t:'Другой вопрос',go:'faq'}]};},
  detained:{set:{topic:'Задержание близкого'},say:['Сейчас главное: позвонить адвокату. Защитник вправе участвовать с момента фактического задержания подозреваемого.'+law('п. 3 ч. 3 ст. 49 УПК РФ'),'Задержанный вправе отказаться от показаний. Не передавайте деньги тем, кто обещает «решить вопрос».'+law('ст. 51 Конституции РФ')],
    opts:[CALL,{t:'Заказать срочный звонок',go:'urgent'},{t:'Памятка: первые часы',href:'#first-hours'},HOME]},
  search:{set:{topic:'Обыск'},say:['Не мешайте обыску физически и сразу позвоните адвокату: он вправе присутствовать при обыске.'+law('ч. 11 ст. 182 УПК РФ'),'Попросите показать постановление, следите за тем, что вносят в протокол, и получите его копию.'],
    opts:[CALL,{t:'Заказать срочный звонок',go:'urgent'},{t:'Памятка при обыске',href:'#search'},HOME]},
  summons:{set:{topic:'Вызов на допрос'},say:['Свидетель вправе явиться на допрос с адвокатом. Лучше обсудить вызов до явки, а не после.'+law('п. 6 ч. 4 ст. 56 УПК РФ'),'Сохраните повестку или запишите, кто, куда и когда вызывает.'],
    opts:[{t:'Записаться на консультацию',go:'format',cls:'primary'},CALL,HOME]},
  criminal:{set:{topic:'Уголовное дело'},say:['Защиту можно подключить на любой стадии: проверка сообщения о преступлении, следствие, суд, апелляция и кассация.'],
    opts:[{t:'Записаться на консультацию',go:'format',cls:'primary'},CALL,HOME]},
  civil:{set:{topic:'Гражданский спор'},say:['Веду споры по договорам и долгам, семейные, жилищные и наследственные дела, возмещение вреда.','Проверьте сроки: апелляционная жалоба подаётся в течение месяца со дня принятия решения в окончательной форме.'+law('ч. 1 ст. 321 ГПК РФ')],
    opts:[{t:'Записаться на консультацию',go:'format',cls:'primary'},HOME]},
  doc:{set:{topic:'Подготовка документа'},say:['Подготовлю иск, отзыв, жалобу, ходатайство или претензию. В заявке укажите срок подачи; документы можно будет прислать на почту.'],
    opts:[{t:'Оставить заявку',go:'format',cls:'primary'},HOME]},
  faq:{say:['Выберите вопрос:'],opts:[{t:'Сколько стоит помощь?',go:'fPrice'},{t:'Можете гарантировать результат?',go:'fGuar'},{t:'Уже есть адвокат по назначению',go:'fApp'},{t:'Это конфиденциально?',go:'fSecret'},{t:'Где проходит консультация?',go:'fWhere'},HOME]},
  fPrice:{say:['Размер вознаграждения фиксируется в соглашении до начала работы и зависит от сложности дела, стадии и объёма. Стоимость обсуждается на консультации, до заключения соглашения.'],opts:'faqEnd'},
  fGuar:{say:['Нет. Честно обещать результат нельзя: исход зависит от доказательств, позиции сторон и решения суда. Адвокат использует все законные средства защиты и объясняет риски.'],opts:'faqEnd'},
  fApp:{say:['Можно пригласить защитника по соглашению. Как это повлияет на участие защитника по назначению, обсудим на консультации.'+law('ч. 1 ст. 50 УПК РФ')],opts:'faqEnd'},
  fSecret:{say:['Да. Сведения, которые вы сообщите адвокату при обращении за юридической помощью, составляют адвокатскую тайну, в том числе до заключения соглашения.'+law('ст. 8 ФЗ «Об адвокатской деятельности и адвокатуре в РФ»')],opts:'faqEnd'},
  fWhere:{say:['Встреча проходит в Якутске по предварительной договорённости. Можно также начать с консультации по телефону.'],opts:'faqEnd'},
  book:function(){D.flow='book';if(D.topic)return{go:'format'};return{say:['По какому вопросу нужна консультация?'],opts:[{t:'Уголовное дело',go:'format',set:{topic:'Уголовное дело'}},{t:'Гражданский спор',go:'format',set:{topic:'Гражданский спор'}},{t:'Документ',go:'format',set:{topic:'Подготовка документа'}},{t:'Другое',go:'format',set:{topic:'Другое'}}]};},
  format:function(){D.flow='book';return{say:['Как вам удобнее?'],opts:[{t:'Встреча в Якутске',go:'when',set:{format:'Встреча в Якутске'}},{t:'Консультация по телефону',go:'when',set:{format:'Консультация по телефону'}},{t:'Пока не знаю',go:'when',set:{format:'Обсудить при звонке'}}]};},
  when:{say:['Когда вам удобно?'],opts:[{t:'Сегодня',go:'time',set:{day:'Сегодня'}},{t:'Завтра',go:'time',set:{day:'Завтра'}},{t:'В ближайшие дни',go:'time',set:{day:'В ближайшие дни'}},{t:'Выбрать дату',go:'date'}]},
  date:function(){var t=new Date(),iso=new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10);
    return{ask:{key:'day',type:'date',label:'Удобная дата',attrs:'min="'+iso+'"',go:'time',back:'when',check:function(v){return v?'':'Выберите дату.';},echo:function(v){var p=v.split('-');return p[2]+'.'+p[1]+'.'+p[0];}}};},
  time:{say:['В какое время?'],opts:[{t:'Утром, до 12:00',go:'name',set:{time:'Утром, до 12:00'}},{t:'Днём, с 12:00 до 17:00',go:'name',set:{time:'Днём, с 12:00 до 17:00'}},{t:'Вечером, после 17:00',go:'name',set:{time:'Вечером, после 17:00'}},{t:'В любое время',go:'name',set:{time:'В любое время'}}]},
  urgent:function(){D.flow='urgent';D.format='Срочный звонок';D.day='Как можно скорее';D.time='';return{say:['Оставьте имя и телефон, заявка уйдёт адвокату на почту. Если ситуация не терпит, лучше позвонить сразу: '+'<a href="tel:'+CFG.tel+'">'+CFG.telText+'</a>.'],go:'name'};},
  name:{say:['Как к вам обращаться?'],ask:{key:'name',type:'text',label:'Имя',ph:'Анна Петровна',attrs:'autocomplete="name" maxlength="80"',go:'phone',check:function(v){return v.length>1?'':'Укажите имя.';}}},
  phone:{say:['Номер телефона для связи:'],ask:{key:'phone',type:'tel',label:'Телефон',ph:'+7 9__ ___-__-__',attrs:'autocomplete="tel" inputmode="tel" maxlength="20"',go:'note',check:function(v){var d=v.replace(/\D/g,'');return d.length>=10&&d.length<=11?'':'Укажите номер из 10 или 11 цифр.';}}},
  note:{say:['Коротко опишите ситуацию. Это поможет подготовиться к разговору.'],ask:{key:'note',type:'textarea',label:'Суть вопроса (необязательно)',ph:'Что произошло, когда, есть ли срок: заседание, повестка',go:'confirm',skip:true}},
  confirm:function(){
    var rows=[['Вопрос',D.topic||'Не указан'],['Формат',D.format||''],['Когда',[D.day,D.time].filter(Boolean).join(', ')],['Имя',D.name],['Телефон',D.phone]];if(D.note)rows.push(['Суть',D.note]);
    var html='Проверьте заявку:<dl>'+rows.map(function(r){return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>';}).join('')+'</dl>';
    return{sayHtml:[[html,'sum']],custom:'consent'};},
  faqEnd:null
};
var FAQEND=[{t:'Записаться на консультацию',go:'book',cls:'primary'},{t:'Другой вопрос',go:'faq'},HOME];
function payload(){
  var subj=(D.flow==='urgent'?'СРОЧНО: ':'')+'Заявка с сайта: '+(D.topic||'консультация')+', '+D.name;
  var f={'Вопрос':D.topic||'Не указан','Формат':D.format||'','Когда удобно':[D.day,D.time].filter(Boolean).join(', '),'Имя':D.name,'Телефон':D.phone,'Суть вопроса':D.note||'Не указана','Источник':'Помощник на сайте'};
  return{subject:subj,fields:f,honey:(cb.querySelector('.hp input')||{}).value};
}
function consentStep(){
  clearInput();
  var f=document.createElement('form');f.className='cb-form';f.noValidate=true;
  f.innerHTML='<label class="cb-consent"><input type="checkbox" id="cb-ok"><span>Соглашаюсь на обработку персональных данных в соответствии с <a href="#privacy" data-priv>политикой</a>.</span></label><span class="err" aria-live="polite"></span><span class="hp" aria-hidden="true"><input type="text" tabindex="-1" autocomplete="off"></span><div class="row"><button class="cb-opt primary" type="submit">Отправить заявку</button><button class="cb-opt quiet" type="button" data-edit>Изменить</button></div>';
  inp.appendChild(f);
  f.querySelector('[data-priv]').addEventListener('click',function(){var p=document.getElementById('privacy');if(p)p.open=true;if(innerWidth<=700)close();});
  f.querySelector('[data-edit]').addEventListener('click',function(){add('Изменить','me');clearInput();go(D.flow==='urgent'?'name':'format');});
  f.addEventListener('submit',function(e){e.preventDefault();
    if(!f.querySelector('#cb-ok').checked){f.querySelector('.err').textContent='Отметьте согласие, чтобы отправить заявку.';return;}
    add('Отправить заявку','me');clearInput();busy=true;
    var p=payload(),ty=add('<i></i><i></i><i></i>','bot','typing');
    send(p).then(function(){ty.remove();busy=false;
      say(['Заявка отправлена адвокату на почту. Он свяжется с вами по номеру '+esc(D.phone)+'.'].concat(D.flow==='urgent'?['Если ситуация срочная, не ждите ответа и позвоните: <a href="tel:'+CFG.tel+'">'+CFG.telText+'</a>.']:[]),function(){opts([CALL,HOME]);});
    }).catch(function(){ty.remove();busy=false;
      say(['Не получилось отправить заявку автоматически. Отправьте её через почтовую программу (текст уже заполнен) или позвоните.'],function(){opts([{t:'Отправить через почту',href:mailtoHref(p),cls:'primary'},CALL,{t:'Попробовать ещё раз',go:'confirm'}]);});
    });
  });
  setTimeout(function(){var c=f.querySelector('#cb-ok');if(c)c.focus({preventScroll:true});},30);
}
function go(id){
  var n=N[id];if(typeof n==='function')n=n();if(!n)return;
  if(n.set)Object.keys(n.set).forEach(function(k){D[k]=n.set[k];});
  if(n.go&&!n.say&&!n.opts&&!n.ask){go(n.go);return;}
  var after=function(){
    if(n.sayHtml)n.sayHtml.forEach(function(x){add(x[0],'bot',x[1]);});
    if(n.custom==='consent')return consentStep();
    if(n.ask)return ask(n.ask);
    if(n.opts)return opts(n.opts==='faqEnd'?FAQEND:n.opts);
    if(n.go)return go(n.go);
  };
  if(n.say)say(n.say,after);else after();
}
function open(target){
  cb.hidden=false;launch&&launch.setAttribute('aria-expanded','true');
  if(!RM&&cb.animate)cb.animate([{opacity:0,transform:'translateY(16px) scale(.98)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
  if(target&&target!=='start'){if(started){add(target==='book'?'Записаться на консультацию':'В начало','me');}started=true;clearInput();go(target);}
  else if(!started){started=true;go('start');}
  setTimeout(function(){var f=inp.querySelector('input,textarea,button,a')||document.getElementById('cb-x');f&&f.focus({preventScroll:true});},60);
}
function close(){cb.hidden=true;launch&&launch.setAttribute('aria-expanded','false');if(launch&&getComputedStyle(launch).display!=='none')launch.focus({preventScroll:true});}
launch&&launch.addEventListener('click',function(){cb.hidden?open():close();});
document.getElementById('cb-x').addEventListener('click',close);
cb.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
[].forEach.call(document.querySelectorAll('[data-chat]'),function(b){b.addEventListener('click',function(e){e.preventDefault();open(b.getAttribute('data-chat'));});});
})();

(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- Весы Фемиды: 3D-рендер на canvas ---------- */
var CX=240,D=1100;
function P(x,y,z){var s=D/(D-z);return[CX+x*s,240+(y-240)*s,s];}
function gold(c,x0,x1,hl){var g=c.createLinearGradient(x0,0,x1,0);
  g.addColorStop(0,'rgb(77,46,13)');g.addColorStop(Math.max(.05,hl-.28),'rgb(158,107,31)');
  g.addColorStop(hl,'rgb(255,230,140)');g.addColorStop(Math.min(.95,hl+.18),'rgb(204,148,46)');
  g.addColorStop(1,'rgb(71,41,10)');return g;}
function edge(c,w){c.strokeStyle='rgba(51,28,5,.85)';c.lineWidth=w;c.stroke();}
function E(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,Math.max(ry,.1),0,0,Math.PI*2);}
function drawScales(c,th,glow){
  if(glow){var rg=c.createRadialGradient(CX,230,10,CX,230,230);rg.addColorStop(0,'rgba(255,204,102,.20)');rg.addColorStop(1,'rgba(255,204,102,0)');c.fillStyle=rg;c.fillRect(0,0,480,480);}
  var hl=.5+.32*Math.sin(th),phi=.045*Math.sin(2*th),L=150,PY=118,dx=Math.cos(th),dz=Math.sin(th),CH=150,R=58;
  var pans=[-1,1].map(function(sg){var x=sg*L*Math.cos(phi)*dx,z=sg*L*Math.cos(phi)*dz,y=PY+sg*L*Math.sin(phi)-6;return{e:[x,y,z],c:[x,y+CH,z],k:sg>0};});
  function pan(p){
    var a=P(p.c[0],p.c[1],p.c[2]),sx=a[0],sy=a[1],s=a[2],h=P(p.e[0],p.e[1],p.e[2]),hx=h[0],hy=h[1];
    var rx=R*s,ry=rx*.24,pts=[];
    for(var j=0;j<3;j++){var an=j*2*Math.PI/3+(p.k?Math.PI/6:-Math.PI/6)+th;var q=P(p.c[0]+R*.96*Math.cos(an),p.c[1],p.c[2]+R*.96*Math.sin(an));pts.push([q[0],q[1],Math.sin(an)]);}
    function chain(px,py){
      c.beginPath();c.moveTo(hx,hy);c.lineTo(px,py);c.strokeStyle='rgba(140,97,26,.9)';c.lineWidth=2.2*s;c.stroke();
      c.beginPath();c.moveTo(hx,hy);c.lineTo(px,py);c.strokeStyle='rgba(255,219,128,.95)';c.lineWidth=.9*s;c.stroke();
      c.fillStyle='rgba(255,224,140,.9)';
      for(var t=1;t<12;t++){var u=t/12;c.beginPath();c.arc(hx+(px-hx)*u,hy+(py-hy)*u,1.1*s,0,Math.PI*2);c.fill();}
    }
    pts.forEach(function(q){if(q[2]<0)chain(q[0],q[1]);});
    c.beginPath();c.moveTo(sx-rx,sy);c.bezierCurveTo(sx-rx,sy+rx*.62,sx+rx,sy+rx*.62,sx+rx,sy);
    c.ellipse(sx,sy,rx,ry,0,0,Math.PI,false);c.closePath();c.fillStyle=gold(c,sx-rx,sx+rx,hl);c.fill();edge(c,1);
    E(c,sx,sy,rx,ry);var g=c.createLinearGradient(sx-rx,0,sx+rx,0);
    g.addColorStop(0,'rgb(89,56,15)');g.addColorStop(1-hl,'rgb(191,140,51)');g.addColorStop(1,'rgb(77,46,13)');
    c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,230,153,.9)';c.lineWidth=1.6;c.stroke();
    pts.forEach(function(q){if(q[2]>=0)chain(q[0],q[1]);});
    c.beginPath();c.arc(hx,hy+3,4*s,0,Math.PI*2);c.fillStyle=gold(c,hx-5,hx+5,hl);c.fill();
  }
  var ord=pans[0].c[2]<pans[1].c[2]?[0,1]:[1,0];
  pan(pans[ord[0]]);
  [[440,92,16,14],[420,74,13,10],[404,58,11,8]].forEach(function(b){var y=b[0],rx=b[1],ry=b[2],h=b[3];
    c.beginPath();c.moveTo(CX-rx,y-h);c.lineTo(CX-rx,y);c.ellipse(CX,y,rx,ry,0,Math.PI,0,true);c.lineTo(CX+rx,y-h);
    c.ellipse(CX,y-h,rx,ry,0,0,Math.PI,false);c.closePath();c.fillStyle=gold(c,CX-rx,CX+rx,hl);c.fill();edge(c,1);
    E(c,CX,y-h,rx,ry);c.fillStyle=gold(c,CX-rx,CX+rx,1-hl);c.fill();edge(c,.8);});
  c.beginPath();c.moveTo(CX-56,396);c.bezierCurveTo(CX-50,360,CX-14,352,CX-11,320);c.lineTo(CX+11,320);
  c.bezierCurveTo(CX+14,352,CX+50,360,CX+56,396);c.closePath();c.fillStyle=gold(c,CX-56,CX+56,hl);c.fill();edge(c,1);
  c.beginPath();c.moveTo(CX-10,322);c.lineTo(CX-6,PY+4);c.lineTo(CX+6,PY+4);c.lineTo(CX+10,322);c.closePath();
  c.fillStyle=gold(c,CX-10,CX+10,hl);c.fill();edge(c,1);
  [[318,16,5],[262,13,5],[200,11,4.5],[150,10,4]].forEach(function(k){E(c,CX,k[0],k[1],k[2]+3);c.fillStyle=gold(c,CX-k[1],CX+k[1],hl);c.fill();edge(c,.8);});
  var N=40,bp=[],i;
  for(i=0;i<=N;i++){var u=-1+2*i/N;bp.push(P(u*L*Math.cos(phi)*dx,PY+u*L*Math.sin(phi)-10*u*u,u*L*Math.cos(phi)*dz));}
  function tk(i){return 3.2+2.8*(1-Math.abs(-1+2*i/N));}
  c.beginPath();for(i=0;i<=N;i++){var q=bp[i];if(i)c.lineTo(q[0],q[1]-tk(i)*q[2]);else c.moveTo(q[0],q[1]-tk(i)*q[2]);}
  for(i=N;i>=0;i--){c.lineTo(bp[i][0],bp[i][1]+tk(i)*bp[i][2]);}c.closePath();
  var xs=bp.map(function(q){return q[0];});c.fillStyle=gold(c,Math.min.apply(0,xs)-1,Math.max.apply(0,xs)+1,hl);c.fill();edge(c,.9);
  [bp[0],bp[N]].forEach(function(q){c.beginPath();c.arc(q[0],q[1],5.2*q[2],0,Math.PI*2);c.fillStyle=gold(c,q[0]-6,q[0]+6,hl);c.fill();edge(c,.8);});
  c.beginPath();c.arc(CX,PY,9,0,Math.PI*2);c.fillStyle=gold(c,CX-9,CX+9,hl);c.fill();edge(c,1);
  c.beginPath();c.moveTo(CX-6,PY-6);c.bezierCurveTo(CX-9,PY-24,CX-2,PY-34,CX,PY-52);c.bezierCurveTo(CX+2,PY-34,CX+9,PY-24,CX+6,PY-6);c.closePath();
  c.fillStyle=gold(c,CX-9,CX+9,hl);c.fill();edge(c,.9);
  c.beginPath();c.arc(CX,PY-22,5,0,Math.PI*2);c.fillStyle=gold(c,CX-5,CX+5,1-hl);c.fill();
  pan(pans[ord[1]]);
}
function fit(cv,dprMax){var r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,dprMax),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}return{w:w,h:h,d:d,cw:r.width,ch:r.height};}
function paintScales(cv,th,glow){if(!cv)return;var f=fit(cv,2);var c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,f.w,f.h);c.setTransform(f.w/480,0,0,f.h/480,0,0);drawScales(c,th,glow);}

/* ---------- Полярное сияние, звёзды, лёд ---------- */
function start(){
  var logo=document.getElementById('logo');if(!logo||!logo.getContext)return;
  var last=0,t0=performance.now();
  function draw(now){paintScales(logo,(now-t0)/1000*2*Math.PI/9+.35,false);}
  if(RM){draw(t0);return;}
  function loop(now){requestAnimationFrame(loop);if(document.hidden)return;if(now-last<33)return;last=now;try{draw(now);}catch(e){}}
  requestAnimationFrame(loop);
}
function reveal(){
  if(RM||!('IntersectionObserver' in window)||!document.body.animate)return;
  var els=[].slice.call(document.querySelectorAll('.sec-head,.area,.memo li,.slist li,.process li,.facts,.about-text,.faq>details,.contact-side,#f,.triage,.triage-intro,.fee,.search-grid>div:first-child,.about-photo'));
  var vh=innerHeight,pend=[];
  els.forEach(function(el){if(el.getBoundingClientRect().top>vh*.9){el.style.opacity='0';pend.push(el);}});
  var io=new IntersectionObserver(function(es){var n=0;es.forEach(function(en){if(!en.isIntersecting)return;var el=en.target;io.unobserve(el);
    el.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:800,delay:Math.min(n++,5)*70,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});el.style.opacity='';});},{rootMargin:'0px 0px -6% 0px'});
  pend.forEach(function(el){io.observe(el);});
  setTimeout(function(){pend.forEach(function(el){if(el.style.opacity==='0'){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.style.opacity='';}});},2500);
  addEventListener('scroll',function chk(){/* страховка: всё, что уже выше экрана, показываем */pend.forEach(function(el){if(el.style.opacity==='0'&&el.getBoundingClientRect().bottom<innerHeight*.5)el.style.opacity='';});},{passive:true});
  var hc=document.querySelectorAll('.hero-copy>*');[].forEach.call(hc,function(el,i){el.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:900,delay:120+i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});});
}
try{start();}catch(e){}
try{reveal();}catch(e){}
})();

'use strict';
(() => {
  const PREFIX='arianas-', PREF=PREFIX+'privacy-v1', DAY=86400000;
  const durations={'arianas-cart':30,'arianas-profile':90,'arianas-orders':90};
  const remove=key=>{try{localStorage.removeItem(key)}catch{}};
  const readRaw=key=>{try{return JSON.parse(localStorage.getItem(key))}catch{return null}};
  let prefs=readRaw(PREF);
  if(!prefs||prefs.version!==1||!Number.isFinite(prefs.expires)||prefs.expires<=Date.now()) {prefs=null;remove(PREF)}
  const allowed=key=>Boolean(prefs?.[key==='arianas-cart'?'cart':'personal']);
  for(const key of Object.keys(durations))if(!allowed(key))remove(key);
  const storage={
    read(key,fallback){
      if(!allowed(key))return fallback;
      const item=readRaw(key);
      if(!item||!Number.isFinite(item.expires)||item.expires<=Date.now()){remove(key);return fallback}
      return item.value??fallback;
    },
    write(key,value){
      if(!allowed(key)){remove(key);return true}
      try{localStorage.setItem(key,JSON.stringify({value,expires:Date.now()+durations[key]*DAY}));return true}catch{return false}
    },remove
  };
  const markup=`
  <aside class="privacy-banner" id="privacyBanner" aria-labelledby="privacyBannerTitle" hidden>
    <div><h2 id="privacyBannerTitle">Запомнить ваш выбор?</h2><p>Можем сохранить корзину, профиль и историю на этом устройстве. Аналитику и рекламные трекеры мы не подключаем. <a href="/cookies.html">Подробнее о cookies</a></p></div>
    <div class="privacy-banner-actions"><button class="button outline" data-privacy-choice="no">Без сохранения</button><button class="button outline" data-privacy-choice="yes">Разрешить сохранение</button><button class="inline-link" data-privacy-open>Настроить отдельно</button></div>
  </aside>
  <dialog id="privacySettings" class="privacy-dialog" aria-labelledby="privacyTitle">
    <div class="dialog-head"><h2 id="privacyTitle">Ваши данные</h2><button type="button" class="close" data-privacy-close>Закрыть</button></div>
    <p>Вы решаете, что останется на этом устройстве после закрытия страницы.</p>
    <div class="privacy-option"><div><strong>Необходимые настройки</strong><p>Запоминают ваш выбор конфиденциальности на 180 дней. В памяти браузера работают текущая корзина и формы.</p></div><span class="privacy-required">Всегда</span></div>
    <label class="privacy-option"><div><strong>Запоминать корзину</strong><p>Состав и количество — на 30 дней с последнего изменения.</p></div><input type="checkbox" id="rememberCart" aria-label="Запоминать корзину"></label>
    <label class="privacy-option"><div><strong>Сохранять профиль и историю</strong><p>Имя, контакт и подготовленные заказы — на 90 дней с последнего сохранения. На общем устройстве лучше отключить.</p></div><input type="checkbox" id="rememberPersonal" aria-label="Сохранять профиль и историю"></label>
    <p class="privacy-explanation">Эти переключатели разрешают только сохранение в вашем браузере. Они не являются согласием на рекламу или отправку данных продавцу. <a href="/personal-data.html">Подробнее об обработке данных</a>.</p>
    <button class="button dark full" id="savePrivacy">Сохранить настройки</button>
    <p class="privacy-feedback" id="privacyFeedback" role="status"></p>
    <div class="privacy-delete"><h3>Удалить данные</h3><p>Корзина, профиль и история исчезнут из этого браузера. Сообщения, которые вы уже отправили в Telegram, останутся там.</p><button class="button outline full" id="showDelete">Удалить данные с устройства</button><div id="deleteConfirm" hidden><p><strong>Удалить корзину, профиль и историю?</strong> Восстановить их не получится.</p><div class="privacy-confirm-actions"><button class="button outline" id="cancelDelete">Оставить</button><button class="button dark" id="confirmDelete">Удалить всё</button></div></div></div>
  </dialog>`;
  document.body.insertAdjacentHTML('beforeend',markup);
  const dialog=document.getElementById('privacySettings'),banner=document.getElementById('privacyBanner'),feedback=document.getElementById('privacyFeedback');
  const emit=type=>window.dispatchEvent(new Event(type));
  function showBanner(show){banner.hidden=!show;document.body.classList.toggle('privacy-prompt',show)}
  function save(cart,personal){
    prefs={version:1,cart,personal,chosen:new Date().toISOString(),expires:Date.now()+180*DAY};
    let saved=true;try{localStorage.setItem(PREF,JSON.stringify(prefs))}catch{saved=false}
    for(const key of Object.keys(durations))if(!allowed(key))remove(key);
    emit('arianas-privacy-change');showBanner(false);return saved;
  }
  function openSettings(){
    document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    document.getElementById('rememberCart').checked=!!prefs?.cart;document.getElementById('rememberPersonal').checked=!!prefs?.personal;
    feedback.textContent='';document.getElementById('deleteConfirm').hidden=true;dialog.showModal();document.body.classList.add('modal-open');
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-privacy-open]'))openSettings();
    if(e.target.closest('[data-privacy-delete]')){openSettings();document.getElementById('deleteConfirm').hidden=false;document.getElementById('confirmDelete').focus()}
    const choice=e.target.closest('[data-privacy-choice]');if(choice){const yes=choice.dataset.privacyChoice==='yes';save(yes,yes)}
  });
  dialog.querySelector('[data-privacy-close]').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open')});
  document.getElementById('savePrivacy').onclick=()=>{const ok=save(document.getElementById('rememberCart').checked,document.getElementById('rememberPersonal').checked);feedback.textContent=ok?'Настройки сохранены.':'Выбор действует сейчас. Браузер не разрешил сохранить его для следующего посещения.'};
  document.getElementById('showDelete').onclick=()=>{document.getElementById('deleteConfirm').hidden=false;document.getElementById('confirmDelete').focus()};
  document.getElementById('cancelDelete').onclick=()=>{document.getElementById('deleteConfirm').hidden=true;document.getElementById('showDelete').focus()};
  document.getElementById('confirmDelete').onclick=()=>{
    save(false,false);for(const key of Object.keys(durations))remove(key);
    emit('arianas-data-cleared');document.getElementById('rememberCart').checked=false;document.getElementById('rememberPersonal').checked=false;
    document.getElementById('deleteConfirm').hidden=true;feedback.textContent='Корзина, профиль и история удалены. Сохранение отключено.';document.getElementById('showDelete').focus();
  };
  window.addEventListener('storage',e=>{if(e.key!==PREF)return;const next=readRaw(PREF);prefs=next&&next.version===1&&next.expires>Date.now()?next:null;if(!prefs?.cart&&!prefs?.personal)emit('arianas-data-cleared');emit('arianas-privacy-change')});
  window.ArianaPrivacy={storage,get:()=>({...prefs}),open:openSettings};
  showBanner(!prefs);
  if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
})();

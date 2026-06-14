(function(){
  var path=(window.location.pathname || '').toLowerCase();
  if(path.indexOf('/donate') !== -1){return;}

  var storageKey='ehfDonationPopupChoice';
  var now=Date.now();
  var existing=null;
  try{ existing=JSON.parse(localStorage.getItem(storageKey) || 'null'); }catch(e){ existing=null; }
  if(existing && existing.expires && now < existing.expires){return;}

  function remember(days, choice){
    try{localStorage.setItem(storageKey, JSON.stringify({choice:choice, expires:Date.now() + days*24*60*60*1000}));}catch(e){}
  }

  function closePopup(days, choice){
    remember(days, choice);
    var overlay=document.getElementById('donationPopupOverlay');
    if(overlay){
      overlay.classList.remove('open');
      document.body.classList.remove('donation-popup-active');
      window.setTimeout(function(){overlay.remove();},260);
    }
  }

  function createPopup(){
    if(document.getElementById('donationPopupOverlay')){return;}
    var overlay=document.createElement('div');
    overlay.className='donation-popup-overlay';
    overlay.id='donationPopupOverlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','donationPopupTitle');
    overlay.innerHTML='\
      <div class="donation-popup-card">\
        <button class="donation-popup-close" type="button" aria-label="Close donation message"><i class="fas fa-times"></i></button>\
        <img class="donation-popup-logo" src="ehf-logo.jpg" alt="EHF Logo"/>\
        <h2 id="donationPopupTitle">Help EHF keep spreading hope</h2>\
        <p>Your support helps Emmanuel Humanitarian Foundation provide aid, education, peacebuilding, health support, and community development to vulnerable communities in Nigeria.</p>\
        <div class="donation-popup-actions">\
          <a class="donation-popup-primary" href="donate">Support EHF</a>\
          <button class="donation-popup-secondary" type="button" data-popup-choice="donated">I\'ve donated recently</button>\
          <button class="donation-popup-secondary" type="button" data-popup-choice="not-now">Not now, thank you</button>\
        </div>\
      </div>';
    document.body.appendChild(overlay);
    document.body.classList.add('donation-popup-active');
    window.setTimeout(function(){overlay.classList.add('open');},30);

    overlay.querySelector('.donation-popup-close').addEventListener('click',function(){closePopup(7,'closed');});
    overlay.querySelector('[data-popup-choice="donated"]').addEventListener('click',function(){closePopup(30,'donated');});
    overlay.querySelector('[data-popup-choice="not-now"]').addEventListener('click',function(){closePopup(7,'not-now');});
    overlay.addEventListener('click',function(e){if(e.target===overlay){closePopup(7,'outside-click');}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){closePopup(7,'escape');}});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){window.setTimeout(createPopup,1400);});
  }else{
    window.setTimeout(createPopup,1400);
  }
})();

(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const waNumber = '38267213274';
  const messages = {
    general: "Merhaba, Karadağ'a taşınma hakkında bilgi almak istiyorum. KSI Montenegro Türkçe aileler sayfasından yazıyorum.",
    language: 'Merhaba, KSI Montenegro Türkçe aileler sayfasından yazıyorum. Çocuğumun İngilizce desteği ve okula başlangıcı hakkında konuşmak istiyorum.',
    parent: 'Merhaba, KSI Montenegro Türkçe aileler sayfasından yazıyorum. Okulunuzdaki bir Türk veliyle tanışmak istiyorum.'
  };
  const waUrl = message => `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    link.href = waUrl(messages[link.dataset.whatsapp] || messages.general);
    link.addEventListener('click', () => measure('WhatsAppClick', link.dataset.whatsapp));
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const photos = [...document.querySelectorAll('.photo')];
  const panels = [...document.querySelectorAll('.photo-panel')];
  const activePanels = new Set();
  const hero = document.querySelector('.hero');
  const parallax = document.querySelector('.hero-parallax');
  const sticky = document.querySelector('.mobile-contact');
  let ticking = false;

  // Reveal the photograph and its value statement once. Reading sections stay still.
  if ('IntersectionObserver' in window) {
    if (!reduced.matches) document.documentElement.classList.add('motion-ready');
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-entered');
          reveal.unobserve(entry.target);
        }
      });
    }, {threshold: .14, rootMargin: '0px 0px -6% 0px'});
    photos.forEach(photo => reveal.observe(photo));
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activePanels.add(entry.target);
        else activePanels.delete(entry.target);
        entry.target.classList.toggle('is-inview', entry.isIntersecting);
      });
      scheduleScroll();
    }, {rootMargin: '10% 0px'});
    panels.forEach(panel => visibility.observe(panel));
  } else photos.forEach(photo => photo.classList.add('is-entered'));

  function scrollUpdate() {
    const y = window.scrollY;
    const heroHeight = hero.offsetHeight;
    // Read geometry together, then write transforms. Overscan prevents empty edges.
    const positions = !reduced.matches ? [...activePanels].map(panel => {
      const rect = panel.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      return {media: panel.querySelector('.photo-media'), offset: (progress - .5) * rect.height * .08};
    }) : [];
    if (!reduced.matches && y <= heroHeight) parallax.style.transform = `translate3d(0,${Math.min(y,heroHeight)*.12}px,0)`;
    positions.forEach(({media, offset}) => media.style.transform = `translate3d(0,${offset.toFixed(2)}px,0)`);
    sticky.classList.toggle('at-hero', y < heroHeight * .8);
    ticking = false;
  }
  function scheduleScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(scrollUpdate); }
  }
  function updateMotionPreference() {
    const animate = !reduced.matches && 'IntersectionObserver' in window;
    document.documentElement.classList.toggle('motion-ready', animate);
    if (!animate) {
      photos.forEach(photo => photo.classList.add('is-entered'));
      parallax.style.removeProperty('transform');
      panels.forEach(panel => panel.querySelector('.photo-media').style.removeProperty('transform'));
    }
    scheduleScroll();
  }
  reduced.addEventListener('change', updateMotionPreference);
  window.addEventListener('scroll', scheduleScroll, {passive:true});
  window.addEventListener('resize', scheduleScroll, {passive:true});
  updateMotionPreference();
  scrollUpdate();

  const contact = document.getElementById('contact-dialog');
  const privacy = document.getElementById('privacy-dialog');
  const cookies = document.getElementById('cookie-dialog');
  const form = document.getElementById('contact-form');
  let mode = 'visit';
  const dateInput = form.elements.date;
  const dateToday = new Date();
  dateToday.setMinutes(dateToday.getMinutes() - dateToday.getTimezoneOffset());
  dateInput.min = dateToday.toISOString().slice(0,10);

  function showDialog(type) {
    if (type === 'privacy') { if (!privacy.open) privacy.showModal(); return; }
    if (type === 'cookies') { if (!cookies.open) cookies.showModal(); return; }
    mode = type === 'callback' ? 'callback' : 'visit';
    const visit = mode === 'visit';
    document.getElementById('contact-title').textContent = visit ? 'Okulu birlikte gezelim.' : 'Sizi Türkçe arayalım.';
    document.getElementById('contact-intro').textContent = visit ? 'Tercih ettiğiniz günü bize iletin. Ziyaret saatini WhatsApp’ta birlikte netleştirelim.' : 'Size uygun zamanı bize iletin. Türkçe konuşan ekibimizle iletişime geçelim.';
    document.getElementById('date-label').hidden = !visit;
    document.getElementById('time-label').hidden = visit;
    dateInput.required = visit;
    dateInput.disabled = !visit;
    form.elements.time.disabled = visit;
    form.querySelector('.form-submit').textContent = visit ? 'Ziyaret talebini WhatsApp’tan gönder' : 'Arama talebini WhatsApp’tan gönder';
    form.querySelector('.form-note').textContent = visit ? 'WhatsApp açılır; mesajı siz gönderirsiniz. Ziyaretiniz okulun teyidiyle kesinleşir.' : 'WhatsApp açılır; mesajı siz gönderirsiniz. Talebiniz gönderildikten sonra ekibimizle görüşebilirsiniz.';
    if (!contact.open) contact.showModal();
  }
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => showDialog(button.dataset.open)));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const date = data.get('date');
    const dateLabel = date ? new Intl.DateTimeFormat('tr-TR',{dateStyle:'long'}).format(new Date(`${date}T12:00:00`)) : '';
    const message = [
      'Merhaba, KSI Montenegro Türkçe aileler sayfasından yazıyorum.',
      mode === 'visit' ? 'Okulu ziyaret etmek istiyorum.' : 'Türkçe konuşan bir yetkilinizin beni aramasını rica ediyorum.',
      `Adım: ${data.get('name').trim()}`, `Telefon: ${data.get('phone').trim()}`,
      `Çocuğumun yaş aralığı: ${data.get('age')}`,
      mode === 'visit' ? `Tercih ettiğim ziyaret tarihi: ${dateLabel}` : `Uygun olduğum zaman: ${data.get('time') || 'Birlikte belirleyelim'}`,
      `Pazarlama iletişimi onayı: ${data.has('marketing') ? 'Evet, okul haberleri ve etkinlikler hakkında iletişim almak istiyorum.' : 'Hayır.'}`
    ].join('\n');
    window.open(waUrl(message), '_blank', 'noopener');
    measure('WhatsAppClick', mode === 'visit' ? 'visit_request' : 'callback_request');
  });

  // Enabled only by an explicit cookie choice AND a configured Meta Pixel ID.
  let consent = false, pixelId = '', pixelLoaded = false;
  const storedChoice = () => { try { return localStorage.getItem('ksi-measurement-consent'); } catch { return null; } };
  consent = storedChoice() === 'yes';
  document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
    consent = button.dataset.consent === 'yes';
    try { localStorage.setItem('ksi-measurement-consent', consent ? 'yes' : 'no'); } catch {}
    cookies.close();
    if (consent) startPixel(); else if (window.fbq) window.fbq('consent','revoke');
  }));
  function startPixel() {
    if (!consent || !/^\d{5,25}$/.test(pixelId)) return;
    if (pixelLoaded) { if (window.fbq) window.fbq('consent','grant'); return; }
    const f = window;
    if (!f.fbq) {
      const n = f.fbq = function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(script);
    }
    f.fbq('consent','grant'); f.fbq('init',pixelId); pixelLoaded = true;
    measure('PageView','turkish_segment_b');
  }
  function cookieValue(name) {
    return document.cookie.split('; ').find(row=>row.startsWith(`${name}=`))?.slice(name.length+1) || undefined;
  }
  function measure(eventName, placement) {
    if (!consent || !pixelLoaded) return;
    const eventId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const props = {segment:'turkish_relocating_families',placement};
    window.fbq(eventName === 'PageView' ? 'track' : 'trackCustom',eventName,props,{eventID:eventId});
    const payload = {event_name:eventName,event_id:eventId,placement,consent:true,source_url:location.origin+location.pathname,fbp:cookieValue('_fbp'),fbc:cookieValue('_fbc')};
    fetch('/api/meta-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
  }
  if (location.protocol === 'https:' || location.protocol === 'http:') {
    fetch('/api/config').then(r=>r.ok?r.json():null).then(config=>{
      if (!config) return;
      pixelId = config.metaPixelId || '';
      if (pixelId && storedChoice() === null) showDialog('cookies');
      if (consent) startPixel();
      if (config.siteUrl && !document.querySelector('link[rel=canonical]')) {
        const url = new URL('/tr/karadaga-tasinan-aileler',config.siteUrl).href;
        const canonical = document.createElement('link'); canonical.rel='canonical'; canonical.href=url; document.head.appendChild(canonical);
        const alternate = document.createElement('link'); alternate.rel='alternate'; alternate.hreflang='tr'; alternate.href=url; document.head.appendChild(alternate);
      }
    }).catch(()=>{});
  }
})();

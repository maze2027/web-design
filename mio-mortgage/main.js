(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero entrance, once on load
  const hero = document.querySelector('[data-enter]');
  requestAnimationFrame(() => requestAnimationFrame(() => hero && hero.classList.add('is-in')));

  // Sticky nav border
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && setMenu(false));

  // Moment 1: photo widens to full bleed while its section scrolls through
  const frame = document.querySelector('.widen__frame');
  if (frame && !reduce) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = frame.getBoundingClientRect();
      const vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9) - 0.15));
      frame.style.setProperty('--p', p.toFixed(3));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update); update();
  }

  // Moment 2: town names light up in turn as the section enters
  const towns = [...document.querySelectorAll('.towns li')];
  if (towns.length) {
    if (reduce || !('IntersectionObserver' in window)) towns.forEach((t) => t.classList.add('is-lit'));
    else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          towns.forEach((t, i) => setTimeout(() => t.classList.add('is-lit'), i * 110));
          io.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(towns[0].parentElement);
    }
  }

  // Payment calculator
  const calc = document.getElementById('calc');
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const num = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;
  const out = {
    total: document.getElementById('calc-total'), pi: document.getElementById('calc-pi'),
    extra: document.getElementById('calc-extra'), loan: document.getElementById('calc-loan'),
  };
  const run = () => {
    const f = calc.elements;
    const price = num(f.price.value);
    const loan = price * (1 - Math.min(100, num(f.down.value)) / 100);
    const r = num(f.rate.value) / 100 / 12;
    const n = num(f.term.value) * 12;
    const pi = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
    const extra = num(f.tax.value) / 12 + num(f.ins.value) / 12 + num(f.hoa.value);
    out.pi.textContent = money(pi); out.extra.textContent = money(extra);
    out.loan.textContent = money(loan); out.total.textContent = money(pi + extra);
  };
  calc.addEventListener('input', run);
  calc.querySelectorAll('[data-money]').forEach((el) =>
    el.addEventListener('blur', () => { el.value = num(el.value).toLocaleString('en-US'); }));
  calc.addEventListener('submit', (e) => e.preventDefault());
  run();

  // Lead form: validates, then posts to the endpoint in action="" (set before launch)
  const form = document.getElementById('lead');
  const status = form.querySelector('.form__status');
  const check = (input) => {
    const field = input.closest('.field');
    const bad = !input.checkValidity() || (input.required && !input.value.trim());
    field.classList.toggle('has-error', bad);
    field.querySelector('.field__err').hidden = !bad;
    input.setAttribute('aria-invalid', String(bad));
    return !bad;
  };
  form.querySelectorAll('[required]').forEach((i) => i.addEventListener('blur', () => check(i)));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('[required]')];
    const ok = fields.map(check).every(Boolean);
    if (!ok) { fields.find((i) => i.getAttribute('aria-invalid') === 'true').focus(); return; }
    const endpoint = form.getAttribute('action');
    status.className = 'form__status';
    if (!endpoint) {
      // No backend yet: hand off to the visitor's email app instead of faking a send
      const d = new FormData(form);
      const body = [...d.entries()].map(([k, v]) => `${k.replace('_', ' ')}: ${v}`).join('\n');
      location.href = `mailto:hello@miomortgage.example?subject=${encodeURIComponent('Pre-approval request')}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email app should open with your details filled in.';
      return;
    }
    status.textContent = 'Sending…';
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = 'Thanks! A loan officer will call you back the same business day.';
      status.classList.add('ok');
    } catch {
      status.textContent = 'Something went wrong. Please email hello@miomortgage.example instead.';
      status.classList.add('err');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();

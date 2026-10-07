/* ============================================================
   DMart Latur — main behaviour script
   (transitions, navbar, search, cursor, reveals, renderers)
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const D  = window.DMART || {};
  const FINE = window.matchMedia('(pointer: fine)').matches;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. PAGE CURTAIN — loading intro + page transitions
     ============================================================ */
  const curtain = $('#curtain');

  if (curtain) {
    const intro = document.body.dataset.intro === 'true';
    setTimeout(() => curtain.classList.add('is-out'), intro ? 1250 : 400);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !curtain) return;

    const href = a.getAttribute('href');
    if (!href) return;
    if (href.charAt(0) === '#') { e.preventDefault(); return; }
    if (a.target === '_blank' || a.hasAttribute('data-no-transition')) return;
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;

    e.preventDefault();
    curtain.classList.remove('is-out');
    document.body.classList.add('no-scroll');
    window.setTimeout(() => { window.location.href = href; }, 440);
  });

  /* ============================================================
     2. NAVBAR
     ============================================================ */
  const nav = $('#nav');
  const progress = $('#navProgress');
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');
  const page = document.body.dataset.page;

  if (page) {
    $$('.nav__link, .mobile-menu__links a').forEach((l) => {
      if (l.dataset.nav === page) l.classList.add('is-active');
    });
  }

  function closeMenu() {
    document.body.classList.remove('menu-open', 'no-scroll');
  }

  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      document.body.classList.toggle('no-scroll', open);
    });
  }
  $$('#mobileMenu a').forEach((a) => a.addEventListener('click', closeMenu));
  const menuClose = $('#menuClose');
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  /* ============================================================
     3. SCROLL ENGINE (nav state, parallax, statement, experience)
     ============================================================ */
  const heroBg = $('.hero__bg');
  const parallaxEls = $$('[data-parallax]');
  const statement = $('#statement');
  const statementWords = statement ? $$('.w', statement) : [];
  const expMain = $('.exp__main');
  const expStage = $('.exp__stage');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;

    /* navbar */
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    /* hero parallax */
    if (heroBg && y < vh * 1.2) {
      heroBg.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.04)`;
    }

    /* generic parallax */
    parallaxEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const offset = (r.top + r.height / 2 - vh / 2) * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });

    /* cinematic statement — words appear with scroll */
    if (statement && statementWords.length) {
      const r = statement.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        statement.classList.add('is-live');
        const passed = (vh * 0.82 - r.top) / (vh * 0.75 + r.height * 0.18);
        const active = Math.round(Math.max(0, Math.min(1, passed)) * statementWords.length);
        statementWords.forEach((w, i) => w.classList.toggle('on', i < active));
      }
    }

    /* store experience — main image scales while scrolling */
    if (expMain && expStage) {
      const r = expStage.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9)));
        expMain.style.transform = `scale(${(0.88 + p * 0.12).toFixed(3)})`;
      }
    }

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);

  /* ============================================================
     4. SCROLL REVEALS
     ============================================================ */
  function initReveals(root = document) {
    const els = $$('[data-reveal]', root);
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const d = el.dataset.delay;
        if (d) el.style.setProperty('--d', d + 's');
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el); });
  }

  /* auto-stagger children of [data-stagger] */
  $$('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      if (child.hasAttribute('data-reveal')) child.dataset.delay = (i * 0.09).toFixed(2);
    });
  });

  /* ============================================================
     5. CURSOR (desktop only)
     ============================================================ */
  if (FINE && !REDUCED) {
    const ring = $('#cursorRing');
    const dot = $('#cursorDot');
    if (ring && dot) {
      let mx = -100, my = -100, rx = -100, ry = -100;

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        document.body.classList.add('cursor-on');
      }, { passive: true });

      window.addEventListener('mousedown', () => document.body.classList.add('cursor-press'));
      window.addEventListener('mouseup', () => document.body.classList.remove('cursor-press'));

      document.addEventListener('mouseover', (e) => {
        const hot = e.target.closest('a,button,.product-card,.cat-card,.deal-card,input,textarea,select');
        document.body.classList.toggle('cursor-hot', !!hot);
      });

      (function loop() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        requestAnimationFrame(loop);
      })();
    }

    /* magnetic buttons */
    const magnets = $$('[data-magnetic]');
    if (magnets.length) {
      window.addEventListener('mousemove', (e) => {
        magnets.forEach((el) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const range = Math.max(r.width, 90);
          if (dist < range) {
            const pull = (1 - dist / range) * 0.32;
            el.style.transform = `translate(${(dx * pull).toFixed(1)}px, ${(dy * pull).toFixed(1)}px)`;
          } else if (el.style.transform) {
            el.style.transform = '';
          }
        });
      }, { passive: true });
    }

    /* card tilt */
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('[data-tilt]');
      if (!card || card._tilting) return;
      card._tilting = true;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-8px)`;
      const reset = () => {
        card.style.transform = '';
        card._tilting = false;
        card.removeEventListener('mouseleave', reset);
      };
      card.addEventListener('mouseleave', reset);
    }, { passive: true });

    /* subtle image parallax on hover */
    document.addEventListener('mousemove', (e) => {
      const img = e.target.closest('[data-img-parallax]');
      if (!img) return;
      const r = img.getBoundingClientRect();
      const py = ((e.clientY - r.top) / r.height - 0.5) * -10;
      const im = img.querySelector('img');
      if (im) im.style.transform = `scale(1.07) translateY(${py.toFixed(1)}px)`;
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      const img = e.target.closest('[data-img-parallax]');
      if (img) { const im = img.querySelector('img'); if (im) im.style.transform = ''; }
    });
  }

  /* ============================================================
     6. TOAST + CART + WISHLIST
     ============================================================ */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML =
    '<span class="toast__check"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="toast__msg"></span>';
  document.body.appendChild(toast);
  let toastTimer;

  function showToast(msg) {
    $('.toast__msg', toast).textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2600);
  }

  /* storage helper — safe on file:// origins where localStorage may throw */
  const store = {
    get(key, fallback) {
      try { const v = window.localStorage.getItem(key); return v === null ? fallback : v; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  let cartCount = parseInt(store.get('dmart_cart', '0'), 10);
  const badge = $('#cartBadge');

  function paintBadge(bump) {
    if (!badge) return;
    badge.textContent = cartCount;
    badge.classList.toggle('is-on', cartCount > 0);
    if (bump && cartCount > 0) {
      badge.classList.remove('is-bump');
      void badge.offsetWidth;
      badge.classList.add('is-bump');
    }
  }
  paintBadge(false);

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add-cart]');
    if (add) {
      cartCount += 1;
      store.set('dmart_cart', String(cartCount));
      paintBadge(true);
      showToast(`“${add.dataset.addCart}” added to cart!`);
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      const on = wish.classList.toggle('is-on');
      showToast(on ? 'Added to your wishlist.' : 'Removed from wishlist.');
      return;
    }
    const cartBtn = e.target.closest('[data-cart-open]');
    if (cartBtn) {
      showToast(cartCount
        ? `Your demo cart has ${cartCount} item${cartCount > 1 ? 's' : ''} — checkout is disabled on this demo.`
        : 'Your demo cart is empty. Add a product to see the animation.');
      return;
    }
    const deal = e.target.closest('[data-deal]');
    if (deal) {
      e.preventDefault();
      showToast(`Deal saved! Show this demo offer at DMart Latur.`);
    }
  });

  /* ============================================================
     7. SEARCH OVERLAY
     ============================================================ */
  const search = $('#search');
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');

  function renderSearch(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();

    if (!q) {
      searchResults.innerHTML =
        '<div class="search__empty">Start typing to search products and categories — try “rice”, “beverages” or “baby”.</div>';
      return;
    }

    const prods = D.PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) || p.cat.includes(q)
    ).slice(0, 5);
    const cats = D.CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(q) || c.slug.includes(q)
    ).slice(0, 3);

    if (!prods.length && !cats.length) {
      searchResults.innerHTML =
        `<div class="search__empty">No matches for “${query}”. Try groceries, oil, juice or stationery.</div>`;
      return;
    }

    const rows = [];
    cats.forEach((c) => {
      rows.push(
        `<a class="search__item" href="products.html?cat=${c.slug}">
           <img src="${D.DM_IMG(c.img, 160)}" alt="${c.name}" loading="lazy">
           <span><strong>${c.name}</strong><small>Category</small></span>
           <span class="search__go"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
         </a>`
      );
    });
    prods.forEach((p) => {
      rows.push(
        `<a class="search__item" href="products.html?q=${encodeURIComponent(p.name)}">
           <img src="${D.DM_IMG(p.img, 160)}" alt="${p.name}" loading="lazy">
           <span><strong>${p.name}</strong><small>₹${p.price} · ${p.cat.replace(/-/g, ' ')}</small></span>
           <span class="search__go"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
         </a>`
      );
    });
    searchResults.innerHTML = rows.join('');
  }

  function openSearch() {
    if (!search) return;
    search.classList.add('is-open');
    document.body.classList.add('no-scroll');
    renderSearch(searchInput ? searchInput.value : '');
    setTimeout(() => searchInput && searchInput.focus(), 240);
  }
  function closeSearch() {
    if (!search) return;
    search.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  const searchOpen = $('#searchOpen');
  if (searchOpen) searchOpen.addEventListener('click', openSearch);
  const searchClose = $('#searchClose');
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  const searchBackdrop = $('.search__backdrop');
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);
  if (searchInput) searchInput.addEventListener('input', (e) => renderSearch(e.target.value));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeMenu(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault(); openSearch();
    }
  });

  /* ============================================================
     8. RENDERERS
     ============================================================ */
  const starSvg =
    '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';

  function categoryCard(c, i) {
    return `
      <a class="cat-card" href="products.html?cat=${c.slug}" data-reveal="up" data-delay="${(i * 0.07).toFixed(2)}" data-tilt>
        <div class="cat-card__media" data-img-parallax>
          <img src="${D.DM_IMG(c.img, 700)}" alt="${c.name}" loading="lazy" decoding="async">
          <span class="cat-card__veil"></span>
          <span class="cat-card__arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </div>
        <div class="cat-card__body">
          <span class="cat-card__count">Category</span>
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
        </div>
      </a>`;
  }

  function productCard(p) {
    const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    return `
      <article class="product-card" data-reveal="up" data-tilt>
        <div class="product-card__media" data-img-parallax>
          <img src="${D.DM_IMG(p.img, 620)}" alt="${p.name}" loading="lazy" decoding="async">
          <div class="product-card__badges">
            <span class="badge-off">${off}% OFF</span>
            ${p.tag ? `<span class="badge-tag">${p.tag}</span>` : ''}
          </div>
          <button class="wish" data-wish aria-label="Add ${p.name} to wishlist">
            <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 10-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z"/></svg>
          </button>
        </div>
        <div class="product-card__body">
          <span class="product-card__cat">${p.cat.replace(/-/g, ' ')}</span>
          <h3 class="product-card__name">${p.name}</h3>
          <span class="stars">${starSvg.repeat(5)}<span>${p.rating}</span></span>
          <div class="product-card__price">
            <span class="price">₹${p.price}</span>
            <span class="price--mrp">₹${p.mrp}</span>
          </div>
          <div class="product-card__foot">
            <button class="add-btn" data-add-cart="${p.name}">
              <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1.6 1.6 0 001.6 1.3h8.6a1.6 1.6 0 001.6-1.3L21 7H6"/></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </article>`;
  }

  function dealCard(o) {
    return `
      <article class="deal-card" data-reveal="up">
        <div class="deal-card__media" data-img-parallax>
          <img src="${D.DM_IMG(o.img, 640)}" alt="${o.name}" loading="lazy" decoding="async">
          <span class="deal-card__off">${o.off}% OFF</span>
        </div>
        <div class="deal-card__body">
          <h3>${o.name}</h3>
          <p>${o.note}</p>
          <div class="deal-card__price">
            <span class="price">₹${o.price}</span>
            <span class="price--mrp">₹${o.mrp}</span>
            ${o.tag ? `<span class="badge-tag">${o.tag}</span>` : ''}
          </div>
          <div class="deal-card__row">
            <button class="deal-card__cta" data-deal>View Deal
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <button class="add-btn" style="flex:none;padding:10px 16px" data-add-cart="${o.name}">Add</button>
          </div>
        </div>
      </article>`;
  }

  function offerCard(o) {
    return `
      <article class="deal-card" style="width:auto" data-reveal="up" data-tilt>
        <div class="deal-card__media" style="aspect-ratio:16/10" data-img-parallax>
          <img src="${D.DM_IMG(o.img, 760)}" alt="${o.name}" loading="lazy" decoding="async">
          <span class="deal-card__off">${o.off}% OFF</span>
        </div>
        <div class="deal-card__body">
          <h3>${o.name}</h3>
          <p>${o.note}</p>
          <div class="deal-card__price" style="display:flex;align-items:center;gap:10px;margin-top:6px">
            <span class="price">₹${o.price}</span>
            <span class="price--mrp">₹${o.mrp}</span>
            ${o.tag ? `<span class="badge-tag">${o.tag}</span>` : ''}
          </div>
          <div class="deal-card__row">
            <button class="deal-card__cta" data-deal>View Deal
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <button class="add-btn" style="flex:none;padding:11px 18px" data-add-cart="${o.name}">Add to Cart</button>
          </div>
        </div>
      </article>`;
  }

  /* fill render targets */
  $$('[data-render]').forEach((box) => {
    const kind = box.dataset.render;
    const limit = parseInt(box.dataset.limit || '0', 10);

    if (kind === 'categories') {
      let list = D.CATEGORIES;
      if (box.dataset.filter === 'featured') list = list.slice(0, 10);
      box.innerHTML = list.map(categoryCard).join('');
    }

    if (kind === 'deals') {
      const list = limit ? D.OFFERS.slice(0, limit) : D.OFFERS;
      box.innerHTML = list.map(dealCard).join('');
    }

    if (kind === 'offers') {
      const list = limit ? D.OFFERS.slice(0, limit) : D.OFFERS;
      box.innerHTML = list.map(offerCard).join('');
    }

    if (kind === 'products') {
      const cat = box.dataset.cat;
      let list = D.PRODUCTS;
      if (cat) list = list.filter((p) => p.cat === cat);
      if (limit) list = list.slice(0, limit);
      box.innerHTML = list.map(productCard).join('');
    }
  });

  /* ============================================================
     9. SLIDER CONTROLS
     ============================================================ */
  $$('.slider').forEach((slider) => {
    const track = $('.slider__track', slider);
    const prev = $('[data-slide="prev"]', slider);
    const next = $('[data-slide="next"]', slider);
    if (!track) return;

    const step = () => {
      const card = track.querySelector('.deal-card');
      return card ? card.getBoundingClientRect().width + 22 : 320;
    };
    const update = () => {
      if (!prev || !next) return;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    };
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step() * 1.5, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step() * 1.5, behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    update();

    /* drag to scroll (desktop) */
    let down = false, startX = 0, startL = 0;
    track.addEventListener('mousedown', (e) => { down = true; startX = e.pageX; startL = track.scrollLeft; });
    window.addEventListener('mouseup', () => { down = false; });
    track.addEventListener('mousemove', (e) => {
      if (!down) return;
      e.preventDefault();
      track.scrollLeft = startL - (e.pageX - startX);
    });
  });

  /* ============================================================
     10. PRODUCTS PAGE — filters + search
     ============================================================ */
  const prodGrid = $('#productGrid');
  if (prodGrid) {
    const chips = $$('.filter-chip');
    const field = $('#productSearch');
    const countEl = $('#resultCount');
    const empty = $('#productEmpty');
    const params = new URLSearchParams(location.search);
    let activeCat = params.get('cat') || 'all';
    let query = params.get('q') || '';

    if (field && query) field.value = query;

    function apply() {
      const q = (field ? field.value : '').trim().toLowerCase();
      let list = D.PRODUCTS.slice();

      if (activeCat !== 'all') list = list.filter((p) => p.cat === activeCat);
      if (q) {
        list = list.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat.replace(/-/g, ' ').includes(q) ||
          (D.CATEGORIES.find((c) => c.slug === p.cat) || {}).name.toLowerCase().includes(q)
        );
      }

      prodGrid.innerHTML = list.map(productCard).join('');
      if (empty) empty.style.display = list.length ? 'none' : 'block';
      if (countEl) countEl.innerHTML = `<b>${list.length}</b> product${list.length === 1 ? '' : 's'} found`;
      chips.forEach((c) => c.classList.toggle('is-on', c.dataset.cat === activeCat));
      initReveals(prodGrid);
      requestScroll();
    }

    chips.forEach((c) => c.addEventListener('click', () => {
      activeCat = c.dataset.cat;
      apply();
    }));
    if (field) field.addEventListener('input', apply);
    apply();
  }

  /* ============================================================
     11. COUNTDOWN (offers page)
     ============================================================ */
  const countdown = $('#countdown');
  if (countdown) {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      let s = Math.max(0, Math.floor((end - now) / 1000));
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      countdown.innerHTML =
        `<div><b>${h}</b><span>hrs</span></div><div><b>${m}</b><span>min</span></div><div><b>${sec}</b><span>sec</span></div>`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     12. ACCORDION + FORMS
     ============================================================ */
  $$('.acc__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc__item');
      const body = $('.acc__body', item);
      const open = item.classList.contains('is-open');

      $$('.acc__item').forEach((i) => {
        i.classList.remove('is-open');
        const b = $('.acc__body', i);
        if (b) b.style.maxHeight = null;
      });

      if (!open) {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  $$('.js-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = $('[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setTimeout(() => {
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send Message'; }
        showToast('Message sent! This is a demo form — no data was stored.');
      }, 900);
    });
  });

  /* ============================================================
     13. HERO FINISHING TOUCHES
     ============================================================ */
  const hero = $('#hero');
  if (hero) {
    setTimeout(() => hero.classList.add('is-ready'),
      document.body.dataset.intro === 'true' ? 1150 : 350);

    /* soft CSS particles */
    const holder = $('#heroParticles');
    if (holder && !REDUCED) {
      const n = window.innerWidth < 760 ? 12 : 26;
      let html = '';
      for (let i = 0; i < n; i++) {
        const size = 3 + Math.random() * 5;
        html += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(40 + Math.random() * 60).toFixed(1)}%;
                 width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;
                 animation-duration:${(7 + Math.random() * 9).toFixed(1)}s;
                 animation-delay:${(Math.random() * 8).toFixed(1)}s"></i>`;
      }
      holder.innerHTML = html;
    }
  }

  /* ============================================================
     14. FOOTER YEAR + INIT
     ============================================================ */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  initReveals();
  onScroll();
})();

(function () {
  'use strict';
  var C = window.CONFIG;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  // escape + style hearts and the infinity sign (the handwriting font has no such glyphs)
  var rich = function (s) {
    return esc(s).replace(/[\u2665\u2661]/g, '<span class="hrt">\u2665</span>').replace(/\u221E/g, '<span class="inf">\u221E</span>');
  };

  /* ---------- torn-paper shapes (seeded so they stay stable) ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pct(n) { return n.toFixed(2) + '%'; }
  function poly(points) {
    return 'polygon(' + points.map(function (p) { return pct(p[0]) + ' ' + pct(p[1]); }).join(',') + ')';
  }
  // ragged outer edge on one side (left or right) of a page
  function tornSide(side, seed, amp, base) {
    var r = rng(seed), edge = [], y = 0, prev = r() * amp;
    while (y < 100) {
      prev = prev * 0.45 + r() * amp * 0.9 + (r() < 0.08 ? amp * 0.8 : 0);
      var o = Math.min(prev, amp * 2) + base;
      edge.push([side === 'right' ? 100 - o : o, y]);
      y += 1.2 + r() * 2.6;
    }
    var last = r() * amp + base;
    edge.push([side === 'right' ? 100 - last : last, 100]);
    var pts = side === 'right' ? [[0, 0]].concat(edge, [[0, 100]]) : [[100, 0]].concat(edge, [[100, 100]]);
    return poly(pts);
  }
  // ragged edge all around (photo frames)
  function tornAll(seed, amp) {
    var r = rng(seed), p = [], x, y, j = function () { return r() * amp; };
    for (x = 0; x <= 100; x += 3 + r() * 3) p.push([x, j()]);
    for (y = 0; y <= 100; y += 3 + r() * 3) p.push([100 - j(), y]);
    for (x = 100; x >= 0; x -= 3 + r() * 3) p.push([x, 100 - j()]);
    for (y = 100; y >= 0; y -= 3 + r() * 3) p.push([j(), y]);
    return poly(p);
  }
  // a page face: lighter fibrous rim (outer) + textured sheet (inner) = torn look
  function face(cls, side, seed, inner) {
    return '<div class="face ' + cls + ' ' + side + '" style="clip-path:' + tornSide(side, seed, 1.7, 0) + '">' +
      '<div class="sheet" style="clip-path:' + tornSide(side, seed + 7, 1.1, 1.3) + '">' + inner + '</div></div>';
  }

  /* ---------- page content ---------- */
  // a red push pin holding the photo to the page (slightly different position/tilt each time)
  function pin(n, i) {
    var px = ((n * 7 + i * 11) % 13) - 6, rot = (((n + i * 3) % 5) * 5) - 10;
    return '<span class="pin" style="--px:' + px + ';--pr:' + rot + 'deg"></span>';
  }

  function mediaHTML(p, n) {
    var rot = (((n * 37) % 7) - 3) * 0.7, inner;
    if (p.duo) {
      var D = p.duo, ph = function (o, cls, i) {
        return '<div class="photo ' + cls + '" style="--rot:' + (i ? 2.2 : -2.4) + 'deg">' + pin(n, i + 1) +
          '<div class="photo-in" style="clip-path:' + tornAll(n * 13 + i * 5 + 3, 1.1) + '"><img class="m" src="' + esc(o.photo) + '" alt="" loading="lazy"></div></div>';
      };
      return '<div class="media duo">' + ph(D.a, 'da', 0) + ph(D.b, 'db', 1) +
        '<div class="dt d1">' + rich(D.a.date) + '</div>' +
        '<svg class="darrow" viewBox="0 0 60 80" aria-hidden="true"><path d="M14 4 C 34 14, 42 26, 30 38 C 20 48, 10 40, 20 32 C 30 24, 46 40, 44 66" fill="none" stroke="#c4455f" stroke-width="2.6" stroke-linecap="round"/><path d="M33 58 L44 70 L52 56" fill="none" stroke="#c4455f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<div class="dt d2">' + rich(D.b.date) + '</div>' +
        '<div class="dt d3">' + rich(D.text) + '</div></div>';
    }
    if (p.photos && p.photos.length) {
      var rots = [-3, 2.5, -2, 3];
      return '<div class="media collage c' + p.photos.length + (p.layout ? ' ' + p.layout : '') + '">' + p.photos.map(function (it, i) {
        var isV = typeof it === 'object' && it.video, src = isV ? it.poster : (typeof it === 'object' ? it.photo : it),
            tall = typeof it === 'object' && it.tall, ar = typeof it === 'object' && it.ar;
        return '<div class="photo pc pc' + i + (isV ? ' vt' : '') + (tall ? ' tall' : '') + '" style="--rot:' + rots[i % 4] + 'deg"' +
          (isV ? ' data-video="' + esc(it.video) + '" data-poster="' + esc(it.poster || '') + '"' : '') +
          '>' + pin(n, i) + 
          '<div class="photo-in" style="clip-path:' + tornAll(n * 13 + i * 7 + 3, 1.1) + '">' +
          '<img class="m" src="' + esc(src) + '"' + (ar ? ' style="aspect-ratio:' + ar + '"' : '') + ' alt="" loading="lazy">' + (isV ? '<span class="play">&#9654;</span>' : '') +
          '</div></div>';
      }).join('') + (p.caption ? '<div class="ccap' + (p.caption.length > 14 ? ' small' : '') + '">' + rich(p.caption) + '</div>' : '') + '</div>';
    }
    if (p.type === 'video') {
      inner = '<video class="m" src="' + esc(p.video) + '"' + (p.photo ? ' poster="' + esc(p.photo) + '"' : '') +
        (p.volume ? ' data-vol="' + p.volume + '"' : '') + ' controls playsinline preload="metadata"></video>';
    } else if (p.photo) {
      inner = '<img class="m" src="' + esc(p.photo) + '" alt="" loading="lazy">';
    } else {
      return '<div class="deco">&#9825;</div>';
    }
    return '<div class="media' + (p.type === 'video' ? ' vidm' : '') + '"><div class="photo' + (p.type === 'video' ? ' vid' : '') + '" style="--rot:' + rot + 'deg">' + pin(n, 0) +
      '<div class="photo-in" style="clip-path:' + tornAll(n * 13 + 3, 1.1) + '">' + inner +
      '<div class="cap">' + rich(p.caption || '') + '</div></div></div></div>';
  }

  function textHTML(p, n) {
    var body;
    if (p.right) {
      var R = p.right;
      return '<div class="text vrpage"><div class="media vr"><div class="photo" style="--rot:1deg">' + pin(n, 2) +
        '<div class="photo-in" style="clip-path:' + tornAll(n * 13 + 9, 1.1) + '">' +
        '<video class="m" src="' + esc(R.video) + '" poster="' + esc(R.poster || '') + '" data-vol="' + (R.volume || '') +
        '" controls playsinline preload="metadata"></video>' +
        '<div class="cap">' + rich(R.caption || '') + '</div></div></div></div><span class="folio">' + n + '</span></div>';
    }
    if (p.type === 'timeline') {
      body = '<div class="kicker">' + esc(p.title) + '</div><ol class="tl">' +
        p.events.map(function (e) { return '<li><b>' + esc(e.date) + '</b><span>' + esc(e.text) + '</span></li>'; }).join('') + '</ol>';
    } else if (p.type === 'letter') {
      var L = C.letter;
      body = '<div class="kicker">' + esc(p.title) + '</div><div class="lwrap"><div class="letter"><div class="greet">' + esc(L.greeting) + '</div>' +
        L.body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
        ((L.closing || L.signature) ? '<div class="closing">' + esc(L.closing) + '<br>' + esc(L.signature) + '</div>' : '') + '</div><div class="ltrack"><div class="lthumb"></div></div></div>' +
        '<div class="scrollhint" id="scrollHint">\u2193 scroll down to read the whole letter \u2193</div>' +
        '<button class="seal" id="sealBtn" type="button"><span>&#9829;</span><em>' + esc(C.surprise.buttonLabel) + '</em></button>';
    } else {
      body = '<div class="kicker' + ((p.title.length > 20 || p.tight) ? ' tight' : '') + '">' + esc(p.title) + '</div>' + (p.date ? '<div class="date">' + esc(p.date) + '</div>' : '') +
        '<p class="msg' + (p.msgSize ? ' ' + p.msgSize : p.message.length > 450 ? ' xxl' : p.message.length > 300 ? ' xl' : p.message.length > 200 ? ' long' : '') + '">' + rich(p.message) + '</p>';
    }
    return '<div class="text ' + p.type + '">' + body + '<span class="folio">' + n + '</span></div>';
  }

  function coverFace() {
    return '<div class="face front right cover-face"><div class="cover">' +
      '<div class="c-title gold">' + esc(C.coverTitle) + '</div>' +
      '<div class="c-photo"><img class="cp" src="' + esc(C.coverPhoto) + '" alt=""></div>' +
      '<h1 class="gold">' + esc(C.coverName || C.name) + ' <span class="heart">&#9829;</span></h1>' +
      '<div class="tapto">tap to open</div></div></div>';
  }

  // closing back cover: same look as the front, with a small note a little below the middle
  function backCoverFace(single) {
    return '<div class="face ' + (single ? 'front right' : 'back left') + ' cover-face"><div class="cover bk' + (single ? ' sg' : '') + '">' +
      '<div class="bk-note">' + rich(C.backNote || '') + '</div></div></div>';
  }

  /* ---------- state ---------- */
  var book = $('#book'), stage = $('#stage'), audio = $('#audio');
  var single = false, leaves = [], cur = 0, max = 0, busy = false, unlocked = false;
  var started = false, muted = false, fadeT = null, curSrc = '';
  try { muted = localStorage.getItem('gb-muted') === '1'; } catch (e) {}

  function isSingle() { return window.innerWidth <= 820 || window.innerWidth / window.innerHeight < 1.15; }
  function entryIndex() { return cur === 0 ? 0 : (single ? Math.ceil(cur / 2) : cur); }

  function build() {
    single = isSingle();
    document.body.classList.toggle('single', single);
    var E = C.pages, html = '', i;
    if (!single) {
      html += '<div class="leaf">' + coverFace() + face('back', 'left', 11, mediaHTML(E[0], 1)) + '</div>';
      for (i = 1; i <= E.length; i++) {
        var back = i < E.length ? face('back', 'left', i * 5 + 2, mediaHTML(E[i], i + 1))
                                : backCoverFace(false);
        html += '<div class="leaf">' + face('front', 'right', i * 5, textHTML(E[i - 1], i)) + back + '</div>';
      }
    } else {
      var S = [null];
      E.forEach(function (p, k) { S.push(mediaHTML(p, k + 1)); S.push(textHTML(p, k + 1)); });
      S.push('BACKCOVER');
      for (i = 0; i < S.length; i++) {
        html += '<div class="leaf">' + (i === 0 ? coverFace() : S[i] === 'BACKCOVER' ? backCoverFace(true) : face('front', 'right', i * 5, S[i])) +
          face('back', 'left', i * 5 + 2, '<div class="deco">&#9825;</div>') + '</div>';
      }
    }
    book.innerHTML = html;
    leaves = Array.prototype.slice.call(book.querySelectorAll('.leaf'));
    max = single ? leaves.length - 1 : leaves.length;   // desktop: the book can close on its back cover
    layout();
  }

  function layout() {
    leaves.forEach(function (l, i) {
      l.classList.toggle('flipped', i < cur);
      l.style.zIndex = i < cur ? i + 1 : leaves.length - i;
      l.classList.toggle('gone', single && i < cur);
    });
    book.classList.toggle('front-closed', !single && cur === 0);
    book.classList.toggle('back-closed', !single && cur === leaves.length);
    updateUI();
  }

  function updateUI() {
    var n = entryIndex(), total = C.pages.length;
    $('#indicator').textContent = cur === 0 ? 'tap the book to open' : n > total ? 'the end \u2661' : 'page ' + n + ' of ' + total;
    $('#muteBtn').classList.toggle('off', muted);
  }

  /* ---------- flipping ---------- */
  function go(d) {
    var n = cur + d;
    if (!unlocked || busy || n < 0 || n > max || overlayOpen()) return;
    busy = true; setTimeout(function () { busy = false; }, 700);
    var i = d > 0 ? cur : cur - 1, l = leaves[i];
    Array.prototype.forEach.call(book.querySelectorAll('video'), function (v) { v.pause(); });
    l.style.zIndex = 500;
    l.classList.remove('gone');
    cur = n;
    l.classList.toggle('flipped', d > 0);
    book.classList.toggle('front-closed', !single && cur === 0);
    book.classList.toggle('back-closed', !single && cur === leaves.length);
    setTimeout(function () {
      l.style.zIndex = i < cur ? i + 1 : leaves.length - i;
      l.classList.toggle('gone', single && i < cur);
    }, 1150);
    updateUI();
    setTrack(trackFor(entryIndex()));
  }

  book.addEventListener('click', function (e) {
    if (e.target.closest('#sealBtn')) { openSurprise(); return; }
    var vt = e.target.closest('[data-video]');
    if (vt) { openVideo(vt.getAttribute('data-video'), vt.getAttribute('data-poster')); return; }
    if (e.target.closest('video, button, a, input, .lwrap')) return;
    if (cur === 0) { go(1); return; }
    var r = book.getBoundingClientRect(), x = e.clientX - r.left;
    if (single) { x < r.width * 0.35 ? go(-1) : go(1); }
    else { x < r.width / 2 ? go(-1) : go(1); }
  });
  /* ---------- letter: custom always-visible scrollbar (works on phones/Mac where native bars hide) ---------- */
  function syncBar(w) {
    var L = w.querySelector('.letter'), tr = w.querySelector('.ltrack'), th = w.querySelector('.lthumb');
    if (!L || !tr || !th) return;
    var max = L.scrollHeight - L.clientHeight, th_h = Math.max(34, tr.clientHeight * L.clientHeight / Math.max(1, L.scrollHeight));
    tr.style.visibility = max > 4 ? 'visible' : 'hidden';
    th.style.height = th_h + 'px';
    th.style.transform = 'translateY(' + (max > 0 ? (L.scrollTop / max) * (tr.clientHeight - th_h) : 0) + 'px)';
  }
  function syncAll() { Array.prototype.forEach.call(book.querySelectorAll('.lwrap'), syncBar); }
  book.addEventListener('scroll', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('letter')) {
      syncBar(t.parentNode);
      var h = book.querySelector('#scrollHint'); if (h) h.classList.toggle('gone', t.scrollTop > 20);
    }
  }, true);
  book.addEventListener('wheel', function (e) {
    var L = e.target.closest && e.target.closest('.letter');
    if (!L || !L.classList.contains('letter') || L.classList.contains('text')) return;
    e.preventDefault(); L.scrollTop += e.deltaY;
  }, { passive: false });
  var drag = null;
  book.addEventListener('pointerdown', function (e) {
    var tr = e.target.closest && e.target.closest('.ltrack');
    if (!tr) return;
    var w = tr.parentNode, L = w.querySelector('.letter'), th = tr.querySelector('.lthumb');
    e.preventDefault(); e.stopPropagation();
    var r = th.getBoundingClientRect();
    if (e.target !== th) {   // click on the track: jump there
      var f = (e.clientY - tr.getBoundingClientRect().top - r.height / 2) / (tr.clientHeight - r.height);
      L.scrollTop = Math.max(0, Math.min(1, f)) * (L.scrollHeight - L.clientHeight);
      r = th.getBoundingClientRect();
    }
    drag = { L: L, tr: tr, th: th, off: e.clientY - r.top };
  }, true);
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var span = drag.tr.clientHeight - drag.th.offsetHeight,
        f = (e.clientY - drag.tr.getBoundingClientRect().top - drag.off) / Math.max(1, span);
    drag.L.scrollTop = Math.max(0, Math.min(1, f)) * (drag.L.scrollHeight - drag.L.clientHeight);
  });
  window.addEventListener('pointerup', function () { drag = null; });
  book.addEventListener('click', function (e) { if (e.target.closest('.ltrack')) e.stopPropagation(); }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'Escape') { closeSurprise(); closeVideo(); }
  });
  var tx = null;
  stage.addEventListener('touchstart', function (e) { tx = e.target.closest('video') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (tx == null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (dx < -50) go(1); else if (dx > 50) go(-1);
    tx = null;
  }, { passive: true });

  // photo / video that fails to load -> pretty placeholder
  book.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('img.m, video.m, img.cp')) {
      var d = document.createElement('div');
      d.className = 'm ph';
      d.innerHTML = '<span>' + (t.tagName === 'VIDEO' ? 'your video<br>goes here' : t.classList.contains('cp') ? 'her photo<br>goes here' : 'your photo<br>goes here') + '</span>';
      t.replaceWith(d);
    }
  }, true);

  /* ---------- music ---------- */
  audio.volume = 0;
  function trackFor(n) {
    var p = n > 0 ? C.pages[n - 1] : null;
    return (p && p.music) || C.music.default;
  }
  function fade(to, cb) {
    clearInterval(fadeT);
    var step = Math.max(0.002, C.music.volume / 60);   /* about 2.5 s from silence to full */
    fadeT = setInterval(function () {
      var d = to - audio.volume;
      if (Math.abs(d) <= step) { audio.volume = to; clearInterval(fadeT); if (cb) cb(); }
      else audio.volume = Math.max(0, Math.min(1, audio.volume + (d > 0 ? step : -step)));
    }, 40);
  }
  function setTrack(src) {
    if (!started || muted || !src) return;
    if (src === curSrc) {
      if (audio.paused) { audio.play().catch(function () {}); fade(C.music.volume); }
      return;
    }
    curSrc = src;
    fade(0, function () {
      audio.src = src; audio.currentTime = 0;
      audio.play().catch(function () {});
      fade(C.music.volume);
    });
  }
  $('#muteBtn').addEventListener('click', function () {
    muted = !muted;
    try { localStorage.setItem('gb-muted', muted ? '1' : '0'); } catch (e) {}
    if (muted) fade(0, function () { audio.pause(); });
    else { started = true; var s = curSrc || trackFor(entryIndex()); curSrc = ''; setTrack(s); }
    updateUI();
  });
  // while a video plays on the page, keep the music even lower (data-vol), then restore it
  book.addEventListener('play', function (e) {
    var v = e.target, vol = v.tagName === 'VIDEO' && parseFloat(v.getAttribute('data-vol'));
    if (vol && started && !muted && unlocked) fade(vol);
  }, true);
  function restoreMusic(e) {
    if (e.target.tagName === 'VIDEO' && e.target.getAttribute('data-vol') && started && !muted && unlocked) fade(C.music.volume);
  }
  book.addEventListener('pause', restoreMusic, true);
  book.addEventListener('ended', restoreMusic, true);
  document.addEventListener('pointerdown', function () {
    if (started) return;
    started = true;
    if (unlocked) setTrack(trackFor(entryIndex()));
  }, { once: true });

  /* ---------- video pop-up (tap a video tile) ---------- */
  var vbox = $('#vbox'), vv = $('#vVideo');
  function overlayOpen() { return !vbox.classList.contains('hidden') || !$('#surprise').classList.contains('hidden'); }
  function openVideo(src, poster) {
    vv.poster = poster || '';
    vv.src = src;
    vbox.classList.remove('hidden');
    var pr = vv.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function closeVideo() {
    if (vbox.classList.contains('hidden')) return;
    vv.pause();
    vbox.classList.add('hidden');
    vv.removeAttribute('src'); vv.load();
  }
  $('#vClose').addEventListener('click', closeVideo);
  vbox.addEventListener('click', function (e) { if (e.target === vbox) closeVideo(); });

  /* ---------- surprise ---------- */
  var rainT = null;
  function openSurprise() {
    var S = C.surprise, m = $('#sMedia');
    $('#sTitle').textContent = S.title;
    $('#sText').textContent = S.text;
    m.innerHTML = S.video ? '<video src="' + esc(S.video) + '" controls playsinline></video>'
                : S.photo ? '<img src="' + esc(S.photo) + '" alt="">' : '';
    $('#surprise').classList.remove('hidden');
    var n = 0;
    clearInterval(rainT);
    rainT = setInterval(function () {
      var h = document.createElement('div');
      h.className = 'rainheart'; h.textContent = Math.random() > 0.3 ? '\u2665' : '\u2661';
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = (14 + Math.random() * 26) + 'px';
      h.style.animationDuration = (3 + Math.random() * 3) + 's';
      document.body.appendChild(h);
      setTimeout(function () { h.remove(); }, 6500);
      if (++n > 70) clearInterval(rainT);
    }, 90);
  }
  function closeSurprise() {
    $('#surprise').classList.add('hidden');
    $('#sMedia').innerHTML = '';
    clearInterval(rainT);
  }
  $('#sClose').addEventListener('click', closeSurprise);

  /* ---------- lock ---------- */
  function unlock() {
    unlocked = true;
    var lock = $('#lock');
    lock.classList.add('fade');
    setTimeout(function () { lock.classList.add('hidden'); }, 800);
    stage.classList.remove('hidden');
    build(); setTimeout(syncAll, 400);
    setTrack(trackFor(0));
  }
  // forgiving comparison: ignore case, spaces, punctuation; vaazha~vazha; II / two -> 2
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      .replace(/aa/g, 'a').replace(/ii$/, '2').replace(/two$/, '2');
  }
  var L = C.lock;
  if (!L.enabled) { unlock(); }
  else {
    $('#lockQ').textContent = L.question;
    $('#lockHint').textContent = L.hint;
    $('#lockForm').addEventListener('submit', function (e) {
      e.preventDefault();
      started = true;
      var given = norm($('#lockDate').value);
      if (L.answers.some(function (a) { return norm(a) === given; })) { unlock(); return; }
      var card = $('.lock-card');
      $('#lockErr').textContent = 'Hmm, not quite\u2026 try again, my love \u2665';
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    });
  }

  /* ---------- resize (phone <-> desktop layout) ---------- */
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (!unlocked || isSingle() === single) return;
      var n = entryIndex();
      single = isSingle();
      cur = n === 0 ? 0 : (single ? n * 2 : n);
      build(); setTimeout(syncAll, 400);
    }, 250);
  });

  /* ---------- falling petals ---------- */
  var pe = $('#petals');
  for (var k = 0; k < 16; k++) {
    var s = document.createElement('span');
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDuration = (12 + Math.random() * 14) + 's';
    s.style.animationDelay = (-Math.random() * 20) + 's';
    s.style.transform = 'scale(' + (0.6 + Math.random() * 0.9) + ')';
    pe.appendChild(s);
  }
})();

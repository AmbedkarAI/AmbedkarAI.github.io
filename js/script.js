/* ============================================================
   AMBEDKAR AI INITIATIVE — interaction & motion
   IntersectionObserver reveals · parallax · marquee fill · form
   ============================================================ */
(function(){
  'use strict';

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- Parallax (background slower than foreground) ---- */
  var pxEls = Array.prototype.slice.call(document.querySelectorAll('.parallax__bg'));
  var ticking = false;
  function applyParallax(){
    pxEls.forEach(function(el){
      var rect = el.parentElement.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // progress: -1 (below) .. 1 (above)
      var progress = (rect.top + rect.height/2 - vh/2) / vh;
      var shift = progress * -60; // px
      el.style.transform = 'translateY(' + shift.toFixed(1) + 'px)';
    });
    ticking = false;
  }
  function onScroll(){
    if (!ticking){ window.requestAnimationFrame(applyParallax); ticking = true; }
  }
  if (pxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', applyParallax);
    applyParallax();
  }

  /* ---- Marquee: duplicate track content so the loop is seamless ---- */
  document.querySelectorAll('.marquee').forEach(function(m){
    var track = m.querySelector('.marquee__track');
    if (!track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    m.appendChild(clone);
  });

  /* ---- Contact form (front-end only) ---- */
  var form = document.getElementById('joinForm');
  if (form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var btn = form.querySelector('.btn-submit');
      var note = document.getElementById('formNote');
      var name = (form.querySelector('[name="name"]') || {}).value || 'friend';
      btn.textContent = 'Jai Bhim ☸';
      if (note){
        note.textContent = 'Received, ' + name.trim().split(' ')[0] + '. The movement will be in touch.';
      }
      form.querySelectorAll('input, textarea, select').forEach(function(f){ f.disabled = true; });
      btn.disabled = true;
    });
  }

  /* ---- Smooth anchor for hero CTA ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id.length > 1){
        var target = document.querySelector(id);
        if (target){
          e.preventDefault();
          var y = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top:y, behavior:'smooth' });
        }
      }
    });
  });
})();

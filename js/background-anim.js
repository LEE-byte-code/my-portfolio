(function () {
  'use strict';

  /* ─── config ─── */
  var CUBE_COUNT = 10;
  var PARTICLE_DENSITY = 20000;
  var MAX_PARTICLES = 60;
  var PARALLAX_MAX = 50;
  var LERP = 0.2;

  var FLOAT_ANIMS = ['cube-float-1', 'cube-float-2', 'cube-float-3'];

  /* ─── state ─── */
  var cubes = [];
  var particles = [];
  var mouseX = 0, mouseY = 0;
  var px = 0, py = 0;
  var cubeFrame = null, canvasFrame = null;
  var reducedMotion = false;

  var container = document.getElementById('hero-bg-anim');
  if (!container) return;

  /* ─── helpers ─── */
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function isReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ─── cubes ─── */
  function generateCubes() {
    cubes = [];
    for (var i = 0; i < CUBE_COUNT; i++) {
      cubes.push({
        size: rand(50, 170),
        x: rand(0, 100),
        y: rand(0, 100),
        anim: FLOAT_ANIMS[Math.floor(Math.random() * FLOAT_ANIMS.length)],
        dur: rand(15, 30),
        delay: rand(-20, 0),
        opacity: rand(0.2, 0.45),
        glow: true,
        borderOpacity: rand(0.4, 0.8),
      });
    }
  }

  function renderCubes() {
    var layer = container.querySelector('.cubes-layer');
    if (!layer) return;
    layer.innerHTML = '';

    cubes.forEach(function (c) {
      var el = document.createElement('div');
      el.className = 'bg-cube';
      el.style.cssText = [
        'width:' + c.size + 'px;height:' + c.size + 'px;',
        'left:' + c.x + '%;top:' + c.y + '%;',
        'opacity:' + c.opacity + ';',
        'animation:' + c.anim + ' ' + c.dur + 's ease-in-out ' + c.delay + 's infinite alternate;',
        'transform-style:preserve-3d;perspective:600px;',
      ].join('');

      var inner = document.createElement('div');
      inner.className = 'bg-cube-inner';
      var glow = c.glow
        ? 'box-shadow:0 0 60px rgba(57,255,20,0.15),0 0 120px rgba(57,255,20,0.06),inset 0 0 40px rgba(57,255,20,0.04);'
        : '';
      inner.style.cssText = [
        'background:linear-gradient(135deg,rgba(57,255,20,0.08),rgba(0,0,0,0.4));',
        'backdrop-filter:blur(2px);',
        'transform:rotateX(8deg) rotateY(8deg);',
        'border:1px solid hsla(119,70%,45%,' + c.borderOpacity + ');',
        'border-radius:4px;',
        glow,
      ].join('');

      var t = document.createElement('div');
      t.style.cssText = 'position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,hsla(119,70%,45%,0.4),transparent);';
      var b = document.createElement('div');
      b.style.cssText = 'position:absolute;bottom:0;left:25%;right:25%;height:1px;background:linear-gradient(90deg,transparent,hsla(119,70%,45%,0.2),transparent);';

      inner.appendChild(t);
      inner.appendChild(b);
      el.appendChild(inner);
      layer.appendChild(el);
    });
  }

  /* ─── particles ─── */
  function initParticles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function reset() {
      resize();
      var count = Math.min(Math.floor((canvas.width * canvas.height) / PARTICLE_DENSITY), MAX_PARTICLES);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: rand(-0.15, 0.15),
          vy: rand(-0.15, 0.15),
          size: rand(0.5, 2.5),
          opacity: rand(0.05, 0.35),
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(119,70%,45%,' + p.opacity + ')';
        ctx.fill();
      }
      canvasFrame = requestAnimationFrame(draw);
    }

    reset();
    draw();
    window.addEventListener('resize', reset);
  }

  /* ─── parallax ─── */
  function initParallax() {
    var layer = container.querySelector('.parallax-layer');
    if (!layer) return;

    document.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    function tick() {
      px += (mouseX * PARALLAX_MAX - px) * LERP;
      py += (mouseY * PARALLAX_MAX - py) * LERP;
      layer.style.transform = 'translate(' + px.toFixed(2) + 'px,' + py.toFixed(2) + 'px)';
      cubeFrame = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ─── cleanup ─── */
  function stop() {
    if (cubeFrame) cancelAnimationFrame(cubeFrame);
    if (canvasFrame) cancelAnimationFrame(canvasFrame);
    cubeFrame = canvasFrame = null;
    if (container) container.style.display = 'none';
  }

  function start() {
    if (!container) return;
    container.style.display = '';
    generateCubes();
    renderCubes();
    initParticles();
    initParallax();
  }

  /* ─── init ─── */
  function init() {
    reducedMotion = isReduced();
    if (reducedMotion) { stop(); return; }
    start();

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
      if (e.matches) { stop(); } else { start(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

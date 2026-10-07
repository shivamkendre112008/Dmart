/* ============================================================
   DMart Latur — lightweight Three.js hero scene
   A floating shopping basket with grocery shapes + particles.
   Uses the UMD build so the page also works from file://
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  try {
    initScene(canvas);
  } catch (err) {
    /* if WebGL is unavailable the CSS hero still looks complete */
    canvas.style.display = 'none';
  }

  function initScene(canvas) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var small = window.innerWidth < 760;

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !small,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.4 : 1.8));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0.3, 9.2);

    /* ---------------- lights ---------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 1.05));

    var key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(5, 7, 6);
    scene.add(key);

    var rim = new THREE.DirectionalLight(0xffe3c9, 0.9);
    rim.position.set(-6, -2, 4);
    scene.add(rim);

    var accent = new THREE.PointLight(0xff5b62, 26, 22);
    accent.position.set(-3.4, 2.4, 3.4);
    scene.add(accent);

    /* ---------------- materials ---------------- */
    var matRed = new THREE.MeshStandardMaterial({ color: 0xe0242b, roughness: 0.38, metalness: 0.06 });
    var matRedDark = new THREE.MeshStandardMaterial({ color: 0xb31b21, roughness: 0.45, metalness: 0.05, side: THREE.DoubleSide });
    var matWhite = new THREE.MeshStandardMaterial({ color: 0xf7f8fa, roughness: 0.5 });
    var matAmber = new THREE.MeshStandardMaterial({ color: 0xffb020, roughness: 0.42 });
    var matGreen = new THREE.MeshStandardMaterial({ color: 0x39b96a, roughness: 0.45 });
    var matCream = new THREE.MeshStandardMaterial({ color: 0xffe9c9, roughness: 0.55 });

    /* ---------------- basket ---------------- */
    var cluster = new THREE.Group();
    scene.add(cluster);

    var basket = new THREE.Group();

    var body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 0.88, 1.05, 30, 1, true),
      matRedDark
    );
    basket.add(body);

    var base = new THREE.Mesh(new THREE.CircleGeometry(0.88, 30), matRed);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.525;
    basket.add(base);

    var rimTop = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.065, 12, 44), matRed);
    rimTop.rotation.x = Math.PI / 2;
    rimTop.position.y = 0.525;
    basket.add(rimTop);

    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.05, 10, 40, Math.PI), matRed);
    handle.position.y = 0.55;
    basket.add(handle);

    /* weave rings around the basket for a retail feel */
    for (var i = 0; i < 3; i++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.06 - i * 0.07, 0.026, 8, 40),
        matRed
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.18 - i * 0.2;
      basket.add(ring);
    }

    basket.rotation.x = 0.16;
    basket.position.y = -0.55;
    cluster.add(basket);

    /* ---------------- floating grocery shapes ---------------- */
    var floaters = [];
    var specs = [
      { geo: new THREE.SphereGeometry(0.4, 26, 20), mat: matRed, pos: [-1.9, 1.35, 0.4], spin: 0.006 },
      { geo: new THREE.SphereGeometry(0.3, 24, 18), mat: matGreen, pos: [1.95, 1.6, -0.3], spin: -0.008 },
      { geo: new THREE.BoxGeometry(0.78, 1.05, 0.4), mat: matWhite, pos: [2.25, -0.35, 0.5], spin: 0.005 },
      { geo: new THREE.CylinderGeometry(0.28, 0.28, 0.86, 22), mat: matAmber, pos: [-2.3, -0.1, 0.2], spin: 0.01 },
      { geo: new THREE.BoxGeometry(0.62, 0.4, 0.62), mat: matCream, pos: [-1.35, -1.5, 0.9], spin: -0.006 },
      { geo: new THREE.SphereGeometry(0.22, 20, 16), mat: matAmber, pos: [1.35, -1.55, 0.7], spin: 0.009 },
      { geo: new THREE.TorusGeometry(0.3, 0.11, 10, 26), mat: matWhite, pos: [0.15, 2.15, -0.6], spin: 0.012 }
    ];

    specs.forEach(function (s, idx) {
      var mesh = new THREE.Mesh(s.geo, s.mat);
      mesh.position.set(s.pos[0], s.pos[1], s.pos[2]);
      mesh.rotation.set(Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.3);
      mesh.userData = {
        base: mesh.position.clone(),
        phase: idx * 0.9,
        spin: s.spin,
        amp: 0.16 + Math.random() * 0.14
      };
      floaters.push(mesh);
      cluster.add(mesh);
    });

    /* small "price tag" plates */
    var tagMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    [[-0.6, 2.0, 0.8], [2.6, 0.9, -0.4]].forEach(function (p, idx) {
      var tag = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.03), idx ? tagMat : matRed);
      tag.position.set(p[0], p[1], p[2]);
      tag.rotation.z = idx ? -0.4 : 0.35;
      tag.userData = { base: tag.position.clone(), phase: 2 + idx, spin: 0.01, amp: 0.2 };
      floaters.push(tag);
      cluster.add(tag);
    });

    /* ---------------- particles ---------------- */
    var count = small ? 70 : 150;
    var pGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    for (var p = 0; p < count; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 13;
      positions[p * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[p * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.055,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    var points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    /* ---------------- sizing ---------------- */
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(rect.width, 1);
      var h = Math.max(rect.height, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    /* ---------------- cursor response ---------------- */
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };

    window.addEventListener('mousemove', function (e) {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    /* ---------------- loop control ---------------- */
    var visible = true;
    var hero = document.getElementById('hero');

    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0.02 }).observe(hero);
    }

    var clock = new THREE.Clock();
    var raf;

    function animate() {
      raf = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;

      var t = clock.getElapsedTime();

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      /* whole cluster gently follows the cursor */
      cluster.rotation.y = current.x * 0.42 + (reduced ? 0 : t * 0.06);
      cluster.rotation.x = current.y * 0.26;
      cluster.position.x = 0.7 + current.x * 0.35;
      cluster.position.y = -current.y * 0.22;

      /* basket sway */
      basket.rotation.z = Math.sin(t * 0.6) * 0.07;
      basket.position.y = -0.55 + Math.sin(t * 0.9) * 0.1;

      /* floating products */
      floaters.forEach(function (f) {
        var u = f.userData;
        f.position.y = u.base.y + Math.sin(t * 0.9 + u.phase) * u.amp;
        f.position.x = u.base.x + Math.cos(t * 0.5 + u.phase) * u.amp * 0.5;
        f.rotation.y += u.spin;
        f.rotation.x += u.spin * 0.6;
      });

      /* particles drift */
      points.rotation.y = t * 0.02 + current.x * 0.12;
      points.rotation.x = current.y * 0.06;

      camera.position.x = current.x * 0.5;
      camera.position.y = 0.3 - current.y * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('beforeunload', function () { cancelAnimationFrame(raf); });
  }
})();

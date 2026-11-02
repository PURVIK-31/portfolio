"use client";

/**
 * "Full-Stack Core" – a procedural three.js hero scene (no external model files).
 *
 *  - Wireframe icosahedron "CPU core" with a glowing </> glyph inside
 *  - Three tilted orbital rings (frontend / backend / data layers) with orbiting electrons
 *  - A network-graph shell: nodes + edges, with data packets random-walking along the edges
 *  - Binary-dust particle field
 *  - Pointer parallax across the whole page
 *
 * Plain three.js (no React Three Fiber) so its JSX types don't collide with once-ui's
 * polymorphic components. Rendering pauses off-screen and stops for reduced-motion users.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Theme = "light" | "dark";

type Palette = {
  primary: number;
  secondary: number;
  accent: number;
  node: number;
  dust: number;
  blending: THREE.Blending;
  edgeOpacity: number;
};

const PALETTES: Record<Theme, Palette> = {
  dark: {
    primary: 0x22d3ee,
    secondary: 0x818cf8,
    accent: 0xfb7185,
    node: 0xa5f3fc,
    dust: 0x67e8f9,
    blending: THREE.AdditiveBlending,
    edgeOpacity: 0.22,
  },
  light: {
    primary: 0x0891b2,
    secondary: 0x4f46e5,
    accent: 0xe11d48,
    node: 0x0e7490,
    dust: 0x0891b2,
    blending: THREE.NormalBlending,
    edgeOpacity: 0.3,
  },
};

/* ---------- deterministic helpers ---------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return points;
}

function buildGraph(count: number, radius: number, neighbours: number) {
  const nodes = fibonacciSphere(count, radius);
  const edgeSet = new Set<string>();
  const adjacency: number[][] = nodes.map(() => []);

  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: node.distanceToSquared(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          adjacency[i].push(j);
          adjacency[j].push(i);
        }
      });
  });

  const edges = [...edgeSet].map((key) => key.split("-").map(Number) as [number, number]);
  const linePositions = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    nodes[a].toArray(linePositions, k * 6);
    nodes[b].toArray(linePositions, k * 6 + 3);
  });
  const nodePositions = new Float32Array(nodes.length * 3);
  nodes.forEach((n, i) => n.toArray(nodePositions, i * 3));

  return { nodes, adjacency, linePositions, nodePositions };
}

/* ---------- scene construction ---------- */

const RINGS = [
  { radius: 1.65, tilt: new THREE.Euler(1.15, 0.2, 0), speed: 0.9, color: "primary" },
  { radius: 1.85, tilt: new THREE.Euler(0.35, 1.0, 0.4), speed: -0.7, color: "secondary" },
  { radius: 2.02, tilt: new THREE.Euler(-0.6, -0.5, 0.9), speed: 0.55, color: "accent" },
] as const;

const PACKETS = 18;

function buildScene(palette: Palette) {
  const root = new THREE.Group();

  const glowMaterial = (color: number, opacity: number) =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: palette.blending,
      depthWrite: false,
      toneMapped: false,
    });

  /* Core: wireframe icosahedron + vertex dots + inner glow */
  const shell = new THREE.Group();
  const icoGeometry = new THREE.IcosahedronGeometry(1.12, 1);
  const wire = new THREE.Mesh(icoGeometry, glowMaterial(palette.primary, 0.55));
  (wire.material as THREE.MeshBasicMaterial).wireframe = true;
  const vertexDots = new THREE.Points(
    icoGeometry,
    new THREE.PointsMaterial({ color: palette.node, size: 0.07, transparent: true, opacity: 0.95, toneMapped: false }),
  );
  shell.add(wire, vertexDots);

  const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), glowMaterial(palette.secondary, 0.14));

  /* </> glyph from six bars */
  const glyph = new THREE.Group();
  const barMaterial = (color: number) =>
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.2, toneMapped: false });
  const chevronMaterial = barMaterial(palette.primary);
  const slashMaterial = barMaterial(palette.accent);
  const barGeometry = new THREE.BoxGeometry(0.52, 0.085, 0.085);
  const slashGeometry = new THREE.BoxGeometry(0.8, 0.085, 0.085);
  const angle = 0.72;
  const dx = 0.26 * Math.cos(angle);
  const dy = 0.26 * Math.sin(angle);
  const apex = 0.62;
  const addBar = (geo: THREE.BoxGeometry, mat: THREE.Material, x: number, y: number, rz: number) => {
    const bar = new THREE.Mesh(geo, mat);
    bar.position.set(x, y, 0);
    bar.rotation.z = rz;
    glyph.add(bar);
  };
  addBar(barGeometry, chevronMaterial, -apex + dx, dy, angle); // <
  addBar(barGeometry, chevronMaterial, -apex + dx, -dy, -angle);
  addBar(slashGeometry, slashMaterial, 0, 0, 1.18); // /
  addBar(barGeometry, chevronMaterial, apex - dx, dy, -angle); // >
  addBar(barGeometry, chevronMaterial, apex - dx, -dy, angle);
  glyph.scale.setScalar(0.78);

  root.add(shell, innerGlow, glyph);

  /* Orbital rings + electrons */
  const electrons: { mesh: THREE.Mesh; radius: number; speed: number; offset: number }[] = [];
  const electronGeometry = new THREE.SphereGeometry(0.065, 16, 16);
  RINGS.forEach((ring, i) => {
    const color = palette[ring.color];
    const group = new THREE.Group();
    group.rotation.copy(ring.tilt);
    const torus = new THREE.Mesh(new THREE.TorusGeometry(ring.radius, 0.009, 8, 180), glowMaterial(color, 0.6));
    const electron = new THREE.Mesh(electronGeometry, new THREE.MeshBasicMaterial({ color, toneMapped: false }));
    group.add(torus, electron);
    root.add(group);
    electrons.push({ mesh: electron, radius: ring.radius, speed: ring.speed, offset: i * 2.1 });
  });

  /* Network shell with travelling packets */
  const graph = buildGraph(56, 2.55, 3);
  const network = new THREE.Group();
  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute("position", new THREE.BufferAttribute(graph.linePositions, 3));
  const edges = new THREE.LineSegments(
    edgeGeometry,
    new THREE.LineBasicMaterial({
      color: palette.primary,
      transparent: true,
      opacity: palette.edgeOpacity,
      blending: palette.blending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(graph.nodePositions, 3));
  const nodes = new THREE.Points(
    nodeGeometry,
    new THREE.PointsMaterial({ color: palette.node, size: 0.06, transparent: true, opacity: 0.9, toneMapped: false }),
  );
  const packetMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: palette.accent, toneMapped: false }),
    PACKETS,
  );
  packetMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  network.add(edges, nodes, packetMesh);
  root.add(network);

  const rand = mulberry32(7);
  const packets = Array.from({ length: PACKETS }, () => {
    const from = Math.floor(rand() * graph.nodes.length);
    const nbrs = graph.adjacency[from];
    return { from, to: nbrs[Math.floor(rand() * nbrs.length)], t: rand(), speed: 0.35 + rand() * 0.55 };
  });

  /* Binary dust */
  const dustRand = mulberry32(42);
  const dustCount = 700;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = 3.2 + dustRand() * 3.5;
    const theta = dustRand() * Math.PI * 2;
    const phi = Math.acos(2 * dustRand() - 1);
    dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dustPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      color: palette.dust,
      size: 0.025,
      transparent: true,
      opacity: 0.55,
      blending: palette.blending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  root.add(dust);

  const dummy = new THREE.Object3D();

  /** Advance the animation by `dt` seconds of scene time (t = total scene time). */
  function update(t: number, dt: number) {
    shell.rotation.y = t * 0.25;
    shell.rotation.x = t * 0.12;
    glyph.rotation.y = Math.sin(t * 0.7) * 0.55;
    glyph.position.y = Math.sin(t * 1.4) * 0.05;
    innerGlow.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08);

    electrons.forEach((e) => {
      const a = t * e.speed + e.offset;
      e.mesh.position.set(Math.cos(a) * e.radius, Math.sin(a) * e.radius, 0);
    });

    network.rotation.y = -t * 0.06;
    dust.rotation.y = t * 0.02;

    packets.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        p.t = 0;
        p.from = p.to;
        const nbrs = graph.adjacency[p.from];
        p.to = nbrs[Math.floor(rand() * nbrs.length)];
      }
      dummy.position.lerpVectors(graph.nodes[p.from], graph.nodes[p.to], p.t);
      dummy.scale.setScalar(0.6 + Math.sin(p.t * Math.PI) * 0.6);
      dummy.updateMatrix();
      packetMesh.setMatrixAt(i, dummy.matrix);
    });
    packetMesh.instanceMatrix.needsUpdate = true;
  }

  return { root, update };
}

function disposeTree(object: THREE.Object3D) {
  const seen = new Set<unknown>();
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry && !seen.has(mesh.geometry)) {
      seen.add(mesh.geometry);
      mesh.geometry.dispose();
    }
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    materials.forEach((m) => {
      if (!seen.has(m)) {
        seen.add(m);
        m.dispose();
      }
    });
  });
}

/* ---------- component ---------- */

export default function CoreScene({ theme }: { theme: Theme }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL unavailable – the CSS glow behind stays as a fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    const palette = PALETTES[theme];
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const coreLight = new THREE.PointLight(palette.secondary, 12);
    scene.add(coreLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const parallax = new THREE.Group();
    const { root, update } = buildScene(palette);
    parallax.add(root);
    scene.add(parallax);

    /* sizing */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      // keep the whole scene in frame on narrow viewports
      camera.position.z = w / h < 1 ? 6.6 / Math.max(w / h, 0.6) : 6.6;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* pointer parallax (whole page) */
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    /* animation loop – paused off-screen, disabled for reduced motion */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock(false);
    let sceneTime = 4; // start mid-animation so the first frame already looks "alive"
    let frame = 0;
    let running = false;

    update(sceneTime, 0);
    renderer.render(scene, camera);

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      sceneTime += dt;
      update(sceneTime, dt);
      parallax.rotation.y = THREE.MathUtils.damp(parallax.rotation.y, pointer.x * 0.35, 3, dt);
      parallax.rotation.x = THREE.MathUtils.damp(parallax.rotation.x, pointer.y * 0.25, 3, dt);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      clock.start();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      clock.stop();
      cancelAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: "100px",
    });
    visibility.observe(host);
    if (!reducedMotion) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      disposeTree(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [theme]);

  return <div ref={container} style={{ position: "absolute", inset: 0 }} />;
}

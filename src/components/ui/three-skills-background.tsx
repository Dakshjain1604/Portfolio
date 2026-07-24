"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

// ── Interactive Neural Network Constellation ────────────────────────
function NeuralNetwork({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 55 : 110;
  const linkDist = isMobile ? 3.0 : 4.2;
  const speedScale = 0.015;

  // Initialize node positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const rangeX = isMobile ? 12 : 24;
    const rangeY = isMobile ? 8 : 12;
    const rangeZ = isMobile ? 6 : 10;

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * rangeX;
      pos[i * 3 + 1] = (Math.random() - 0.5) * rangeY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * rangeZ;

      vel[i * 3] = (Math.random() - 0.5) * speedScale;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speedScale;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speedScale;
    }
    return [pos, vel];
  }, [count, isMobile]);

  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    const pointsGeo = pointsRef.current.geometry;
    const posAttr = pointsGeo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    // Projected mouse coordinates in 3D scene space
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;

    // 1. Update node positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3] += velocities[i3];
      array[i3 + 1] += velocities[i3 + 1];
      array[i3 + 2] += velocities[i3 + 2];

      // Bounce off invisible boundary box
      const boundX = isMobile ? 8 : 16;
      const boundY = isMobile ? 6 : 9;
      const boundZ = isMobile ? 4 : 7;

      if (Math.abs(array[i3]) > boundX) velocities[i3] *= -1;
      if (Math.abs(array[i3 + 1]) > boundY) velocities[i3 + 1] *= -1;
      if (Math.abs(array[i3 + 2]) > boundZ) velocities[i3 + 2] *= -1;

      // Mouse influence (attract nearby nodes)
      const dx = targetX - array[i3];
      const dy = targetY - array[i3 + 1];
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      if (distToMouse < 4.5) {
        // Pull towards mouse coordinates
        array[i3] += dx * 0.008;
        array[i3 + 1] += dy * 0.008;
      }
    }
    posAttr.needsUpdate = true;

    // 2. Build connection links based on distance
    const linePositions: number[] = [];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x1 = array[i3];
      const y1 = array[i3 + 1];
      const z1 = array[i3 + 2];

      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        const x2 = array[j3];
        const y2 = array[j3 + 1];
        const z2 = array[j3 + 2];

        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < linkDist) {
          linePositions.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }

    const linesGeo = linesRef.current.geometry;
    linesGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
  });

  return (
    <group>
      {/* Dynamic Points (Neural Nodes) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.06 : 0.09}
          color="#ffffff"
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>

      {/* Dynamic Line Segments (Neural Links) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ── Camera Mouse Parallax ───────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const onMove = useCallback((e: MouseEvent) => {
    target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  useFrame(() => {
    mouse.current.x += (target.current.x - mouse.current.x) * 0.03;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.03;
    camera.position.x = mouse.current.x * 0.8;
    camera.position.y = mouse.current.y * -0.4 + 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── WebGL Scene Setup ───────────────────────────────────────────────
function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.05} color="#ffffff" />
      <CameraRig />
      <NeuralNetwork isMobile={isMobile} />
    </>
  );
}

// ── Exported Component ──────────────────────────────────────────────
export function ThreeSkillsBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return <div className="absolute inset-0 z-0 bg-black" />;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

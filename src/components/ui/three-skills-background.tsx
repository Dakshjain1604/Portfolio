"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

// ── Skills matching the Technical Arsenal section ───────────────────
const SKILLS = [
  // AI & GenAI
  { name: "LangChain", color: "#00A67E" },
  { name: "OpenAI", color: "#10A37F" },
  { name: "AI Agents", color: "#818CF8" },
  // Frontend
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Tailwind", color: "#38BDF8" },
  // Backend
  { name: "Node.js", color: "#68A063" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MongoDB", color: "#4DB33D" },
  { name: "GraphQL", color: "#E535AB" },
  { name: "Redis", color: "#DC382D" },
  { name: "Prisma", color: "#5A67D8" },
  // Languages
  { name: "TypeScript", color: "#3178C6" },
  { name: "Python", color: "#FFD43B" },
  // Cloud & DevOps
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
];

// ── Floating Skill Orb ──────────────────────────────────────────────
function SkillOrb({
  skill,
  index,
  total,
  ring,
  isMobile,
}: {
  skill: { name: string; color: string };
  index: number;
  total: number;
  ring: number;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  const params = useMemo(() => {
    // Push rings well outside the text area — mobile gets smaller radii
    const radii = isMobile
      ? [4.5, 6.5, 8.5]
      : [7, 10, 13];
    const speeds = [0.06, -0.04, 0.025];
    const yAmps = [0.8, 1.2, 0.6];
    const baseAngle = (index / total) * Math.PI * 2;
    // Vertical offset so cards spread out vertically
    const yOff = Math.sin(baseAngle * 2.3 + ring) * 1.5;
    return {
      radius: radii[ring],
      speed: speeds[ring],
      yAmp: yAmps[ring],
      baseAngle,
      yOff,
    };
  }, [index, total, ring, isMobile]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = params.baseAngle + t * params.speed;
    const x = Math.cos(angle) * params.radius;
    const z = Math.sin(angle) * params.radius;
    const y = Math.sin(t * 0.2 + index * 0.7) * params.yAmp + params.yOff;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
  });

  const sphereSize = isMobile ? 0.1 : 0.15;
  const glowSize = isMobile ? 0.25 : 0.35;
  const labelFontSize = isMobile ? "11px" : "13px";

  return (
    <group ref={groupRef}>
      <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.3}>
        {/* Bright sphere core */}
        <mesh>
          <sphereGeometry args={[sphereSize, 16, 16]} />
          <meshBasicMaterial color={skill.color} transparent opacity={0.9} />
        </mesh>

        {/* Soft glow halo */}
        <mesh>
          <sphereGeometry args={[glowSize, 16, 16]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* CSS label */}
        <Html
          center
          distanceFactor={isMobile ? 6 : 8}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              padding: "5px 14px",
              borderRadius: "8px",
              background: "rgba(9,9,11,0.65)",
              border: `1px solid ${skill.color}25`,
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
              fontSize: labelFontSize,
              fontWeight: 600,
              fontFamily: "'Inter', system-ui, sans-serif",
              color: skill.color,
              letterSpacing: "0.02em",
              textShadow: `0 0 10px ${skill.color}40`,
              transform: "translateY(-26px)",
            }}
          >
            {skill.name}
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ── Particle Field ──────────────────────────────────────────────────
function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 18;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#67e8f9"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Ambient Glow Orbs ───────────────────────────────────────────────
function GlowOrb({
  pos,
  color,
  size,
  speed,
}: {
  pos: [number, number, number];
  color: string;
  size: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      const s = size + Math.sin(t * speed) * 0.3;
      ref.current.scale.setScalar(s);
      ref.current.position.y = pos[1] + Math.sin(t * speed * 0.6) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 20, 20]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.035}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ── Mouse Parallax Camera ───────────────────────────────────────────
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
    mouse.current.x += (target.current.x - mouse.current.x) * 0.025;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.025;
    camera.position.x = mouse.current.x * 1.0;
    camera.position.y = mouse.current.y * -0.5 + 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Main Scene ──────────────────────────────────────────────────────
function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 3 orbital rings
  const rings = useMemo(() => {
    const skillsToShow = isMobile ? SKILLS.slice(0, 10) : SKILLS;
    const perRing = Math.ceil(skillsToShow.length / 3);
    return [
      skillsToShow.slice(0, perRing),
      skillsToShow.slice(perRing, perRing * 2),
      skillsToShow.slice(perRing * 2),
    ];
  }, [isMobile]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 8, 10]} intensity={0.12} color="#22d3ee" />

      <CameraRig />

      {rings.map((ring, ri) =>
        ring.map((skill, i) => (
          <SkillOrb
            key={skill.name}
            skill={skill}
            index={i}
            total={ring.length}
            ring={ri}
            isMobile={isMobile}
          />
        ))
      )}

      <ParticleField count={isMobile ? 120 : 350} />

      <GlowOrb pos={[6, 2, -4]} color="#22d3ee" size={2.2} speed={0.35} />
      <GlowOrb pos={[-7, -1, 5]} color="#818cf8" size={1.8} speed={0.5} />
      <GlowOrb pos={[0, -3, -8]} color="#a78bfa" size={1.5} speed={0.25} />
    </>
  );
}

// ── Exported Component ──────────────────────────────────────────────
export function ThreeSkillsBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mount to let hydration finish
    const id = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return <div className="absolute inset-0 z-0 bg-[#09090b]" />;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 18], fov: 50, near: 0.1, far: 100 }}
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

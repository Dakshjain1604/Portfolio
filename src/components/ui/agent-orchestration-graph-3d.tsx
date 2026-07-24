"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Line } from "@react-three/drei";
import * as THREE from "three";

function OrchestrationNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      // Slowly rotate nodes & adjust based on mouse pointer coordinates
      groupRef.current.rotation.y = t * 0.05 + state.pointer.x * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.05 - state.pointer.y * 0.1;
    } else {
      // Static display holding mouse coordinates slightly
      groupRef.current.rotation.y = state.pointer.x * 0.05;
      groupRef.current.rotation.x = -state.pointer.y * 0.03;
    }
  });

  const nodes = [
    { pos: [0, 0, 0] as [number, number, number], size: 0.22, color: "#38BDF8", label: "Manager" },
    { pos: [-1.4, 0.9, 0.6] as [number, number, number], size: 0.12, color: "#94A3B8", label: "Coder" },
    { pos: [1.4, 0.7, -0.6] as [number, number, number], size: 0.12, color: "#94A3B8", label: "Researcher" },
    { pos: [-0.7, -1.0, 1.0] as [number, number, number], size: 0.12, color: "#94A3B8", label: "Planner" },
    { pos: [0.9, -1.0, -1.0] as [number, number, number], size: 0.12, color: "#94A3B8", label: "Tools" },
  ];

  return (
    <group ref={groupRef}>
      {/* Background space starfield */}
      <Stars radius={50} depth={20} count={150} factor={2} saturation={0} fade speed={0.5} />

      {/* Nodes represented as Mesh Spheres */}
      {nodes.map((node, idx) => (
        <group key={idx} position={node.pos}>
          <mesh>
            <sphereGeometry args={[node.size, 32, 32]} />
            <meshStandardMaterial
              color={node.color}
              roughness={0.15}
              metalness={0.8}
              emissive={node.color}
              emissiveIntensity={node.label === "Manager" ? 0.9 : 0.25}
            />
          </mesh>
        </group>
      ))}

      {/* Connecting coordinate pipelines */}
      <Line points={[[0, 0, 0], [-1.4, 0.9, 0.6]]} color="#38BDF8" lineWidth={1.2} opacity={0.3} transparent />
      <Line points={[[0, 0, 0], [1.4, 0.7, -0.6]]} color="#38BDF8" lineWidth={1.2} opacity={0.3} transparent />
      <Line points={[[0, 0, 0], [-0.7, -1.0, 1.0]]} color="#38BDF8" lineWidth={1.2} opacity={0.3} transparent />
      <Line points={[[0, 0, 0], [0.9, -1.0, -1.0]]} color="#38BDF8" lineWidth={1.2} opacity={0.3} transparent />
    </group>
  );
}

export function AgentOrchestrationGraph3D() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#38BDF8" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#232A38" />
        <OrchestrationNetwork />
      </Canvas>
    </div>
  );
}

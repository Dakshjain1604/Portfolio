"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Line, Html } from "@react-three/drei"
import * as THREE from "three"

export type Agent = {
  id: string
  label: string
  role: string
  position: [number, number, number]
  size: number
}

export const AGENTS: Agent[] = [
  { id: "manager", label: "Manager", role: "Plans the task, routes work, holds the loop state.", position: [0, 0, 0], size: 0.55 },
  { id: "planner", label: "Planner", role: "Decomposes the goal into ordered, checkable steps.", position: [-1.9, 1.0, 0.4], size: 0.38 },
  { id: "researcher", label: "Researcher", role: "Retrieves context from docs and the codebase.", position: [1.9, 1.0, -0.4], size: 0.38 },
  { id: "coder", label: "Coder", role: "Writes and edits files, runs the test loop.", position: [-1.9, -1.1, -0.4], size: 0.38 },
  { id: "tools", label: "MCP Tools", role: "Exposes typed tools over the Model Context Protocol.", position: [1.9, -1.1, 0.4], size: 0.38 },
]

const EDGES: [string, string][] = [
  ["manager", "planner"],
  ["manager", "researcher"],
  ["manager", "coder"],
  ["manager", "tools"],
  ["coder", "tools"],
  ["researcher", "planner"],
]

function byId(id: string) {
  return AGENTS.find((a) => a.id === id)!
}

function Nodes({
  selected,
  onSelect,
  reducedMotion,
}: {
  selected: string
  onSelect: (id: string) => void
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const rotating = useRef(!reducedMotion)
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    const stop = () => {
      rotating.current = false
    }
    canvas.addEventListener("pointerdown", stop, { once: true })
    return () => canvas.removeEventListener("pointerdown", stop)
  }, [gl])

  useFrame((_, delta) => {
    if (rotating.current && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {EDGES.map(([a, b], i) => (
        <Line
          key={i}
          points={[byId(a).position, byId(b).position]}
          color="#ffffff"
          transparent
          opacity={0.14}
          lineWidth={1}
        />
      ))}
      {AGENTS.map((agent) => {
        const isSelected = agent.id === selected
        return (
          <group key={agent.id} position={agent.position}>
            <mesh
              scale={isSelected ? 1.15 : 1}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(agent.id)
              }}
            >
              <sphereGeometry args={[agent.size, 24, 24]} />
              <meshStandardMaterial
                color={agent.id === "manager" ? "#3E7BFA" : "#7C8087"}
                metalness={0.35}
                roughness={0.4}
                emissive={agent.id === "manager" ? "#3E7BFA" : "#000000"}
                emissiveIntensity={agent.id === "manager" ? 0.18 : 0}
              />
            </mesh>
            <Html center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  color: "#F5F5F7",
                  textShadow: "0 1px 3px rgb(0 0 0 / .8)",
                  whiteSpace: "nowrap",
                  transform: "translateY(18px)",
                  display: "block",
                }}
              >
                {agent.label}
              </span>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function OrbitRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        dragging.current = true
        last.current = { x: e.clientX, y: e.clientY }
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onPointerMove={(e) => {
        if (!dragging.current || !groupRef.current) return
        const dx = e.clientX - last.current.x
        const dy = e.clientY - last.current.y
        last.current = { x: e.clientX, y: e.clientY }
        rotation.current.y += dx * 0.006
        rotation.current.x = Math.max(-0.61, Math.min(0.61, rotation.current.x + dy * 0.006))
        groupRef.current.rotation.y = rotation.current.y
        groupRef.current.rotation.x = rotation.current.x
      }}
    >
      {children}
    </group>
  )
}

export function OrchestratorScene({
  selected,
  onSelect,
  focused,
  reducedMotion,
}: {
  selected: string
  onSelect: (id: string) => void
  focused: boolean
  reducedMotion: boolean
}) {
  const [ready, setReady] = useState(false)

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      frameloop={focused ? "always" : "demand"}
      camera={{ position: [0, 0, 9], fov: 45 }}
      onCreated={({ camera }) => {
        if (reducedMotion) {
          camera.position.set(0, 0, 7)
          setReady(true)
          return
        }
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 700)
          camera.position.z = 9 - 2 * t
          if (t < 1) requestAnimationFrame(tick)
          else setReady(true)
        }
        requestAnimationFrame(tick)
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 6]} intensity={1.2} />
      <pointLight position={[-6, -4, -4]} intensity={0.5} color="#7C8087" />
      <OrbitRig>
        <Nodes selected={selected} onSelect={onSelect} reducedMotion={reducedMotion || !ready} />
      </OrbitRig>
    </Canvas>
  )
}

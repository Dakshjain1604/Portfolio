"use client";

import React, { useEffect, useRef, useState } from "react";

interface Node {
  name: string;
  type: "subagent" | "tool";
  angle: number; // base position angle
  distance: number; // distance from center
  x: number;
  y: number;
  labelOffset: { x: number; y: number };
}

interface Pulse {
  nodeIndex: number;
  progress: number; // 0 to 1
  speed: number;
}

export function AgentOrchestrationGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Detect screen size and reduced motion settings
    const checkSettings = () => {
      setIsMobile(window.innerWidth < 768);
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
    };

    checkSettings();
    window.addEventListener("resize", checkSettings);

    return () => {
      window.removeEventListener("resize", checkSettings);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Orchestration nodes layout data
    const nodesData: Omit<Node, "x" | "y">[] = [
      { name: "coder-agent", type: "subagent", angle: -Math.PI / 2, distance: 130, labelOffset: { x: 0, y: -15 } },
      { name: "researcher-agent", type: "subagent", angle: -Math.PI / 6, distance: 140, labelOffset: { x: 15, y: 5 } },
      { name: "planner-agent", type: "subagent", angle: -5 * Math.PI / 6, distance: 140, labelOffset: { x: -15, y: 5 } },
      { name: "mcp-server", type: "tool", angle: Math.PI / 6, distance: 150, labelOffset: { x: 15, y: 5 } },
      { name: "file-editor", type: "tool", angle: 5 * Math.PI / 6, distance: 150, labelOffset: { x: -15, y: 5 } },
      { name: "web-search", type: "tool", angle: Math.PI / 2, distance: 130, labelOffset: { x: 0, y: 20 } },
      { name: "terminal", type: "tool", angle: Math.PI + Math.PI / 12, distance: 160, labelOffset: { x: -15, y: -5 } },
    ];

    const nodes: Node[] = nodesData.map((d) => ({
      ...d,
      x: 0,
      y: 0,
    }));

    let pulses: Pulse[] = [];
    let pulseCooldown = 0;
    let driftTime = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // Use device pixel ratio for crisp high-dpi canvas rendering
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Color theme hex values (mirrors CSS variable tokens)
    const colorCyan = "#38BDF8";
    const colorHairline = "rgba(255, 255, 255, 0.08)";
    const colorTextMuted = "#94A3B8";
    const colorSurface = "#0F1420";
    const colorTextHigh = "#F8FAFC";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Center point (Manager)
      const cx = width / 2;
      const cy = height / 2;

      // Update positions with subtle floating/drift (if motion allowed and not on mobile)
      const driftAmplitude = reducedMotion || isMobile ? 0 : 4;
      driftTime += 0.008;

      nodes.forEach((node, idx) => {
        const driftX = Math.sin(driftTime + idx) * driftAmplitude;
        const driftY = Math.cos(driftTime * 0.7 + idx * 1.5) * driftAmplitude;

        // Apply scale factor for small screens to fit neatly
        const distScale = isMobile ? 0.7 : 1.0;
        node.x = cx + Math.cos(node.angle) * node.distance * distScale + driftX;
        node.y = cy + Math.sin(node.angle) * node.distance * distScale + driftY;
      });

      // ── DRAW CONNECTIONS (Borders/Hairlines) ──
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        ctx.strokeStyle = colorHairline;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });

      // ── UPDATE & DRAW PULSES (Signal pulses from manager → agents/tools) ──
      if (!reducedMotion && !isMobile) {
        // Spawn new pulses periodically
        pulseCooldown--;
        if (pulseCooldown <= 0) {
          // Select 1 to 3 random nodes to target
          const targetCount = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < targetCount; i++) {
            const nodeIndex = Math.floor(Math.random() * nodes.length);
            pulses.push({
              nodeIndex,
              progress: 0,
              speed: 0.008 + Math.random() * 0.008,
            });
          }
          pulseCooldown = 150 + Math.random() * 150; // spawn cooldown in frames
        }

        // Animate pulses
        pulses.forEach((pulse) => {
          pulse.progress += pulse.speed;
        });

        // Remove completed pulses
        pulses = pulses.filter((p) => p.progress < 1);

        // Draw pulse dots on connection lines
        pulses.forEach((pulse) => {
          const node = nodes[pulse.nodeIndex];
          const px = cx + pulse.progress * (node.x - cx);
          const py = cy + pulse.progress * (node.y - cy);

          // Draw a small cyan signal light
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = colorCyan;
          ctx.shadowBlur = 8;
          ctx.shadowColor = colorCyan;
          ctx.fill();
          // Reset shadow
          ctx.shadowBlur = 0;
        });
      }

      // ── DRAW OUTER NODES (Subagents & Tools) ──
      nodes.forEach((node) => {
        // Outer dot border & fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colorSurface;
        ctx.strokeStyle = node.type === "subagent" ? colorTextHigh : colorTextMuted;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Node Label (JetBrains Mono style font)
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillStyle = colorTextMuted;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const labelText = `[${node.name}]`;
        ctx.fillText(labelText, node.x + node.labelOffset.x, node.y + node.labelOffset.y);
      });

      // ── DRAW CENTER NODE (Agent Manager) ──
      const managerPulseRadius = reducedMotion || isMobile 
        ? 8 
        : 8 + Math.sin(driftTime * 2.5) * 1.5;

      // Outer glowing ring (very faint signal light effect)
      ctx.beginPath();
      ctx.arc(cx, cy, managerPulseRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Main center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = colorSurface;
      ctx.strokeStyle = colorCyan;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Center manager core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = colorCyan;
      ctx.fill();

      // Manager Label
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillStyle = colorCyan;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("[orchestrator-core]", cx, cy - 20);

      // Continue render loop if animations are active
      if (!reducedMotion && !isMobile) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    // Initial render
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [reducedMotion, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-45 pointer-events-none z-0"
    />
  );
}

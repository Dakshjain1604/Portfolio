# 19 - Liquid Glass modernization

**Trigger:** the shipped build reads as a faithful *classic* macOS simulation (Big Sur-era: opaque dark glass, flat gradient squircles, centered solid menu bar). The user wants it to read as *current* macOS.

**Research basis** (web search, Aug 2026): macOS 26 "Tahoe," released September 2025, replaced the previous material system with **Liquid Glass** - "a translucent material that reflects and refracts its surroundings, while dynamically transforming to help bring greater focus to content" (Apple Newsroom, June 2025). It ships across iOS 26, iPadOS 26, macOS Tahoe, watchOS 26, and tvOS 26 as one coherent language. Concrete, sourced facts that change this build's design system:

| Fact | Source | Implication here |
|---|---|---|
| The menu bar is **transparent by default** - "no longer a traditional bar... floating menu items... no visible background" - with a Settings toggle ("Show menu bar background") to restore a filled bar | idownloadblog, TWiT | `MenuBar.tsx` currently defaults to a permanently filled `.os-glass` bar. Wrong default; needs the toggle too. |
| Dock, sidebars, toolbars, and controls are "crafted from multiple layers of Liquid Glass," with **specular highlights** that respond to light/motion, and refract the wallpaper behind them | Apple Newsroom | Current Dock/Menu/ContextMenu/Window titlebars use flat `.os-glass` (blur + one inset highlight). Needs a real specular sheen layer. |
| **Continuous, more generous corner curves**, "inspired by visionOS" | multiple | Current `--r-window: 12px` reads dated next to Tahoe's rounder frame. |
| App icons are forced into a **uniform squircle**, with **light / dark / tinted / clear** personalization options | 9to5Mac, lapcatsoftware, Apple Newsroom | This build's Squircle primitive already uses the correct 22.5% superellipse ratio (validated, keep it) - the gap is the *material* (flat two-stop gradient) and the missing personalization concept. |
| System Settings gained a **Themes** concept under Appearance: Auto / Light / Dark plus **tint** and a **clear** look | mjtsai.com, Apple Newsroom | This build's System Settings has no Appearance category at all. |
| No official CSS values are published - Apple deliberately does not document exact blur/shadow numbers, since the material is adaptive | superdesign.dev breakdown attempt | Every pixel value below is a reasoned web *approximation*, labeled as such - never claimed as official, per the taste skill's Appendix C rule already followed throughout this build. |

## What changes and what does not

**Does not change:** the window manager physics (drag/resize/tilt/depth), the app content and data, Mission Control's mechanics, the reader view, the mobile springboard's structure, dark-only theming (a full light-mode rebuild is a different, much larger undertaking than "look current" - see the Themes note below). None of phases 1-7's architecture is touched.

**Changes:** the *material* layer only - tokens, the glass utility, and the handful of components that render chrome (MenuBar, Dock, DockIcon, Squircle, Window titlebar, Menu, ContextMenu, MissionControl, Springboard, AppSheet) plus one new small feature (System Settings gains an Appearance pane with a real, working accent-tint picker, since "personalize... tinted... clear look" is one of the most concrete, repeatedly-cited Tahoe changes and is realistically buildable without a light-mode rebuild).

## Phase A - tokens and the glass utility

`globals.css`:
- `--r-window` 12px → **20px**, `--r-card` 10px → **14px**, `--r-control` unchanged (6px, controls stay tight per HIG's 44pt-target logic, not window-chrome logic).
- New `--os-specular` token: the sheen gradient used on every glass surface.
- `.os-glass` gets a second pseudo-element-free layer: a diagonal specular highlight (`background-image` radial/linear gradient at low opacity, `mix-blend-mode: overlay`) layered under the existing inset-highlight box-shadow, plus a stronger `saturate()` for real refraction feel.
- New `.os-glass-clear` variant: near-fully-transparent (the menu bar's default state).

## Phase B - Menu bar and Dock

- `MenuBar.tsx`: defaults to `.os-glass-clear` (no background, text sits directly on the wallpaper with a subtle drop-shadow for legibility over bright wallpaper regions). Add **View > Show Menu Bar Background**, a real checkable menu item toggling a store flag (`menuBarSolid: boolean`) that swaps the class - mirrors the actual Tahoe setting name and location.
- `Dock.tsx` / `DockIcon.tsx`: stronger glass (`.os-glass` with the new specular layer), and each Squircle tile gets its own smaller specular sheen so icons read as "glass over color," not flat gradient chips.

## Phase C - Window chrome and floating panels

- `Window.tsx`, `ResizeHandles.tsx`: adopt `--r-window` at its new value; titlebar gets the specular sheen.
- `Menu.tsx`, `ContextMenu.tsx`, `MissionControl.tsx` backdrop card: adopt `--r-card`, specular sheen.
- Traffic lights: slightly richer saturation, matching Tahoe's darker/more saturated dots.

## Phase D - System Settings Appearance pane + accent tint

New category in `SystemSettings.tsx`: **Appearance**, first in the sidebar (ahead of Agentic AI). Contains:
- A tint swatch row (5-6 accent options). Selecting one writes `--os-accent` via a CSS custom property override at the document root (store-backed, persisted like wallpaper/mode already are).
- A "Clear" toggle mirroring Tahoe's "elegant new clear look" - maximizes transparency (`.os-glass-clear` everywhere it's valid) versus the default balanced glass.

This is the one net-new surface area in this pass, and it is scoped tightly: a tint variable swap and a transparency-level flag, not a light-mode rebuild.

## Phase E - Mobile and final pass

- `Springboard.tsx` dock, `AppSheet.tsx` header: same glass/radius updates.
- Live screenshot verification of Menu bar (both states), Dock, an open window, Mission Control, System Settings' new Appearance pane.
- `tsc` / `eslint` / `build` clean, mechanical pre-flight re-run (radius/z-index/em-dash sweeps), commit.

## Why not a literal light-mode / full Themes rebuild

Real Tahoe's Themes model includes a full light appearance. This build is deliberately dark-locked per the original plan's "Page Theme Lock" rule (one theme, no mid-page inversion, taste-skill-driven). Building a genuine second full palette, re-testing every one of the ~50 components in both modes, is a materially larger effort than "make the existing dark UI read as current-generation Apple glass," which is the actual ask. The accent-tint + clear-glass toggle captures the real, cited "personalization" story without that scope jump. Flagged to the user as a deliberate scope line, not an oversight.

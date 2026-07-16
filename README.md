<<<<<<< HEAD
# Hand Gesture Snake Game

A browser-based Snake game controlled entirely by hand gestures. Point your
webcam at yourself, swipe a finger to steer, and use a handful of other
gestures to pause, speed up, slow down, restart, and exit — no keyboard or
mouse needed to play.

Visual style: dark navy background, glassmorphism panels, blue/emerald
accent gradients — a futuristic "AI dashboard" look.

## Features

- Real-time hand tracking via MediaPipe, running entirely in the browser
- Gesture controls:
  - ☝️ **One finger, swipe** — steer the snake (up / down / left / right)
  - ✋ **Open palm** — pause / resume
  - 👍 **Thumbs up** — speed up
  - 👎 **Thumbs down** — slow down
  - ✌️ **Peace** — restart after Game Over
  - ✊ **Fist** — exit the game (with confirmation)
- Keyboard arrow keys also work, as a fallback / for testing without a camera
- Live webcam feed alongside the game, with score / current gesture /
  current speed shown in a status bar
- Fully responsive: two-column desktop layout, stacked tablet/mobile layout

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Phaser.js (game engine)
- MediaPipe Tasks Vision (hand landmark detection)
- Framer Motion (animation)
- Lucide React (icons)

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`) and
allow camera access when prompted.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. A `vercel.json` is included with SPA rewrite rules,
so the project deploys to Vercel out of the box — just import the repo in
the Vercel dashboard (or run `vercel`), no extra configuration needed.

## Project structure

```
src/
  components/   UI components (modals, nav, panels, info bar)
  pages/        GameScreen — the main gameplay layout
  game/         Phaser scene, game config, game factory
  gestures/     MediaPipe hand tracking, gesture classification, swipe
                detection, debouncing
  hooks/        React hooks tying game/gesture/webcam logic together
  utils/        Shared types and constants
```

## Tuning gesture sensitivity

If swipes feel too twitchy or too sluggish, or gestures misfire, the
thresholds live in `src/gestures/gestureConfig.ts`:

- `GESTURE_DEBOUNCE_FRAMES` — how many consistent frames a gesture needs
  before it's accepted (higher = more stable but slightly more latency)
- `SWIPE_MIN_DISTANCE` — how far the fingertip must move to count as a
  swipe (higher = ignores more small/accidental movement)
- `SWIPE_AXIS_DOMINANCE_RATIO` — how much more horizontal-than-vertical (or
  vice versa) a movement must be to get a clean direction
- `SWIPE_SAMPLE_COOLDOWN_MS` — minimum time between swipe checks

## License

Personal / hackathon project — no license specified.
=======
# Hand-Gesture-Nokia-Snake-Game
>>>>>>> 448604fc881ae3dca4675aa54f467b3659d42c4b

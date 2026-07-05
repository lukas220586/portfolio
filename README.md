# Luca Pugliese — Embedded & Hardware Engineer Portfolio

**Aurora** — Dark premium portfolio for senior embedded/hardware/software engineer.

> Live: `http://localhost:5174/portfolio/`  
> Base path: `/portfolio/` (via `vite.config.ts`)

---

## Indice / Table of Contents

1. [Tech Stack & Plugin](#1-tech-stack--plugin)
2. [Installazione & Avvio](#2-installazione--avvio)
3. [Struttura del Progetto](#3-struttura-del-progetto)
4. [Componenti](#4-componenti)
5. [i18n (EN / IT)](#5-i18n-en--it)
6. [Design System (CSS)](#6-design-system-css)
7. [Dati / Data Files](#7-dati--data-files)
8. [Conversazione Completa (cronistoria)](#8-conversazione-completa-cronistoria)
9. [Comandi NPM](#9-comandi-npm)
10. [Deploy](#10-deploy)

---

## 1. Tech Stack & Plugin

### Runtime / Framework

| Pacchetto | Versione | Ruolo |
|-----------|----------|-------|
| `react` | `^19.2.7` | UI library |
| `react-dom` | `^19.2.7` | DOM renderer |
| `vite` | `^8.1.1` | Build tool / dev server |
| `typescript` | `~6.0.2` | Type checking |
| `@vitejs/plugin-react` | `^6.0.3` | Vite React plugin (Oxc-based) |

### Dev Tools

| Pacchetto | Versione | Ruolo |
|-----------|----------|-------|
| `oxlint` | `^1.71.0` | Linter (Oxc-based, super fast) |
| `gh-pages` | `^6.3.0` | Deploy su GitHub Pages |
| `@types/react` | `^19.2.17` | React type definitions |
| `@types/react-dom` | `^19.2.3` | React DOM type definitions |
| `@types/node` | `^24.13.2` | Node.js type definitions |

### Altri pacchetti in node_modules (dipendenze transitive)

```
@nodelib, @oxc-project, @oxlint, @rolldown
array-union, async, braces, commander, commondir, csstype, detect-libc
dir-glob, email-addresses, escape-string-regexp
fast-glob, fastq, fdir, filename-reserved-regex, filenamify
fill-range, find-cache-dir, find-up, fs-extra
gh-pages, glob-parent, globby, graceful-fs
ignore, is-extglob, is-glob, is-number
jsonfile, lightningcss, locate-path
make-dir, merge2, micromatch
nanoid, oxlint
path-exists, path-type, picocolors, picomatch, pkg-dir
p-limit, p-locate, postcss, p-try
queue-microtask
react, react-dom, reusify, rolldown, run-parallel
scheduler, semver, slash, source-map-js, strip-outer
tinyglobby, to-regex-range, trim-repeated
typescript, undici-types, universalify
vite
```

### Plugin & Config File

**`@vitejs/plugin-react`** (Oxc-based, non SWC) — dichiarato in `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
})
```

**Linter:** `oxlint` con `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

---

## 2. Installazione & Avvio

```bash
# Clona / copia il progetto
cd portfolio

# Installa le dipendenze
npm install

# Avvia il dev server (HMR su http://localhost:5173)
npm run dev

# Build di produzione (output in ./dist)
npm run build

# Preview della build
npm run preview

# Lint
npm run lint
```

> **Nota:** Il dev server è stato avviato su porta **5174** (5173 era occupata).

---

## 3. Struttura del Progetto

```
portfolio/
├── index.html                    # Entry HTML (base /portfolio/)
├── package.json                  # Dipendenze e script
├── package-lock.json
├── vite.config.ts                # Vite config (base: /portfolio/)
├── tsconfig.json                 # TypeScript project references
├── tsconfig.app.json             # TS config per app
├── tsconfig.node.json            # TS config per Node (vite.config)
├── .gitignore
├── .oxlintrc.json                # Linter config
│
├── public/
│   ├── favicon.svg               # Favicon (</> style)
│   ├── icons.svg                 # Icone SVG
│   └── cv.pdf                    # Curriculum PDF
│
├── dist/                         # Build output (generato)
│
├── src/
│   ├── main.tsx                  # Entry React (rende <App />)
│   ├── App.tsx                   # Root component (sezioni in ordine)
│   │
│   ├── components/
│   │   ├── Header.tsx            # Navbar fissa con logo LP + lang toggle
│   │   ├── Hero.tsx              # Full-viewport hero con gradienti animati
│   │   ├── About.tsx             # Bio + citazione tecnica
│   │   ├── Experience.tsx        # Timeline esperienze lavorative
│   │   ├── Projects.tsx          # Griglia progetti (7 categorie)
│   │   ├── Skills.tsx            # 10 gruppi di competenze tecniche
│   │   ├── Contact.tsx           # Form contatti + social + terminal
│   │   └── Footer.tsx            # 3 colonne + copyright
│   │
│   ├── context/
│   │   └── LanguageContext.tsx   # Context per cambio lingua EN/IT
│   │
│   ├── hooks/
│   │   └── useScrollReveal.ts    # IntersectionObserver scroll animation hook
│   │
│   ├── i18n/
│   │   ├── en.ts                 # Traduzioni inglese (tipo esportato)
│   │   └── it.ts                 # Traduzioni italiano
│   │
│   ├── data/
│   │   └── projects.ts           # Dati progetti (7 categorie, 21 progetti)
│   │
│   └── styles/
│       └── global.css            # CSS completo (dark premium theme)
│
└── .goopspec/                    # GoopSpec orchestrazione (non toccare)
```

---

## 4. Componenti

### `Header.tsx`
- Navbar fissa superiore, trasparente → glass-morphism on scroll.
- Logo "LP" in serif italic con gradiente viola/blu.
- Link nav con underline animato.
- Toggle lingua EN/IT (bottoni con stato attivo).

### `Hero.tsx`
- Full viewport (`100vh`).
- 3 gradient orbs fluttuanti con animazione CSS.
- Griglia overlay con mask radiale.
- Badge "Open for consulting & contract work".
- Nome con gradiente testo `#f0f0f5 → #c4b5fd → #7c3aed → #3b82f6`.
- Ruolo in box glass-morphism con cursore lampeggiante.
- 2 CTA buttons: "View My Work" (gradient, glow) e "Get In Touch" (outline).

### `About.tsx`
- Paragrafi con animazione fade-in progressiva (stagger).
- Citazione in box con bordo sinistro viola + font monospace.

### `Experience.tsx`
- Timeline verticale con linea gradiente viola → trasparente.
- 3 item con pallini colorati (viola / blu / verde).
- Tag tecnici con badge color-coordinati.
- Animazione `fade-left` con delay progressivo.

### `Projects.tsx`
- Flat project list (da tutte le 7 categorie).
- Card con:
  - Placeholder gradient `{ }` monospace.
  - Tag viola in pill.
  - Titolo e descrizione.
  - Hover: translateY(-6px) + shadow glow + bordo superiore gradient.
- Griglia responsive: `repeat(auto-fill, minmax(340px, 1fr))`.

### `Skills.tsx`
- 10 gruppi verticali (griglia 2 colonne).
- Ogni card ha: label, count badge, chips monospace.
- Hover: bordo viola + glow.
- Colori distinti per ogni gruppo.

### `Contact.tsx`
- Griglia 2 colonne (responsive → 1 colonna su mobile).
- Sinistra: form input con focus glow viola.
- Destra: vetro con titolo, descrizione, social links (GitHub, LinkedIn, Email).
- Terminale finto stile bash: `$ echo "available for work"`.

### `Footer.tsx`
- Griglia 3 colonne (brand + menu + social).
- Brand "LP" gradient.
- Divider sottile + copyright.

---

## 5. i18n (EN / IT)

Sistema di traduzione manuale via React Context (`LanguageContext.tsx`).

| File | Lingua | Schema type |
|------|--------|-------------|
| `src/i18n/en.ts` | Inglese (default) | `Translations` (esportato come `typeof en`) |
| `src/i18n/it.ts` | Italiano | `Translations` (importa il tipo da `en.ts`) |

**Sezioni tradotte:**
- `nav` — link navigazione (+ `skills`)
- `hero` — badge, name, role, cta, contact
- `about` — p1, p2, quote
- `experience` — title, desc, 3 items con highlights
- `projects` — title, desc
- `skills` — title, desc
- `contact` — title, desc, form labels, connect
- `footer` — description, menu, connect, 3 articles
- `lang` — switch label

Toggle: bottoni `EN` / `IT` nella navbar, stato attivo evidenziato con gradiente.

---

## 6. Design System (CSS)

### Variabili CSS (`:root`)

| Categoria | Variabili chiave |
|-----------|------------------|
| **Background** | `--bg-primary: #08080e`, `--bg-secondary: #0d0d1a`, `--bg-card: rgba(255,255,255,0.03)`, `--bg-glass: rgba(255,255,255,0.04)` |
| **Gradienti** | `--gradient-primary: linear-gradient(135deg, #7c3aed, #3b82f6)`, `--gradient-hero`, `--gradient-card`, `--gradient-glow` |
| **Testo** | `--text-primary: #f0f0f5`, `--text-secondary: #9494a6`, `--text-tertiary: #5c5c6e`, `--text-accent: #a78bfa` |
| **Accenti** | `--accent-purple: #7c3aed`, `--accent-blue: #3b82f6`, `--accent-cyan: #06b6d4`, `--accent-pink: #ec4899`, `--accent-green: #10b981` |
| **Bordi** | `--border-color: rgba(255,255,255,0.06)`, `--border-hover: rgba(124,58,237,0.3)` |
| **Ombre** | `--shadow-md`, `--shadow-lg`, `--shadow-glow: 0 0 30px rgba(124,58,237,0.15)` |
| **Font** | `--font-sans: Inter`, `--font-mono: JetBrains Mono` |
| **Raggi** | `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 20px` |
| **Transition** | `--transition-fast: 0.2s`, `--transition-base: 0.3s`, `--transition-slow: 0.5s` |

### Classi CSS principali

| Classe | Ruolo |
|--------|-------|
| `.glass` | Glass-morphism card base |
| `.navbar` / `.navbar--scrolled` | Navbar fissa trasparente/vetrosa |
| `.hero` / `.hero__gradient-orb` | Hero full-viewport con orbs animati |
| `.project-card` | Card progetto con hover glow |
| `.skill-card` | Card competenza |
| `.timeline` / `.timeline__item` | Timeline esperienza |
| `.contact-grid` | Griglia contatti 2 colonne |
| `.footer` / `.footer__inner` | Footer 3 colonne |
| `.btn--primary` / `.btn--outline` | Bottoni gradient/outline |
| `.form-input` | Input form con focus glow |

### Animazioni

| Classe animazione | Effetto | Trigger |
|-------------------|---------|--------|
| `.animate-fade-up` | translateY(30px) → 0, opacity 0 → 1 | `.is-visible` (IntersectionObserver) |
| `.animate-fade-left` | translateX(-30px) → 0 | `.is-visible` |
| `.animate-fade-right` | translateX(30px) → 0 | `.is-visible` |
| `.animate-scale` | scale(0.9) → 1 | `.is-visible` |
| `.stagger` | Stagger sui children | `.is-visible` |
| `@keyframes heroFloat` | Fluttuazione orbs hero | Continua |
| `@keyframes pulse` | Pulse dot badge hero | Continua |
| `@keyframes blink` | Cursore lampeggiante | Continua |

Scroll hook: `useScrollReveal()` in `src/hooks/useScrollReveal.ts` — usa `IntersectionObserver` con threshold 0.1, supporta delay personalizzato.

### Scrollbar personalizzata
- Larghezza 8px, traccia `#08080e`, thumb viola semitrasparente.

### Selezione testo
- `::selection` con background viola `rgba(124,58,237,0.3)`.

---

## 7. Dati / Data Files

### `src/data/projects.ts`

7 categorie, 21 progetti tecnici:

| Categoria | ID | # Progetti |
|-----------|----|-----------|
| Firmware & Embedded | `firmware` | 3 |
| Reverse Engineering | `reverse-engineering` | 3 |
| Hardware & PCB Design | `hardware` | 3 |
| Audio & Hi-Fi | `audio` | 3 |
| 3D Printing, CNC & Laser | `mechanical` | 3 |
| Industrial Automation | `industrial` | 2 |
| Software & Tooling | `software` | 3 |

Ogni progetto ha: `title`, `desc`, `tags[]`, `links[]?`.

### `src/i18n/en.ts` (type `Translations`)

Schema completo del tipo di traduzione (esportato). Include tutte le sezioni del portfolio.

### `src/i18n/it.ts`

Implementa lo stesso schema di `Translations` in italiano.

---

## 8. Conversazione Completa (cronistoria)

### Fase 0 — Scaffolding iniziale (Vite + React + TS)

- Creato progetto con `npm create vite@latest portfolio -- --template react-ts`
- Pulizia dei file boilerplate (`App.css`, `index.css`, assets)
- Setup `vite.config.ts` con base path `/portfolio/`
- Installato `gh-pages` per deploy

### Fase 1 — Primo redesign (Coderon theme, light mode, blog-style)

- Riscritto `global.css` con tema Coderon (light mode, Poppins + Roboto Mono, purple/pink gradient)
- Creati 8 componenti con stile blog
- Aggiunto `LanguageContext.tsx` per toggle EN/IT
- Traduzioni complete in `en.ts` / `it.ts`
- Dati progetti (`projects.ts`) con 7 categorie tecniche
- 10 skill groups
- 3 esperienze lavorative

### Fase 2 — Immagini e avatar

- Hero avatar: foto Unsplash → iniziali "LP" su gradiente serif italic
- Hero workspace: foto Unsplash → gradiente scuro con tech stack tags
- Tutte le card (experience, projects, skills, footer): foto Unsplash → gradienti CSS + testo

### Fase 3 — Richiesta "wow, professionale"

- L'utente ha criticato il design come non all'altezza di un curriculum
- Scelta: **dark mode premium** con gradienti viola/blu, glass-morphism, animazioni
- Hero full-viewport con 3 gradient orbs fluttuanti + griglia overlay
- Progetti in griglia visuale con hover 3D/lift
- Timeline esperienza
- Skills in griglia 2 colonne con badge colorati
- Contatti con terminale finto bash
- Nome del tema: **Aurora**

### Stato attuale (al 2026-07-04)

- Build pulita (`tsc --noEmit` zero errori)
- Dev server su `http://localhost:5174/portfolio/`
- HMR funzionante (hot module replacement)
- Tema dark premium completo
- EN/IT toggle funzionante
- Zero dipendenze esterne per immagini (tutto CSS)

---

## 9. Comandi NPM

```bash
npm run dev        # Avvia dev server Vite (HMR)
npm run build      # TypeScript check + Vite build
npm run preview    # Preview della build di produzione
npm run lint       # Oxlint (React + TypeScript + Oxc rules)
npm run deploy     # Deploy su GitHub Pages (gh-pages -d dist)
```

---

## 10. Deploy

Il deploy è configurato per **GitHub Pages** tramite `gh-pages`:

```bash
npm run build      # genera dist/
npm run deploy     # push dist/ sul branch gh-pages
```

**URL:** `https://<username>.github.io/portfolio/`

Configurazione base path in `vite.config.ts`:

```ts
base: '/portfolio/',
```

---

## 11. OpenCode — Plugin di Sistema

Plugin installati in `%USERPROFILE%\.config\opencode\opencode.jsonc` usati per sviluppare il progetto.

### Plugin attivi

| Plugin | Ruolo |
|--------|-------|
| `goopspec` | Framework spec-driven development (5-phas) |
| `oh-my-openagent@latest` | 10 agenti specializzati aggiuntivi |
| `opencode-wakatime` | Tracciamento tempo di coding |
| `opencode-helicone-session` | Tracing sessioni per debug LLM |
| `opencode-vibeguard` | Filtro contestuale / guardrail risposte |
| `opencode-worktree` | Gestione git worktree |
| `opencode-notify` | Notifiche di sistema |
| `@tarquinen/opencode-dcp` | Dynamic Context Protocol |
| `@franlol/opencode-md-table-formatter` | Formattazione tabelle markdown |
| `opencode-autotitle` | Titoli automatici conversazione |
| `opencode-smart-title` | Titoli intelligenti |
| `opencode-quotes-plugin` | Citazioni casuali |
| `opencode-froggy` | Utility varia |

### Plugin nativi built-in (`plugins\`)

| Plugin | Ruolo |
|--------|-------|
| `background-agents` | Esecuzione agenti in background |
| `command-inject` | Iniezione comandi npm/make/skill |
| `direnv` | Caricamento variabili ambiente per directory |
| `notificator` | Suonerie di notifica |
| `notifier` | Notifiche desktop |
| `pty` | Terminale pseudo-TTY integrato |
| `type-inject` | Type injection per tool calls |
| `websearch-cited` | Ricerca web con citazioni |

### Agenti Oh-My-OpenAgent

Tutti configurati su modello `opencode/gpt-5-nano`:

| Agente | Ruolo |
|--------|-------|
| `hephaestus` | Ingegneria / fabbricazione |
| `oracle` | Conoscenza generale |
| `librarian` | Ricerca documentazione |
| `explore` | Esplorazione codebase |
| `multimodal-looker` | Analisi immagini |
| `prometheus` | Automazione avanzata |
| `metis` | Problem solving strategico |
| `momus` | Critico / revisione codice |
| `atlas` | Architettura e scaling |
| `sisyphus-junior` | Task ripetitive |

### Percorso configurazione

```
%USERPROFILE%\.config\opencode\
├── opencode.jsonc          # Plugin registrati
├── oh-my-openagent.json    # Agenti e modelli
├── config.json             # Config generale
├── plugins\                # Plugin nativi
├── skills\                 # Skill personalizzate
└── node_modules\           # Dipendenze plugin
```

---

## Crediti

- Built by **Luca Pugliese** — Senior Embedded & Hardware Engineer
- Stack: React 19 + TypeScript 6 + Vite 8
- Design: **Aurora** (custom, dark premium)
- Icone social: inline SVG (zero dipendenze icon library)
- Font: Inter + JetBrains Mono (system fonts, zero external font loading)
- AI Assistant: OpenCode + GoopSpec + Oh-My-OpenAgent

---

*"Se non esiste, si progetta e si costruisce."*

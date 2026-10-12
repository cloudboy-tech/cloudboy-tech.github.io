# Agent entry point — Cloudboy

**First read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).** It records the editorial vision, approved design direction, actual site state, deployment decisions and boundaries.

Cloudboy is a **personal engineering lab about cloud technologies and distributed systems in general**, not a Kubernetes/WASM-themed brand, SaaS product or public cloud training platform.

**Current implementation:** static, dependency-free `index.html` with restrained dark-blue design, a real in-article client-side quorum demo, and several *planned* article topics. Keep finished content distinct from placeholders. Check it in a real browser after changes.

**Design constraints:** Quiet typography and whitespace; avoid cluttered dashboards, fake metrics and decorative neon. Interactive explanations belong inside articles when educationally useful, not all over the homepage.

**Deployment:** `main` → GitHub Pages after enabled in Settings. Custom domain `cloudboy.tech` is intended; do not assume DNS/HTTPS is configured. Do not disturb email DNS records.

**Related research:** [Support Shell](https://github.com/totaki/support-shell/blob/main/docs/PROJECT_CONTEXT.md) is one possible lab writeup, not the website's entire identity.

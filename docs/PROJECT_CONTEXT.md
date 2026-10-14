# Project Context — Cloudboy

> Handoff for a new developer or AI agent. Updated 2026-10-14. Read this before changing layout, content, navigation or deployment.

## 1. Vision and identity

**Cloudboy / cloudboy.tech** is a **personal engineering showcase and public laboratory about cloud technologies and distributed systems**. It is not a SaaS product, Kubernetes-only blog, WASM-only blog, generic technical course marketplace, or an always-on interactive playground.

The author wants to explore interesting engineering problems, publish reproducible experiments (including failed hypotheses) and open-source artifacts, and communicate their professional interests. Topics are intentionally broad:

- cloud architecture, virtualization and infrastructure;
- distributed algorithms, coordination, consistency, quorum and fault tolerance;
- networking, routing, BGP, load balancing and L2/L3 behavior;
- storage, replication, availability and recovery;
- observability, runtime isolation, security and engineering trade-offs;
- Kubernetes and WASM/WASI **when relevant**, as examples among many.

**Do not frame the site around Kubernetes or WASM.** That was explicitly rejected. The home page should communicate *cloud technologies and distributed systems*, not individual stacks or tools.

The preferred editorial model is **articles containing small interactive explanations**—readers can change parameters and see how a system behaves. It is *not* an educational resource where everyone logs in to provision cloud labs.

## 2. Design direction

The first generated mockup was too busy: glowing SaaS dashboards, metrics, many cards, heavy 3D decorations and too many simultaneous features. That visual direction was explicitly rejected.

The agreed direction:

- A restrained, high-quality **engineering journal** with a modern product-design aesthetic.
- Dark navy / blue palette, readable typography, intentional whitespace, quiet borders and limited accent color.
- Large clear headline, a **single subtle technical diagram** rather than decorative complexity.
- Homepage: short introduction, selected experiments / writings, open-source projects, about/contact.
- Small interactive simulations belong **inside articles** where they explain a concrete concept.
- Avoid fabricated metrics, fake popularity counters, premature "enterprise" badges, meaningless animations or invented publication dates.
- Favor useful, accurate diagrams and approachable reading layout on desktop and mobile.

A Dribbble incident-management marketing site was an **aesthetic inspiration**, not a UI specification; do not copy it or transform Cloudboy into a SaaS dashboard.

## 3. Current implementation — what really exists

Repository: https://github.com/cloudboy-tech/cloudboy-tech.github.io  
Intended canonical domain: **https://cloudboy.tech**  
GitHub Pages org URL (when enabled): https://cloudboy-tech.github.io

- Static proof of concept deployed as `index.html` in `main`.
- **No frontend framework, npm install, backend, database, cloud cluster, login or content management system.**
- CSS, SVG illustrations, layout, navigation and JS interaction are all in **one self-contained HTML file**.
- `.nojekyll` is committed for Pages, plus `README.md` with hosting/DNS instructions.
- Homepage introduction: **«Лаборатория инженерных решений»**; Cloudboy is a personal experimental infrastructure lab, not a consulting business.
- One actual interactive article, opened via the `#quorum` route: **"Кворум: когда кластер перестаёт отвечать?"**. Readers can change cluster node count, simulate failed nodes and observe how the majority threshold changes.
- Remaining lab items (object storage and zone failure, cloud networking, resilience trade-offs) are **ideas/placeholders**, not published investigations.
- **Support Shell** now has a standalone interactive writeup at [support-shell.html](../support-shell.html), linked from the homepage laboratory list. Its separate research source remains https://github.com/totaki/support-shell.
  - Standalone static files: `support-shell.html`, `assets/support-shell.css`, `assets/support-shell.js`; no backend or framework.
  - Interactive local-only illustrations: terminal command examples, CLI/AI/MCP surface switching, execution flow, WASM Host capability gate, permission matrix with simulated MCP deny rule, actual plugins (diagnostics/network plus test fixture), session-context examples, table/text/JSON views, adapter comparison, and execution timeline.
  - All example cluster names, findings and node statuses are **synthetic**; the page performs no remote provider calls. The sandbox is not represented as fully hardened, MCP is stdio only, and the PoC is not promoted as a support product.
- Mobile responsive layout was considered in the prototype and visually reviewed, but real browser/device compatibility should be tested again after meaningful changes.

**Do not falsely describe placeholders as completed articles, real measurements or deployed infrastructure.** This is a design/content prototype, not a finished publication.

## 4. Editorial format for future articles

An experiment should be rooted in a **real engineering question**, not in the need to fill a content grid.

Suggested structure (flexible, not a rigid template):

1. Question / trade-off and context.
2. Hypothesis or what we are trying to learn.
3. Environment and reproducible setup (code, commands, links when applicable).
4. Interactive model **only where it improves understanding**, with stated assumptions.
5. Results and observations from real tests, clearly distinguished from simulated behavior.
6. Limitations, mistakes, conclusions and source artifacts.

Good article directions: quorum and availability; route reflectors and BGP session scaling; zone failure and replication placement; registry cache behavior; network segmentation; control-plane failure modes. **These are directions, not a product roadmap or claims that such posts already exist.**

Do not run real cloud resources from a public web browser by default. Prefer client-side interactive models; live infrastructure experiments require an explicit threat model, abuse controls and cost planning.

## 5. Technical and deployment decisions

GitHub Pages is the intended hosting platform: minimal operational overhead, public version control and easy deployment. Keep the site statically publishable.

Current simple workflow:

```bash
git clone https://github.com/cloudboy-tech/cloudboy-tech.github.io.git
cd cloudboy-tech.github.io
# Edit index.html; open it locally in a browser to check.
git add index.html
git commit -m "..."
git push origin main
```

No build is required for the current prototype. A future migration to Astro/MDX with isolated interactive components **could** make sense when the article count justifies it; **do not introduce a framework or CMS without a concrete maintenance need**.

### GitHub Pages activation

The repository and `main` branch exist, but **Pages activation and successful custom-domain DNS/HTTPS are not asserted by this document**. Verify the current settings and live URL before claiming publication.

For branch-based deployment: `Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)`. A user with admin rights may need to enable this.

Custom domain setup is separate: GitHub Pages `Custom domain = cloudboy.tech`, DNS records at the domain provider, HTTPS after verification. Do **not** change or delete unrelated existing MX/TXT email records. Check GitHub Pages' current DNS instructions; do not assume a DNS change has already been made. Do not add a `CNAME` file until the domain is being configured.

## 6. Connection to Support Shell / other projects

Support Shell is a separate engineering PoC exploring Go REPL, Extism/WASI plugins, MCP and capability-restricted tool execution. It is suitable as an honest *lab note* about what worked and why a separate AI shell was not justified, but **it must not define the Cloudboy brand**.

Support Shell context: https://github.com/totaki/support-shell/blob/main/docs/PROJECT_CONTEXT.md

Cloudboy may host articles, project summaries and interactive explainers across many domains; it is **not** dependent on Support Shell, Kubernetes clusters or agent infrastructure.

## 7. Instructions for the next agent

1. Read this context and current `index.html` / `README.md` first; inspect existing layout before suggesting redesign.
2. Respect the agreed **quiet visual direction**. The earlier neon/dashboard-heavy variant was rejected.
3. Keep scope narrow; change one page or one reusable interaction at a time and show working results.
4. Favor meaningful, factually correct models; disclose simplifying assumptions. Keep mobile, keyboard access and readability in mind.
5. Before claiming a feature is complete, verify it in a browser. Before claiming the site is published, verify Pages deployment and DNS/HTTPS independently.
6. Don't replace the site's broad cloud/distributed-systems focus with a narrow focus on Kubernetes/WASM or invent company-like marketing copy.
7. Preserve user content and Git history; commit small changes to this repo when asked. `main` is the working branch.

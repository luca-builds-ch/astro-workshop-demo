# Atelier Nord — WordPress content rebuilt with Astro

A static Astro implementation of the content and layout from our [WordPress shortcode sample](https://github.com/luca-builds-ch/wordpress-shortcode-demo). Seven records produce six upcoming workshops at build time; JavaScript adds material filtering, an empty state and reset without making the content depend on client-side rendering.

Atelier Nord is an independent portfolio exercise with fictional events, fees and generated imagery, not a customer project. The page has no booking, payment flow, external API or live CMS connection.

## What was transferred

Content was manually ported from `demo/seed.php`. This is not an automated WordPress export tool and does not load PHP or connect to WordPress.

| WordPress sample | Astro implementation |
| --- | --- |
| `atelier_workshop` posts: title and excerpt | Typed `Workshop` records in `src/data/workshops.ts` |
| `atelier_topic` taxonomy | Typed topic keys, shared labels and a native select filter |
| `_atelier_start_utc` Unix seconds | Explicit UTC ISO strings ending in `Z`; compared as epoch milliseconds |
| `_atelier_fee` | `feeChf`; zero displays as “Free” |
| `WP_Query` selects and orders upcoming posts | `upcomingWorkshops()` selects and orders at build time |
| Shortcode card markup | Reusable `WorkshopCard.astro` component |
| Own demo theme | Shared original design, local CSS and local material artwork; no external font or image requests |

The clock is fixed at **8 September 2026, 18:30 Europe/Zurich** (`2026-09-08T16:30:00Z`). There are six upcoming results and two per populated topic. Rebuilding on a later day keeps this fixed programme; it is not a live event feed.

Dates are compared as actual instants and displayed in `Europe/Zurich`; sorting does not mutate the source array.

## Run locally

Prerequisites: **Node.js 24** and **pnpm 11.19.0**. Astro and the checking tools are project dependencies; no globally installed Astro is needed.

```sh
pnpm install --frozen-lockfile --store-dir .pnpm-store
pnpm test
pnpm build
pnpm preview
```

Open `http://127.0.0.1:8787/astro-workshop-demo/`. The preview script binds only to `127.0.0.1`. The configured `/astro-workshop-demo/` base path applies to both local preview and the prepared GitHub Pages deployment. `pnpm build` runs `astro check` first and produces the static files in `dist/`.

`pnpm-workspace.yaml` permits the install script for exactly `esbuild@0.28.2`, required by the pinned build toolchain. Other dependency build scripts remain subject to pnpm's default approval policy. Review and update this exact-version rule when upgrading esbuild. [pnpm build settings](https://pnpm.io/settings/build#allowbuilds).

Astro 7 starts preview as a background service. From this project directory:

```sh
pnpm run preview:status
pnpm run preview:stop
```

For development, use `pnpm dev` and stop it with Ctrl+C. The GitHub Pages workflow is prepared; a public live deployment has not yet been verified. Building starts a local esbuild subprocess.

Pinned toolchain: Astro **7.3.1**, `@astrojs/check` **0.9.10**, TypeScript **6.0.3**. TypeScript 6 is deliberate: this Astro checking tool currently requires the JavaScript compiler API that TypeScript 7 does not expose.

## Behaviour to inspect

1. Open `/astro-workshop-demo/#workshops`: all six upcoming cards render in chronological order.
2. Select Paper, Wood or Repair: two matching workshop rows remain; the live status updates.
3. Select “Ceramics (no workshops)”: zero rows and a useful empty state appear. “Show all workshops” restores six rows and returns keyboard focus to the select.
4. Disable JavaScript and reload: all six cards remain readable, the unavailable filter stays hidden, and a short explanation is shown.
5. Use the skip link and keyboard controls; inspect narrow mobile and desktop layouts. Each workshop photograph has a descriptive alt attribute.

The hero image is shared with the WordPress sample. Each workshop has its own local photograph selected by stable record ID, with descriptive alt text, explicit dimensions, lazy loading and bounded thumbnail sizes. No third-party brand assets are used.

## Validation

Executed on 8 September 2026 with Node **24.19.0** on Windows:

- `pnpm test`: **3 passing tests** against the actual data and functions used by the Astro source.
- `pnpm build`: Astro diagnostics **0 errors, 0 warnings, 0 hints**; successful static build of one page.
- HTTP checks: **200** for the page, hero and six workshop photographs; six rendered rows and correct title/photo/alt associations.
- Clean pnpm 11.19.0 installation check: the exact-version esbuild approval passed an offline install with the frozen lockfile, followed by all three tests and the static build. Without that approval, the same fresh installation reproduced `ERR_PNPM_IGNORED_BUILDS`.

The tests cover chronological selection and the inclusive cutoff, topic filters and empty results, UTC input validation, and the repeated local minute at Zurich's autumn clock change. They use Node's built-in runner with `--test-isolation=none` and do not modify source records or use the network.

The current English page passed browser review at 1440px desktop and 375px mobile: all six photographs loaded without horizontal overflow. Paper displayed two matching workshops; Ceramics displayed the empty state; reset restored six workshops and returned focus to the topic selector. The screenshots above are actual browser captures of this revision.

## Views

![Desktop view](astro-desktop.png?revision=photos-20260908)

[Mobile view](astro-mobile.png)

## Publish manifest

Publish only these **25 files**, including the deployment workflow, reviewed browser screenshots and locally served imagery:

```text
.gitignore
.github/workflows/deploy.yml
astro.config.mjs
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.json
README.md
LICENSE
astro-desktop.png
astro-mobile.png
public/atelier-material-hero.png
public/README.md
public/workshops/README.md
public/workshops/handmade-notebook.png
public/workshops/clothing-repair.png
public/workshops/wood-pencil-holder.png
public/workshops/paper-folding.png
public/workshops/wood-restoration.png
public/workshops/wooden-tray.png
src/components/WorkshopCard.astro
src/data/workshops.ts
src/pages/index.astro
src/styles/global.css
tests/workshops.test.mjs
```

Do not include `node_modules/`, `.pnpm-store/`, `.astro/`, `dist/`, preview state or local logs. The runtime downloads and generated files are not part of the source sample. No credentials or database are needed.

## Technical references

- [Astro installation](https://docs.astro.build/en/install-and-setup/): local installation and project structure.
- [Astro scripts and event handling](https://docs.astro.build/en/guides/client-side-scripts/): the page's processed TypeScript script enhances existing HTML controls.
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/): `astro check` validates `.astro` files; the build alone is not a type check.

GPL-2.0-or-later, consistent with the original demo's own code and theme. See [LICENSE](LICENSE). Third-party dependencies retain their respective licenses.

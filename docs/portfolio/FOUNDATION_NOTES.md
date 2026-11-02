# Foundation findings and validation

Inspection date: 2026-10-26, America/Los_Angeles.

## Initial new repository

- Working directory: `/Users/ally/Github/portfolio`.
- Branch: `main`, tracking `origin/main`, initially clean.
- Initial commit: `0d00747` (Initial commit).
- Only tracked working file at inspection: `README.md`, 11 bytes (`# portfolio`).
- Fetch/push origin: `https://github.com/allyytc/portfolio.git`.
- No existing app, assets, deployment workflows, domain files, or package manifest. No user changes were overwritten.

## Read-only original inspection

Used only GET operations through the GitHub connector and a read-only live-homepage HTTP request. No checkout of the original repository was required; no original files, settings, branches, remotes, or deployments were altered.

Original repository: `allyytc/allyytc.github.io`; inspected `main` commit `35ecfec2c43c535ea013e23720ffa6ad73108f10`. Recursive tree response was complete. Live homepage matched pinned source apart from the snapshot writer's initial trailing newline, subsequently corrected. All 15 saved snapshots were verified byte-for-byte against their original Git blob SHAs. Live parity was checked only for the homepage; source content for all six static pages and six content-bearing prototype components was inspected.

Preservation output:

- Nine software project records, plus Unwrap as pending future scope.
- Eleven graphics, three sticker collections, additional Innovation Jam materials.
- Five organizations and three event case studies.
- Education, About, experience, all skills, direct contact details, resume reference, external URLs, and source captions/contributions.
- Complete original file manifest and 244 media locations (metadata only; no image/model downloads).
- Fifteen inert `.txt` source snapshots: six HTML pages, three JS files, six React content components.
- Human-readable static page text and source-associated link appendix.

Only missing literal local HTML file reference found: `allychen-resume2028-pm.pdf`, referenced by all six pages. The complete tree contains no resume PDF. Dynamic data and URL strings are retained in the original JS/HTML snapshots; no assumption is made that all third-party targets work.

## Foundation decisions

- React/React DOM are the only runtime dependencies; TypeScript, Vite, React plugin, and React types are development dependencies. All installed versions are pinned exactly and locked in `package-lock.json`.
- React Three Fiber/Three.js are deliberately deferred until scene work actually imports them, satisfying the instruction not to install unused libraries. `src/studio/README.md` records their future boundary and Blender source/export locations.
- Minimal local HTML shell uses approved identity/role copy and verified source email. Resume status is directly accessible, with no fabricated or broken download. Explore Mode, Quick View, project migration, and room interactions are not implemented yet.
- Vite uses a relative build base, with no hosting/domain decision. Local servers bind to `127.0.0.1`. Temporary foundation HTML requests no indexing; that meta tag is not a production-access security control.
- No original prototype code or placeholder data is imported into the runtime app. No router, animation/helper library, external font, paid API, analytics, or 3D package is installed speculatively.
- No hosting configuration, CI deployment workflow, CNAME, paid account, model download, Blender operation, commit, or push was performed.

## Validation

- `npm run build`: passed strict `tsc --noEmit` and Vite production bundling.
- `npm run dev`: started successfully on localhost; HTTP GET `/` returned the foundation entry HTML.
- `npm audit --omit=dev`: zero reported vulnerabilities in runtime dependencies at setup time; development dependencies were outside that audit's scope.
- Source snapshots: all 15 blob hashes verified against pinned manifest.
- Literal static local file references checked against complete source tree; resume absence documented.
- `git diff --check`: passed for tracked changes; new source/docs reviewed locally.
- Destination origin remains `allyytc/portfolio`; original repository not present as a local remote.

No custom test suite was added for this minimal foundation. Build and local-serving checks cover the current setup; visual scene/mobile/WebGL checks belong to the later implementation phase.

## Remaining verification

Foundation has no blocking dependency. A working resume download requires the correct PDF, Unwrap requires verified project content, and prototype/static discrepancies require resolution before public content migration. See `CONTENT_INVENTORY.md` for details. Existing third-party asset reuse rights must be confirmed before publication.

Work stops at setup. Do not proceed to asset discovery, downloads, modeling, or the room until the next user instruction.

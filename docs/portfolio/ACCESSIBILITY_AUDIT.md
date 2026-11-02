# Phase 7B — accessibility audit

Scope: local Chrome automated and interaction checks, 2026-10-29. This is **not a formal WCAG 2.2 AA compliance certification**. The approved room, real portfolio content and captions remain intact.

## Automated findings and fixes

axe-core 4.11.1 runs WCAG 2 A/AA, 2.1 AA and 2.2 AA tags against the homepage, Projects explorer, KO.rbit, About/Education, Experience, Skills, Community, Innovation Jam, Design/Unwrap overview and Contact. A graphics-context-loss fallback is also audited. [panel-accessibility.json](evidence/phase7b/panel-accessibility.json) retains full final violations, incomplete/manual checks and pass counts for the selected panels; per-viewport baseline/optimized homepage audits are `baseline-axe-*.json` and `after-axe-*.json`.

Baseline homepage audits found one contrast rule affecting four text nodes on each viewport: subtitle/eyebrow and three footer items. Measured examples were 3.77:1, 4.48:1 and 4.23:1 where normal text required 4.5:1. Selected-panel review also found faint chrome labels, picker text and community-card/action text. Those labels, secondary text, status/fallback/loading text and small tags now use stronger sage/ink values. The selected final automated states report zero violations. An automated absence of violations does not assess every photo description, state or assistive-technology experience.

## Verified behavior

- All important destinations have HTML paths independent of 3D, including separate Experience/Skills and immediate header Resume/Contact. A generated, source-backed text portfolio works without JavaScript or WebGL.
- Quick View uses a native button with expanded/controls attributes, logical tab order, a labeled camera option, labeled lighter-rendering option, Escape dismissal and stable return focus. Outside click dismissal does not interrupt native touch scrolling.
- Native dialogs retain browser focus containment, labeled close/back controls, Escape close, opaque sticky chrome and appropriate heading focus. Image lightbox keyboard arrows, captions, close and thumbnail focus are preserved. Projects/Community/archive return restore reading position and the relevant filter/focus target.
- The skip link focuses Quick View without changing the shareable content route. Hash URL refresh, browser Back/Forward, invalid-link recovery and return-to-studio are checked.
- Reduced-motion CSS disables nonessential transitions and the existing camera/printer reduced-motion paths remain. Scene rotation/zoom is bounded, deliberate and touch opt-in; modal background camera controls remain blocked and object drags do not activate clicks.
- New navigation and primary controls have usable touch targets; close control and skill/category/section controls were brought to at least 44px where applicable. Native focus indicators remain visible. Color is supplemented by labels/checked/pressed state.
- Original image alt/caption associations remain. UI captures are real source media; uncaptioned original photos retain neutral context/sequence descriptions, without invented identities or events.
- GLB/decoder failure, missing baked texture, context loss and content-module failure retain essential HTML recovery, working PDF/contact links and the text portfolio. No white placeholder room is offered as a finished scene.

## Coverage limits and launch audit

Tested viewport layouts include phone, tablet, laptop and desktop, with real browser touch events in emulated contexts. These are not physical iPhone/Android tests. VoiceOver/NVDA speech output, real mobile screen readers, browser 200%/400% zoom, forced-colors/high-contrast mode, switch input and all older browser/device combinations have not been certified by this run. Review original generic photo alt/captions with the owner; automation cannot determine their editorial adequacy. Review the static text companion with assistive technology as well as the main app.

Lighthouse accessibility is recorded as a local three-run median in `comparison.json`; it is a diagnostic score, not a conformance claim. Preserve the original scope: no content invention, no paid tooling, no original-site changes or deployment. Phase 8 requires an independent human/technical launch audit and explicit approval.

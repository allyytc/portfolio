# Existing portfolio content inventory

Inspected 2026-10-26 (America/Los_Angeles). This is a preservation inventory, not newly authored portfolio copy.

## Sources and preservation method

- New destination: <https://github.com/allyytc/portfolio>, initially clean `main`, tracking `origin/main`, commit `0d00747` (Initial commit), with only an 11-byte README. No existing app, dependencies, assets, or deployment files.
- Original read-only source: <https://github.com/allyytc/allyytc.github.io>, branch `main`, pinned commit `35ecfec2c43c535ea013e23720ffa6ad73108f10`.
- Live reference: <https://allyytc.github.io/>. A read-only HTTP GET succeeded; homepage content matched the pinned `index.html` apart from trailing whitespace. This does not verify deployment parity for every subpage.
- Complete recursive file metadata is preserved in [reference/FILE_MANIFEST.json](reference/FILE_MANIFEST.json), including Git blob SHAs and byte sizes. The returned tree was not truncated.
- Exact content-bearing static HTML/JS and the six portfolio-content React components are preserved as inert `.txt` files under `reference/`. These keep long descriptions, contribution lists, captions, dynamic organization data, original URLs, and gallery order intact. No original repository files or settings were changed.
- All media paths are enumerated in [MEDIA_LOCATIONS.md](MEDIA_LOCATIONS.md). Source-relative paths in this inventory refer to the original repository, not files already imported into the new app. Existing media has been located, not downloaded. No 3D assets have been researched or fetched.
- [SOURCE_TEXT.md](SOURCE_TEXT.md) provides a readable extraction of static page text; full HTML/JS snapshots remain authoritative for markup, captions, dynamic data, and links.

## Pages, sections, and navigation

- `/` / `index.html`: hero with name, degree/minor, university/year, role and dates; View Projects, Resume, Contact CTAs; Education; About Me; Experience; Skills; Contact; copyright footer.
- `projects.html`: introductory copy and category navigation; `#in-progress`, `#hackathons`, `#past-projects`, `#design-work`; Graphics (`#design-graphics`) and Stickers; expanded project descriptions/roles/problems/features/stacks; full-screen galleries; Contact/footer.
- `involvement.html`: Campus & Community introduction; Clubs & Organizations; organization tabs and photo gallery; Events; Contact/footer. Original anchors: `#clubs-coe`, `#clubs-startup`, `#clubs-dfa`, `#clubs-bh`, `#clubs-ai`, `#events`.
- `beaverhacks-2026.html`: back link to Involvement Events; hero; About the Event; Event Photos; My Role; Marketing & Outreach; Merch & Design; Volunteer Coordination; Sticker Designs; Merch Photos; Contact/footer.
- `innovation-jam-2026.html`: back link; hero; About the Event; Event Photos; My Role; Event Coordination; Branding & Merch; Pitch Sessions; Design Showcase (Stickers, Name Tags, Award Plaques, Tote Bag); Contact/footer.
- `eweek.html`: back link; hero; About the Event; Event Photos; My Role; Brand Identity; Outreach & Promotion; Sticker Design & Production; Sticker Designs; Contact/footer.
- `nav.js`: shared desktop/mobile navigation to About, Experience, Skills, Contact, Resume, Projects/category anchors, organizations, and all three event pages. Home mark: AC.
- `projects.js`: project/design accordions, hash navigation, sticker collections, media gallery data and captions, modal controls.
- `script.js`: scroll-in behavior; `style.css`: original presentation. These are implementation references, not additional content pages.
- `app/`: separate React/Vite prototype with Hero, About, Projects, Involvement, Skills, Contact, loading/cursor/particle effects and UI components. Do not assume it is the deployed homepage or that its claims supersede the static pages.
- `graphify-out/`: generated knowledge-graph/report/cache/Obsidian artifacts. Preserve their locations in the manifest; they are secondary derived material, not portfolio pages or authority for biography. Historical generated resume references differ from current static source.

## Identity, education, About, and experience

- Name: Ally Chen.
- Approved new subtitle: **Developer · Designer · Product**.
- Approved desired current role label: **Software Developer Intern @ Impact Studio**.
- Historical source role: Web Developer Intern; Impact Studio · Oregon State University; May 2026–Present. Preserve this wording in source history; use the approved new label in new presentation.
- Education: B.S. Computer Science; minor in Business Information Systems; Oregon State University; static site year 2028 and About specifies graduating June 2028.
- About preserves interest in software engineering, UX/UI, product, and other technology paths combining business/design/creative work; internship and new-grad interest; shipping products and learning from teams.
- About describes Drupal/Figma work at OSU Impact Studio; award-winning computer-vision and real-time-web hackathon projects; end-to-end work from wireframes and user research through React, Python, API integration; Startup Hub co-founder; DFA nonprofit project lead serving 300+ daily users.
- Experience: full Impact Studio redesign, navigation/homepage hierarchy/content layout; management of site and subdomains using Drupal/HTML/CSS; end-to-end faculty initiative subdomain configuration and launch; website-traffic analysis and performance reports supporting UX/content decisions. View Work links to `projects.html#project-impact-studio`.
- Associated portraits: `headshot.jpg`, `about-photo.jpg`; prototype uses `app/public/headshot.jpg`. Other root photographs: `DSC00612.JPG`, `involvement-photo-original.jpg`, `involvement-photo-crop-test.jpg`; preserve without assigning an unverified new use.
- Footer: © 2026 Ally Chen in static pages. Prototype footer says 2027; this is a discrepancy, not a current-year instruction.

## Software projects (nine existing)

### In Progress — Impact Studio Website

- Source anchor `projects.html#project-impact-studio`; status: Implementation in Progress.
- Ground-up OSU Impact Studio redesign in Drupal, HTML/CSS, UI/UX Design, Figma. Homepage hero, navigation, hierarchy, lifecycle process visualization, team directory, faculty/student/partner portfolio pages.
- Role: Web Developer Intern bridging marketers, designers, and web contributors; Figma wireframes, mood boards, iterative mockups, stakeholder/team feedback, design and implementation.
- Problem: jargon-heavy/repetitive copy, weak hierarchy, small typography, unbalanced spacing, mission and audience hard to understand.
- Link: <https://impactstudio.oregonstate.edu/> (Site Progress).
- Media: `impact-live/{home-desktop,about-desktop,portfolio-desktop,home-mobile}.webp`; `impact-wireframe/mock 3.png` (Homepage), `mock 1.png` (About Us). Source marks additional wireframes “More coming soon…”.

### In Progress — Corvallis Daytime Drop-In Center Website

- Source anchor `projects.html#project-cddc`; status: In Progress – Development Sprint.
- Stack/tags: WordPress, React, Tailwind CSS, SQL, Design Thinking, Figma, User Research, Accessibility.
- Audience-driven redesign for unhoused Benton County community members and donors. Guest navigation prioritizes Get Help, Contact Us, About Us, Donate; donor page emphasizes trust. Warm, mobile-first experience with multilingual support and ADA compliance as goals.
- Role: DFA Project Lead for an 11-member cross-disciplinary team; discovery, requirements, iterative wireframes, front-end design/code, direct nonprofit collaboration; source states 300+ daily users. Work continued with teammates after the DFA term ended.
- Preserve process narrative: collaborative discovery and repeated nonprofit feedback, two audiences/design directions, donor tone shaped by feedback.
- Upcoming source scope: replace 2020 homepage promo video; monthly rotating services calendar; interactive center-history storyline; community art gallery/connections page; full mobile redesign; expanded donation impact breakdown; ongoing ADA audit.
- Link: <https://corvallisddc.org/en/> (Current Site).
- Media: `cddc-wireframes/{home,get-help,contact,about,donate}.png`; more work marked coming soon.

### Hackathon — KO.rbit

- Source anchor `projects.html#project-korbit`; award: 1st Place SpaceXAI Track, DubHacks 2026; four-person team.
- Real-time two-player lightsaber duel: laptop MediaPipe Pose body tracking, phone motion sensors as saber, QR pairing; 3D cockpit/catalog explorer and roulette into Mars or Neptune.
- Contributions: 3D cockpit lobby/radar/console, avatar creator, battle HUD, NASA MOLA Jezero Crater Mars floor, Neptune atmospheric arena, planetary roulette/handoff.
- Stack: React, TypeScript, JavaScript, Vite, Three.js, React Three Fiber, WebGL, MediaPipe Pose, Node.js, Socket.IO, Perceptron, Python importers for NASA/JPL/CelesTrak/HYG; xAI Grok Voice copilot LYRA.
- Features: server-owned hits/health/stamina/guards; searchable real stars, exoplanets, galaxies, satellites, spacecraft with fact cards; opt-in KO replay with Perceptron highlights ending on server-confirmed finish.
- Links: <https://github.com/dubhack26/KO.rbit>, <https://devpost.com/software/space-battles-aei3wz>, <https://www.youtube.com/watch?v=Ta64tj6uJc4>.
- Media: `korbit-gal/{title,cockpit,duel,mars-arena,solar-view}.webp`; demo embed `https://www.youtube.com/embed/Ta64tj6uJc4`.

### Hackathon — ER Overwatch

- Award: 1st Place Overall, QuackHacks 2026.
- Computer-vision ER waiting-room surveillance prototype: collapse alerts, nurse dashboard, remote vitals, AI patient casefiles, patient wait portal.
- Contributions: front-end nurse sign-in/queue/vitals/alerts dashboard; OpenCV exploration followed by Gemini video collapse processing; overlapping clip windows and token/frame-volume iteration.
- Stack: Next.js, React, TypeScript, Vite, Tailwind CSS, FastAPI, Python, MediaPipe, LiveKit, Gemini API, REST API, WebSockets, Computer Vision, rPPG, Machine Learning.
- Preserve original problem narrative and its “over 1,000” deaths claim as source material, not newly verified medical evidence; verify before reusing as a factual public statistic.
- Links: <https://eroverwatch.tech>, <https://github.com/Jonjlim/Quack3-AJAE>, <https://2026.quackhacks.org/projects/winners/er-overwatch>.
- Media: `ero-gal/{image-02,nursedash,fall-alert,patient,qr,thumbnail}.webp`; awards `ero-gal/awards/{IMG_2647,IMG_2654}.WEBP` and root `ero-award/` copies; demo `https://www.youtube.com/embed/7biBbQWCngY`.

### Hackathon — ComboCraft

- Award: 1st Place, QuackHacks 2025 (gallery caption says 1st Place Overall).
- Gesture-based browser combat game in the Inferno Realm: fist/fireball, open hand/ice shard, pointed finger/lightning; chained combos; Demon Boss phases; three difficulty settings; dual-hand casting, mana/orbs, tutorial, pixel-art menus.
- Contributions: how-to/instructions; composited player webcam overlay with MediaPipe Selfie Segmentation; custom sklearn gesture classifier alongside MediaPipe Hands; JavaScript canvas boss/spell/combo/UI systems. Preserve segmentation/frame-timing iteration and replacement of 60 FPS backend polling with a command pipeline.
- Stack: JavaScript, HTML/CSS, Python, Flask, OpenCV, MediaPipe Hands/Selfie Segmentation, scikit-learn.
- Links: <https://github.com/alwxngn/ComboCraft>, <https://devpost.com/software/combocraft-azuynr>.
- Media: `combo-game/gallery.jpg`, `combo-game/gallery (1).jpg` through `(7).jpg`; event photos/video in `combocraft-event/`, including `MAH01763.MP4`; demo `https://www.youtube.com/embed/xNuD9hViZFQ`. Exact slide order and captions in `reference/projects.js.txt`.

### Hackathon — Lantern

- Source anchor `projects.html#project-lantern`; HackMIT 2026, September 19–20; 24-hour prototype.
- Unitree Go2 companion for someone living with dementia, inspired by a teammate's grandmother; phone microphone/speaker for screen-free interaction and a caregiver web app.
- Built: caregiver onboarding/check-ins/routine/Night Watch/zone map/alerts/timeline; QR phone pairing; ElevenLabs check-in playback and Deepgram reply transcription; walk/follow/home/fixed robot actions through DimOS bridges; painted danger zones with Twilio SMS/call escalation. Phone talks through cloud app and bus, not directly to robot.
- Stack: React, TypeScript, Vite, Tailwind CSS, FastAPI, Python, Deepgram, ElevenLabs, Twilio, DimOS, Unitree Go2.
- Source has no separately labeled personal contribution; do not invent one.
- Links: <https://github.com/alwxngn/Lantern-HackMIT2026>, <https://plume.hackmit.org/project/krpqx-lffop-wpuom-ttmme>, <https://www.youtube.com/watch?v=UiwDwaL6978>.
- Media: demo `https://www.youtube.com/embed/UiwDwaL6978`; no Lantern-specific image directory in the inspected tree.

### Past — Sally's Coffee Shop POS System

- Full-stack class project: 5-table relational schema, 8+ REST API endpoints/full CRUD, four stored procedures for order workflows, loyalty points/rewards/redemptions.
- Contribution: database schema and complete backend/endpoints/stored procedures.
- Stack: Node.js, Express, MySQL, REST API, phpMyAdmin.
- Link: <https://github.com/allyytc/Sallys-POS>. No dedicated media located.

### Past — Afterlife Metro

- Recognition: Hall of Fame – CS 290. Multiplayer narrative simulation/co-op human-and-ghost adventure; dynamic events and player storytelling; 5+ modular systems including character tracking, branching event logic, leaderboard; JSON data models; three-month team project.
- Contribution: event and character systems. Stack: JavaScript, HTML/CSS, Godot, JSON; gallery describes Godot 4.5 browser build and Express leaderboard.
- Links: <https://github.com/osu-cs290-f25/project-afterlife-metro>, <https://bit.ly/afterlife-metro>.
- Media: `afterlife-metro/{split-screen,puzzle-room,home,intro-memory,story-dialogue,instructions,instructions-scrolled,leaderboard,pause-menu}.webp`. Preserve human/ghost controls, narrative captions, and note that leaderboard names are test entries.
- Required existing credit: **Game art by Nour Alzahraa Alqattan.**

### Past — Dementia Risk Predictor

- Health/lifestyle survey machine-learning pipeline comparing classification models and feature importance for early dementia-risk screening.
- Contribution: data cleaning/preprocessing, training/evaluation, feature-importance analysis.
- Stack: Python, scikit-learn, Pandas, NumPy, Jupyter.
- Link: <https://github.com/allyytc/dementia-detector>. No dedicated media located.

### Future addition — Unwrap

Owner-approved future project scope; featured in the studio design corner. **Content pending verification.** No matching project or media was found in the inspected source tree/content. Description, personal role, dates, stack, links, results, status, and media remain unverified; do not fabricate placeholders as portfolio facts.

## Design work

Eleven Graphics items in source order; preserve captions, organizations, and exact filenames:

- Cookies & Clubs — Event Flyer · COE Student Council: `graphic-designs/Cookies & Clubs 2025 Flyer.png`.
- Cookies & Clubs — Social Promo · COE Student Council: `graphic-designs/Instagram post.png`.
- Donuts with the Dean — Event Flyer · COE Student Council: `graphic-designs/Final.png`.
- Donuts with the Dean — Social Promo · COE Student Council: `graphic-designs/dwd draft 2 (Instagram Post (45)).png`.
- First-Year Representatives — Recruitment Flyer · COE Student Council: `graphic-designs/FReps flyer.png`.
- Dam Proud Day — Collage · COE Student Council: `graphic-designs/Dam Proud.png`.
- Letting Off Steam — Event Flyer · Engineers' Week: `graphic-designs/letting off steam (Instagram Post (45)).png`.
- Startup Hub Kickoff — Social Promo · Startup Hub: `graphic-designs/Startup Hub - insta drafts.png`.
- Startup Hub Kickoff — Event Flyer · Startup Hub: `graphic-designs/maybe a flier design.png`.
- Graphic Designer — Recruitment · Startup Hub: `graphic-designs/Graphic Designer.png`.
- Startup Hub MU TV — Display Draft · Startup Hub: `graphic-designs/startup hub TV draft .png`.

Sticker collections:

- Engineers' Week 2026 (five): Gear Beaver, OSU, Post Stamp, Sleeping Beaver, Wrench, under `eweek-stickers/`; links to `eweek.html`.
- Innovation Jam 2026 (four): Lightbulb, Airplane, Rocket, Star; `ij-stickers/*-crop.png` and original named versions; links to `innovation-jam-2026.html`.
- BeaverHacks 2026 (six): three Attendee Designs, one Volunteer Design, two Team Designs; `bh-stickers/sticker-{1,9,10,11,12,13}-crop.png`, corresponding `Untitled_Artwork` originals; links to `beaverhacks-2026.html`.
- Additional Innovation Jam materials: staff/attendee/mentor/judge name tags; first/second/third award plaques under `ij-stickers/`; tote `ij-tote.png`. Event prose also mentions notebooks and gift boxes, but no distinct media files are identified for those.

## Community / clubs and organizations

Exact descriptions, ordered photo arrays, dates, and CTA objects are preserved in `reference/involvement.html.txt` (`orgsData`). Intro preserves 500+ event attendees, advocacy for 10K+ engineering students, and cross-functional collaboration.

- College of Engineering / Engineering Student Council: Vice President of Outreach, June 2025–Present. Voice for 10K+ students on curriculum/tuition and faculty decisions; outreach across 50+ organizations; helps allocate $200K+ with VP Finance; owns graphics, materials, merch; Engineers' Week, Donuts with the Dean, Cookies & Clubs. Photos: `cookies-clubs/` and `eweek/IMG_8728.jpg`. CTAs: Design Graphics and Engineers' Week.
- Startup Hub: Co-Founder, June 2025–Present. Founded OSU entrepreneurship community, branding and structure; partners College of Business, Oregon Startup Center, AI Collective; resources for 15K+ students; VC speakers/storytelling workshops; Innovation Jam '26; future conference funding aspirations. Photos: `sh-pics/`. CTAs: Design Graphics and Innovation Jam.
- Design for America: Project Lead, Jan 2026–Present. Directed 11-person interdisciplinary CDDC discovery/design/development team; chose project after meeting center director; continued after DFA term with teammates. Photos: `dfa/`. CTA: `projects.html#project-cddc`.
- BeaverHacks: Core & Marketing Team, June 2025–Present. Personal hackathon motivation; marketing/design/operations at Oregon's largest collegiate hackathon; 500+ participants, 24 hours; social campaigns, stickers, merch modeling, volunteers, logistics. Photos: `bh-merch/`, `bh-event/carousel/`, `bh-event/gp1.JPG`. CTA: BeaverHacks 2026.
- Artificial Intelligence Club: Project Officer, June 2025–Present. Revival first meeting 100+; weekly workshops across experience levels; NumPy tutorials, image classification, poker agents, Kaggle; ML lectures and community activities. Source says Marketing Lead “next year”; verify before treating as current. Photos: `ai-club/`. No CTA supplied.

## Event case studies

### BeaverHacks 2026

- Oregon's largest annual hackathon, hosted at OSU; 500+ students from across the country, 24 hours, teams up to four, multiple sponsor tracks; university/industry connection.
- Marketing: campaigns across 30+ universities, social content, sponsor co-branding.
- Design: six-sticker collection for 500+ attendees/volunteers/team, manufacturing logistics; modeled/promoted hoodies and merchandise, promotional sales content.
- Operations: led volunteers, check-in, logistics, attendee guidance across spaces, real-time support over the event.
- Media: `bh-event/` and `bh-event/carousel/` event galleries; `bh-merch/`; `bh-stickers/`; root `bh1.jpg`, `bh4.JPG`. Exact gallery order in the page snapshot.

### Innovation Jam 2026

- OSU/Willamette Valley student innovation and entrepreneurship day with pitches, workshops, networking. $1,500 cash prizes, inventOR advancement opportunity with $30,000 grants/awards; mentors/judges from VC, business, academia.
- Source says first complete student-organization ownership: inventOR budget, Startup Hub execution.
- Role: core-team operations/design, early planning, budget allocation, day-of registration/check-in/guidance/swag, presentation AV/scheduling, connections with founders/judges/organizers.
- Designed stickers, totes, notebooks, award plaques, judge/mentor gift boxes, name cards; hand screen-printed totes and self laser-engraved plaques; end-to-end production.
- Media: `innovation-26/`, `ij-stickers/`, `ij-tote.png`; four stickers, four name tags, three plaques, tote display.

### Engineers' Week 2026

- OSU College of Engineering's annual National Engineers Week celebration: week of workshops, panels, competitions, community, industry/alumni connections.
- VP Outreach owned marketing/design, created branding kit, flyers/social graphics, consistent physical/digital identity, campaigns/scheduling/announcements, event-team programming coordination, sticker design/production/delivery.
- Media: `eweek/`, `eweek-stickers/`, relevant `graphic-designs/` flyers; five sticker designs.

## Skills (static source categories preserved)

- Languages: Python, JavaScript, TypeScript, C++, SQL, MySQL, MariaDB, HTML/CSS, Dart. Preserve original categorization, even where database products are listed here.
- Frameworks & Libraries: React, Next.js, Node.js, Express, TailwindCSS, Flutter, React Native, PyTorch, scikit-learn, Pandas, NumPy, OpenCV.
- Tools & Platforms: Git, Drupal, WordPress, phpMyAdmin, Godot, Jupyter, Chrome Extensions API.
- Design: UI/UX Design, Graphic Design, UX Research, Figma, Canva.
- Leadership & Soft Skills: Project Management, Team Management, Public Speaking, Marketing, Leadership.
- Other: REST APIs, Data Structures & Algorithms.
- Project-specific technologies remain in the nine project entries and full source; do not discard them because they are absent from the general Skills section.

## Resume, contact, and links

- Resume: source path `allychen-resume2028-pm.pdf`, consistently referenced by static pages/nav. **Absent from the pinned recursive tree.** Its text and validity cannot be inventoried; do not substitute an older/generated reference.
- Email: `mailto:allyten08@gmail.com`.
- LinkedIn (static source): <https://linkedin.com/in/allyychen/>.
- GitHub: <https://github.com/allyytc>.
- Phone: `(503) 866-0073`, `tel:5038660073`.
- Every static page includes Contact and Resume links. Preserve direct access in the new app.
- Exact unique HTML links and quoted external URLs from the saved source files appear in [LINKS.md](LINKS.md), with source-file associations. Third-party targets were inventoried, not all independently validated.

## Verification queue and source discrepancies

- Resume PDF missing; prevents a verified working download and resume-text inventory, not foundation completion.
- Unwrap content pending verification; keep future scope with no invented facts.
- Static education says June 2028; prototype Hero says 2027, Skills says available June 2027, footer says 2027. Do not silently replace source history or publish prototype dates as current.
- Static LinkedIn is `/in/allyychen/`; prototype Contact is `/in/allychen`. Prefer the static reference pending verification; preserve both in history.
- Prototype Impact Studio entry says year 2025 and “+100% TRAFFIC”; static experience starts May 2026 and reports traffic analysis without that metric. Prototype ESC says “$200K+ funding secured” while static says helping allocate funds. Preserve differences; do not promote those stronger claims without verification.
- Prototype CDDC says “ADA compliant”; static describes compliance work/audit in progress. Prototype adds Motion Design to skills. Treat these as prototype claims requiring verification.
- Prototype project years: ER 2026, ComboCraft 2025, Impact 2025, CDDC 2026, Sally's 2025, Afterlife 2024, Dementia 2025. Static Afterlife repository name includes fall 2025; do not infer corrected dates. Prototype omits KO.rbit and Lantern; they must remain in the rebuilt portfolio.
- Existing project statistics, awards, healthcare problem statistics, and event metrics are source claims, not independently researched assertions in this setup phase.
- No repository-wide LICENSE file found. Existing photos/art need rights/provenance review before new publication; preserve credits, especially Afterlife Metro art attribution.
- Original source data and referenced media paths remain intact in historical snapshots/manifests. The new app currently contains only verified identity labels and email, not a completed migration or finished Quick View.

## Resume follow-up — 2026-10-27

The owner supplied `allychen-resume2028.pdf` from Downloads for the new portfolio. It is verified and copied unchanged to `public/files/allychen-resume2028.pdf`; printer, direct Resume and Quick View share its link. Earlier missing-file notes describe the pinned original repository, which remains untouched. No resume facts were used to silently rewrite historical portfolio copy.


## Phase 6A preservation audit — 2026-10-28

Read-only GitHub fetches of current `main` for all six static pages plus `projects.js` match the pinned snapshots apart from trailing whitespace trimmed by the connector; see `evidence/phase6a/source-checks.json`. All original inert source snapshots remain unchanged. `content-audit.json` records page text blocks, headings, DOM media/link references, project gallery metadata and script data without executing original code. `organizations-source.json` separately retains the five full organization records, including all ten description paragraphs, dates, ordered photographs and CTAs.

[MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md) and its machine-readable `migration-index.json` map 338 items, including every original media file (244), all six pages, nine original projects plus pending Unwrap, five organizations, three events, eleven graphics entries, 38 source gallery/array groups, six prototype references and profile/skills sections. Gallery groups retain overlapping source arrays rather than assuming they are distinct collections.

Only KO.rbit is a complete Phase 6A runtime migration. Its five original screenshots are copied byte-for-byte and checked against pinned Git blobs. Its six personal contributions, six features, full stack paragraph, original ten tags, description, summary, award, gallery order/captions, demo and three links are preserved. Other content remains as exact source snapshots and/or earlier partial prototype records, not silently promoted to complete migration. Devpost returns HTTP 403 to automated verification; its original URL is retained. GitHub and YouTube links resolve, which does not independently verify all original claims or guarantee video playback. The new lifecycle HTML in the IDE was not treated as authorization to edit another project.

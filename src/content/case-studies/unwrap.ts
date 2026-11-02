import type { Project } from '../schema'
/** Local source observations and existing captures; unresolved claims remain pending. */
export const unwrap: Project = {
  "id": "unwrap",
  "title": "Unwrap",
  "category": "design-work",
  "presentation": "product",
  "overview": "Turn what your friends remember into a gift you choose together.",
  "status": "Source-backed development prototype · Details pending verification",
  "technologies": [
    "Next.js",
    "React",
    "TypeScript",
    "Convex",
    "React Three Fiber",
    "Zod"
  ],
  "heroMediaId": "unwrap-0",
  "media": [
    {
      "kind": "image",
      "id": "unwrap-0",
      "src": "media/unwrap/council-prod-final.png",
      "originalPath": "/Users/ally/Github/calhacks2026/work/screens/council-prod-final.png",
      "source": {
        "repository": "local calhacks2026 worktree",
        "ref": "0e3d7ab73e2c9a256cb831ca87814181a1391dc1 + local worktree",
        "path": "/Users/ally/Github/calhacks2026/work/screens/council-prod-final.png"
      },
      "sha256": "02c0caac2c634d1b687ba75cc540b3bcd698bf1bc0a8d417963a3d21e2dccd65",
      "rights": "review-required",
      "alt": "Unwrap development UI with gift islands, clue rings and five council companions",
      "caption": "Existing desktop development capture: gift-map UI and council companions. Public deployment and provider results are not independently verified."
    },
    {
      "kind": "image",
      "id": "unwrap-1",
      "src": "media/unwrap/robots-map-narrow-dock.png",
      "originalPath": "/Users/ally/Github/calhacks2026/work/screens/robots-map-narrow-dock.png",
      "source": {
        "repository": "local calhacks2026 worktree",
        "ref": "0e3d7ab73e2c9a256cb831ca87814181a1391dc1 + local worktree",
        "path": "/Users/ally/Github/calhacks2026/work/screens/robots-map-narrow-dock.png"
      },
      "sha256": "b901fe1054bc66dc1640130f7dd8a64c714cd32814436e091a0f486bbb58ea48",
      "rights": "review-required",
      "alt": "Unwrap narrow development UI showing a gift proposal, contribution shares and approval state",
      "caption": "Existing narrow development capture: proposal and review-shares UI. The original development issue indicator remains visible; this is not a production-readiness claim."
    }
  ],
  "links": [],
  "source": {
    "repository": "local calhacks2026 worktree",
    "ref": "0e3d7ab73e2c9a256cb831ca87814181a1391dc1 + local worktree",
    "path": "README.md"
  },
  "verification": {
    "status": "pending",
    "notes": [
      "Verified material: local README, package metadata, map/council/proposal source and two existing UI captures. No app services were run for this audit.",
      "Still needed: Ally’s individual role and contributions, research evidence, final design rationale, approved public project/demo links and independently verified outcomes.",
      "README describes the map-first journey as a roadmap in progress. Existing captures and later worktree components show development UI, not proof that every planned feature is complete."
    ]
  },
  "sections": [
    {
      "id": "unwrap-problem",
      "title": "The problem",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "Group gifts get scattered across chats. The people who know someone best remember different clues, research taste and budget separately, and coordinate who fronts the cost. Generic recommendations can miss the personal evidence behind a thoughtful gift."
          ]
        }
      ]
    },
    {
      "id": "unwrap-product",
      "title": "Product direction",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "The source README frames Unwrap as a shared gift studio: friends contribute memories, photos and ideas; review clues; explore gift options; and choose a gift together. The intended audience is friends coordinating a personal group gift. The owner’s brief emphasizes highly personalized, niche, thoughtful gifts; it does not independently verify the final implementation."
          ]
        }
      ]
    },
    {
      "id": "unwrap-source",
      "title": "What the source supports",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "The reviewed GiftMap component associates published clues with recommendations and listing titles. ProposalPanel implements contribution-limit input, revision-specific approval states and invalidation feedback. CouncilFamiliars defines five animated companions driven by stored task events, with a dock for narrow screens or reduced motion. These are code observations, not end-to-end deployment results."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "Package metadata confirms Next.js, React, TypeScript, Convex, React Three Fiber and Zod dependencies. This portfolio reuses screenshots only; it does not install or run Unwrap’s services."
          ]
        }
      ]
    },
    {
      "id": "unwrap-ui",
      "title": "Development UI",
      "blocks": [
        {
          "kind": "gallery",
          "label": "Unwrap existing development captures",
          "mediaIds": [
            "unwrap-0",
            "unwrap-1"
          ]
        }
      ]
    },
    {
      "id": "unwrap-journey",
      "title": "Planned journey and design direction",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "The README proposes a lobby leading into a shared ring-based gift map: memories and ideas on the outside, reviewed themes and product candidates toward the middle, and a chosen gift at the center. Private limits and revision-aware approval are intended to keep group decisions explicit. The README labels the map-first phase as starting; these roadmap descriptions are not presented as completed delivery."
          ]
        }
      ]
    },
    {
      "id": "unwrap-limits",
      "title": "Verification and next steps",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "The README reports a Phase 1 code baseline but identifies live product search, council integration and a two-browser path on one shared deployment as unverified. Payments remain pledges; payment processing is future scope. Source-reported test counts were not rerun and are not portfolio validation results."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "Personal responsibilities, research findings, iteration outcomes, awards and public deployment links have not been supplied or verified. These fields remain omitted pending owner confirmation."
          ]
        }
      ]
    }
  ]
}

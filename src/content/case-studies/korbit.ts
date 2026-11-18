// Generated losslessly from pinned original source. See prepare_content_phase6a.py.
import type { Project } from '../schema'
export const korbit: Project = {
  "id": "korbit",
  "title": "KO.rbit",
  "category": "hackathons",
  "overview": "A two-player lightsaber duel with no controller. A laptop camera tracks your body, your phone is the saber, and the fight lands on real Mars terrain. 1st place, SpaceXAI track, DubHacks 2026.",
  "awards": [
    "🏆 1st Place, SpaceXAI Track, DubHacks 2026"
  ],
  "technologies": [
    "React",
    "TypeScript",
    "JavaScript",
    "Three.js",
    "React Three Fiber",
    "Vite",
    "MediaPipe",
    "Node.js",
    "Socket.IO",
    "WebGL",
    "Perceptron"
  ],
  "heroMediaId": "korbit-image-1",
  "sections": [
    {
      "id": "description",
      "title": "Problem",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "A duel usually means memorizing a controller. KO.rbit asks you to stand up: the laptop watches your body, the phone is the saber, and the server decides who actually landed the hit."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-korbit"
      }
    },
    {
      "id": "my-role",
      "title": "Role",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "I built the 3D cockpit lobby, the avatar creator, the battle HUD, the Mars arena on NASA MOLA terrain, the Neptune arena, and planetary roulette."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-korbit"
      }
    },
    {
      "id": "tech-stack",
      "title": "Tech Stack",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "React, TypeScript, JavaScript, Vite, Three.js, React Three Fiber, WebGL, MediaPipe Pose, Node.js, Socket.IO, Perceptron, and Python importers for NASA, JPL, CelesTrak, and HYG catalogs. We also use xAI Grok Voice for LYRA, the in-game voice copilot."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-korbit"
      }
    },
    {
      "id": "features",
      "title": "Highlights",
      "blocks": [
        {
          "kind": "list",
          "items": [
            [
              {
                "text": "Full-body duel",
                "emphasis": "strong"
              },
              " - pair MediaPipe Pose on the laptop with the phone as the saber, connected by QR code"
            ],
            [
              {
                "text": "Server-owned hits",
                "emphasis": "strong"
              },
              " - a Node and Socket.IO server decides health, stamina, guards, and every hit, so the two clients cannot disagree"
            ],
            [
              {
                "text": "Real arenas",
                "emphasis": "strong"
              },
              " - the Mars floor is a NASA MOLA crop of Jezero Crater, and Neptune is modeled as atmosphere because it has no solid ground"
            ],
            [
              {
                "text": "A real catalog",
                "emphasis": "strong"
              },
              " - fly the cockpit through stars, exoplanets, galaxies, satellites, and spacecraft, then let planetary roulette pick Mars or Neptune"
            ]
          ],
          "ordered": false
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-korbit"
      }
    },
    {
      "id": "demo",
      "title": "Demo Video",
      "blocks": [
        {
          "kind": "media",
          "mediaId": "korbit-demo"
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-demo"
      }
    },
    {
      "id": "screenshots",
      "title": "Screenshots",
      "blocks": [
        {
          "kind": "gallery",
          "label": "KO.rbit screenshots",
          "mediaIds": [
            "korbit-image-1",
            "korbit-image-2",
            "korbit-image-3",
            "korbit-image-4",
            "korbit-image-5"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-interface"
      }
    }
  ],
  "media": [
    {
      "id": "korbit-image-1",
      "kind": "image",
      "src": "media/korbit-gal/title.webp",
      "originalPath": "korbit-gal/title.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-interface"
      },
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/korbit-gal/title.webp",
      "gitBlob": "832ca5882377fe15c854f171f11a87e1af2db879",
      "rights": "owner-local-rebuild",
      "alt": "KO.rbit title screen on a starfield, with the prompt to begin a run",
      "caption": "KO.rbit title screen on a starfield, with the prompt to begin a run",
      "sha256": "988a86d674d7e5dcb186828d3726126a6dbdcc19e12cf727b69f17e164029b3d"
    },
    {
      "id": "korbit-image-2",
      "kind": "image",
      "src": "media/korbit-gal/cockpit.webp",
      "originalPath": "korbit-gal/cockpit.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-interface"
      },
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/korbit-gal/cockpit.webp",
      "gitBlob": "37bb97e82ef6d82a9124755056a3adcff45f10b7",
      "rights": "owner-local-rebuild",
      "alt": "KO.rbit 3D cockpit lobby, with a pilot at the console and a radar of nearby ships",
      "caption": "KO.rbit 3D cockpit lobby, with a pilot at the console and a radar of nearby ships",
      "sha256": "ad08810eb1f2f7d1df83c9f429a880f2f6191b57e8a15e0af4ef71697e0577a9"
    },
    {
      "id": "korbit-image-3",
      "kind": "image",
      "src": "media/korbit-gal/duel.webp",
      "originalPath": "korbit-gal/duel.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-interface"
      },
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/korbit-gal/duel.webp",
      "gitBlob": "0defc3dbe4bac0731726152f9fd6b12e5c76c3ba",
      "rights": "owner-local-rebuild",
      "alt": "KO.rbit saber duel in a rocky arena, with health and stamina on the battle HUD",
      "caption": "KO.rbit saber duel in a rocky arena, with health and stamina on the battle HUD",
      "sha256": "bcb9a773f9996293bed6b695cb2d737d7b698bc1e371ab24191b48e06abef252"
    },
    {
      "id": "korbit-image-4",
      "kind": "image",
      "src": "media/korbit-gal/mars-arena.webp",
      "originalPath": "korbit-gal/mars-arena.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-interface"
      },
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/korbit-gal/mars-arena.webp",
      "gitBlob": "bf1285454d5f02aee56fde4f611d4f9b1a06e4c7",
      "rights": "owner-local-rebuild",
      "alt": "KO.rbit Mars arena at Jezero Crater, with a landed ship and two pilots on the terrain",
      "caption": "KO.rbit Mars arena at Jezero Crater, with a landed ship and two pilots on the terrain",
      "sha256": "d61afa6a7890d141c7454668699e074cd82de1bffe53a9a509163de6f102ed30"
    },
    {
      "id": "korbit-image-5",
      "kind": "image",
      "src": "media/korbit-gal/solar-view.webp",
      "originalPath": "korbit-gal/solar-view.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-interface"
      },
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/korbit-gal/solar-view.webp",
      "gitBlob": "019325be9fb7c755e0bf886dd3ff690d73e79340",
      "rights": "owner-local-rebuild",
      "alt": "KO.rbit solar view of a banded planet, with the navigation menu open",
      "caption": "KO.rbit solar view of a banded planet, with the navigation menu open",
      "sha256": "ca49fb1214e587db9a8a3b4240923285c9e0ea297ceafa8b8f96bf0a1a29beb1"
    },
    {
      "id": "korbit-demo",
      "kind": "embed",
      "src": "https://www.youtube.com/embed/Ta64tj6uJc4",
      "title": "KO.rbit demo - DubHacks 2026",
      "caption": "KO.rbit demo - DubHacks 2026",
      "watchURL": "https://www.youtube.com/watch?v=Ta64tj6uJc4",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "korbit-demo"
      },
      "originalPath": "https://www.youtube.com/embed/Ta64tj6uJc4",
      "rights": "review-required"
    }
  ],
  "links": [
    {
      "id": "github",
      "label": "GitHub",
      "href": "https://github.com/dubhack26/KO.rbit",
      "kind": "github",
      "verification": "resolved"
    },
    {
      "id": "devpost",
      "label": "Devpost",
      "href": "https://devpost.com/software/space-battles-aei3wz",
      "kind": "devpost",
      "verification": "blocked"
    },
    {
      "id": "demo",
      "label": "Demo",
      "href": "https://www.youtube.com/watch?v=Ta64tj6uJc4",
      "kind": "demo",
      "verification": "resolved"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "projects.html",
    "anchor": "project-korbit"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Full source content; not an independent verification of the original award/technical claims."
    ]
  }
}

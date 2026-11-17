// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.
import type { Project } from '../schema'
export const project: Project = {
  "id": "lantern",
  "title": "Lantern",
  "category": "hackathons",
  "presentation": "software",
  "overview": "A Unitree Go2 companion for someone living with dementia, plus a caregiver app for voice check-ins, Night Watch alerts, and a map of the home. The team built it in 24 hours at HackMIT 2026.",
  "technologies": [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Python",
    "FastAPI",
    "Deepgram",
    "ElevenLabs",
    "Twilio",
    "DimOS"
  ],
  "sections": [
    {
      "id": "description",
      "title": "Problem",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "The idea came from a teammate’s grandmother. After the family dog was no longer at home, she was alone for much of the day, and she did not want to wear a location tracker. Her family still needed a way to check in and know if she had moved somewhere they had marked as dangerous."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-lantern"
      }
    },
    {
      "id": "what-we-built",
      "title": "Highlights",
      "blocks": [
        {
          "kind": "list",
          "items": [
            [
              {
                "text": "Caregiver portal",
                "emphasis": "strong"
              },
              " - built onboarding, spoken check-ins, a daily routine, Night Watch, a zone map, and an activity timeline in one caregiver app"
            ],
            [
              {
                "text": "Paired phone",
                "emphasis": "strong"
              },
              " - made the phone the microphone and speaker, with QR pairing, ElevenLabs playback, and a short reply transcribed by Deepgram"
            ],
            [
              {
                "text": "Robot requests",
                "emphasis": "strong"
              },
              " - send spoken requests through the cloud app to walk, follow, or return home when DimOS and the robot bridges are running"
            ],
            [
              {
                "text": "Night Watch",
                "emphasis": "strong"
              },
              " - let caregivers paint danger zones and escalate alerts to Twilio SMS and phone calls"
            ]
          ],
          "ordered": false
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-lantern"
      }
    },
    {
      "id": "tech-stack",
      "title": "Tech Stack",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "React, TypeScript, Vite, Tailwind CSS, FastAPI, Python, Deepgram, ElevenLabs, Twilio, and DimOS on a Unitree Go2. The phone does not talk to the robot directly. It goes through our cloud app and the bus."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "project-lantern"
      }
    },
    {
      "id": "screenshots",
      "title": "Screenshots",
      "blocks": [
        {
          "kind": "gallery",
          "label": "Lantern architecture",
          "mediaIds": [
            "lantern-architecture"
          ]
        }
      ]
    },
    {
      "id": "lantern-demo",
      "title": "Demo Video",
      "blocks": [
        {
          "kind": "media",
          "mediaId": "https://www.youtube.com/embed/UiwDwaL6978"
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "lantern-demo"
      }
    }
  ],
  "media": [
    {
      "id": "https://www.youtube.com/embed/UiwDwaL6978",
      "kind": "embed",
      "src": "https://www.youtube.com/embed/UiwDwaL6978",
      "originalPath": "https://www.youtube.com/embed/UiwDwaL6978",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "review-required",
      "caption": "Lantern demo - HackMIT 2026",
      "title": "Lantern demo - HackMIT 2026",
      "watchURL": "https://www.youtube.com/watch?v=UiwDwaL6978"
    },
    {
      "id": "lantern-robot",
      "kind": "image",
      "src": "media/lantern/robot-doorway.webp",
      "originalPath": "https://img.youtube.com/vi/UiwDwaL6978/maxresdefault.jpg",
      "source": {
        "repository": "alwxngn/Lantern-HackMIT2026",
        "ref": "main",
        "path": "README.md"
      },
      "rights": "owner-local-rebuild",
      "alt": "Unitree Go2 robot walking across a tiled entryway toward a person standing in an open doorway.",
      "caption": "Unitree Go2 at the doorway, from the demo still in the Lantern README.",
      "width": 406,
      "height": 720
    },
    {
      "id": "lantern-architecture",
      "kind": "image",
      "src": "media/lantern/architecture.webp",
      "originalPath": "README.md#architecture",
      "source": {
        "repository": "alwxngn/Lantern-HackMIT2026",
        "ref": "main",
        "path": "README.md"
      },
      "rights": "owner-local-rebuild",
      "alt": "Architecture diagram: React portal and paired phone connect to FastAPI on port 8000, which reaches Deepgram, ElevenLabs, Twilio, and a bus hub on port 9000. The bus connects the orchestrator and the command and map bridges, which use MCP to reach DimOS and Aegis skills on the Unitree Go2.",
      "caption": "Architecture from the Lantern README: portal, phone, FastAPI, speech services, bus, orchestrator, robot bridges, and Twilio.",
      "width": 3168,
      "height": 688
    }
  ],
  "links": [
    {
      "id": "link-0",
      "label": "GitHub",
      "href": "https://github.com/alwxngn/Lantern-HackMIT2026",
      "kind": "github",
      "verification": "resolved"
    },
    {
      "id": "link-1",
      "label": "HackMIT",
      "href": "https://plume.hackmit.org/project/krpqx-lffop-wpuom-ttmme",
      "kind": "live",
      "verification": "resolved"
    },
    {
      "id": "link-2",
      "label": "Demo",
      "href": "https://www.youtube.com/watch?v=UiwDwaL6978",
      "kind": "demo",
      "verification": "resolved"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "projects.html",
    "anchor": "project-lantern"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Original portfolio text retained verbatim; source claims are not independently revalidated."
    ]
  },
  "recognition": [
    "HackMIT 2026"
  ],
  "heroMediaId": "lantern-robot"
}

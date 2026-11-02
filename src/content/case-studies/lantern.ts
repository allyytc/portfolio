// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.
import type { Project } from '../schema'
export const project: Project = {
  "id": "lantern",
  "title": "Lantern",
  "category": "hackathons",
  "presentation": "software",
  "overview": "A Unitree Go2 companion for someone living with dementia, with a caregiver app for voice check-ins, Night Watch alerts, and a map of the home. We built it at HackMIT 2026.",
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
      "title": "Description",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "Lantern is a robot companion for someone living with dementia, and a link for the family members who look after them. We built the prototype in 24 hours at HackMIT 2026 (September 19–20). The idea came from a teammate’s grandmother. After the family dog was no longer at home, she was alone for much of the day, and she did not want to wear a location tracker."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "The phone is the microphone and speaker. She talks to Lantern instead of using a screen. For the family, a web app shows how she is doing, plays check-ins aloud, and sends alerts if she moves into a place the caregivers marked as dangerous."
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
      "title": "What we built",
      "blocks": [
        {
          "kind": "list",
          "items": [
            [
              {
                "text": "Caregiver portal",
                "emphasis": "strong"
              },
              " - onboarding, check-ins, a daily routine, Night Watch, a zone map, alerts, and an activity timeline"
            ],
            [
              {
                "text": "Paired phone",
                "emphasis": "strong"
              },
              " - QR pairing, ElevenLabs playback of a check-in, and a short reply transcribed with Deepgram"
            ],
            [
              {
                "text": "Robot requests",
                "emphasis": "strong"
              },
              " - spoken phrases can walk, follow, return home, or play a fixed set of Go2 actions when DimOS and the robot bridges are running"
            ],
            [
              {
                "text": "Night Watch",
                "emphasis": "strong"
              },
              " - caregivers paint zones, and alerts can escalate to Twilio SMS and phone calls"
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
  "heroMediaId": "https://www.youtube.com/embed/UiwDwaL6978"
}

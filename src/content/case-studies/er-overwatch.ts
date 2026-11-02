// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.
import type { Project } from '../schema'
export const project: Project = {
  "id": "er-overwatch",
  "title": "ER Overwatch",
  "category": "hackathons",
  "presentation": "software",
  "overview": "A computer vision wide-angle surveillance platform that helps understaffed ERs monitor waiting-room patients - detecting collapses via fall detection, tracking vitals, and building AI casefiles for the doctor while they wait.",
  "technologies": [
    "Next.js",
    "React",
    "TypeScript",
    "FastAPI",
    "Python",
    "MediaPipe",
    "LiveKit",
    "Gemini API",
    "WebSockets",
    "Computer Vision"
  ],
  "sections": [
    {
      "id": "description",
      "title": "Description",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "Across the world, over 1,000 people die each year just waiting for medical care inside an emergency room lobby. Most arrive with symptoms that are survivable on their own - concussions, chest pain, bruising, spasms - but over the many hours spent waiting for a room to open up, those same conditions can escalate into strokes, heart attacks, and organ failure. In a crowded ER, someone could collapse and lose consciousness with no one noticing for minutes."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "ER Overwatch connects live waiting-room footage to automated collapse detection and a nurse dashboard - giving understaffed ERs real-time alerts and structured patient context before a doctor is available."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ER Overwatch"
      }
    },
    {
      "id": "my-role",
      "title": "My Role",
      "blocks": [
        {
          "kind": "list",
          "items": [
            [
              {
                "text": "Frontend development",
                "emphasis": "strong"
              },
              " - led the nurse dashboard where staff sign patients in, monitor vitals, and receive real-time alerts"
            ],
            [
              {
                "text": "Fall detection",
                "emphasis": "strong"
              },
              " - explored an OpenCV-based approach before moving to Gemini video processing for collapse and loss-of-consciousness detection"
            ]
          ],
          "ordered": false
        },
        {
          "kind": "paragraph",
          "content": [
            "Getting fast, reliable results meant iterating on how we batch and send footage: overlapping clip windows to catch events at clip boundaries, and working around Gemini token limits as frame volume scaled up."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ER Overwatch"
      }
    },
    {
      "id": "tech-stack",
      "title": "Tech Stack",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "Next.js, React, TypeScript, Vite, Tailwind CSS, FastAPI, Python, MediaPipe, LiveKit, Gemini API, REST API, WebSockets, Computer Vision, rPPG, Machine Learning"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ER Overwatch"
      }
    },
    {
      "id": "features",
      "title": "Features",
      "blocks": [
        {
          "kind": "list",
          "items": [
            [
              {
                "text": "Nurse dashboard",
                "emphasis": "strong"
              },
              " - sign patients in, monitor vitals, and receive real-time collapse alerts"
            ],
            [
              {
                "text": "Fall & collapse detection",
                "emphasis": "strong"
              },
              " - Gemini video processing and OpenCV movement analysis on live waiting-room footage"
            ],
            [
              {
                "text": "Remote vitals (rPPG)",
                "emphasis": "strong"
              },
              " - heart rate monitoring streamed from the patient’s camera to the nurse view"
            ],
            [
              {
                "text": "AI patient chatbot",
                "emphasis": "strong"
              },
              " - chats with waiting patients and builds structured casefiles for staff"
            ],
            [
              {
                "text": "Patient wait portal",
                "emphasis": "strong"
              },
              " - checked-in patients can view their ER data and estimated wait time"
            ]
          ],
          "ordered": false
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ER Overwatch"
      }
    },
    {
      "id": "er-overwatch-demo",
      "title": "Demo Video",
      "blocks": [
        {
          "kind": "media",
          "mediaId": "https://www.youtube.com/embed/7biBbQWCngY"
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "er-overwatch-demo"
      }
    },
    {
      "id": "er-overwatch-interface",
      "title": "Interface",
      "blocks": [
        {
          "kind": "gallery",
          "label": "er-overwatch-interface",
          "mediaIds": [
            "ero-gal/image-02.webp",
            "ero-gal/nursedash.webp",
            "ero-gal/fall-alert.webp",
            "ero-gal/patient.webp",
            "ero-gal/qr.webp"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "er-overwatch-interface"
      }
    },
    {
      "id": "er-overwatch-gallery",
      "title": "Gallery",
      "blocks": [
        {
          "kind": "gallery",
          "label": "er-overwatch-gallery",
          "mediaIds": [
            "ero-gal/awards/IMG_2647.WEBP",
            "ero-gal/awards/IMG_2654.WEBP"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "er-overwatch-gallery"
      }
    }
  ],
  "media": [
    {
      "id": "https://www.youtube.com/embed/7biBbQWCngY",
      "kind": "embed",
      "src": "https://www.youtube.com/embed/7biBbQWCngY",
      "originalPath": "https://www.youtube.com/embed/7biBbQWCngY",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "review-required",
      "caption": "ER Overwatch demo - QuackHacks 2026",
      "title": "ER Overwatch demo - QuackHacks 2026",
      "watchURL": "https://www.youtube.com/watch?v=7biBbQWCngY"
    },
    {
      "id": "ero-gal/image-02.webp",
      "kind": "image",
      "src": "media/ero-gal/image-02.webp",
      "originalPath": "ero-gal/image-02.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "System workflow diagram",
      "alt": "System workflow diagram",
      "gitBlob": "9f652e2d0250a6724752f5005f94fa77af789d64",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/image-02.webp",
      "sha256": "42aae1bdc2992899b37f542aa8f4c9cb0d0e3797b0676b7f53ec14271a4a935d"
    },
    {
      "id": "ero-gal/nursedash.webp",
      "kind": "image",
      "src": "media/ero-gal/nursedash.webp",
      "originalPath": "ero-gal/nursedash.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Nurse dashboard - live patient queue and alerts",
      "alt": "Nurse dashboard - live patient queue and alerts",
      "gitBlob": "d30d0e97dece4352523bae5cdb300146f6bc8395",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/nursedash.webp",
      "sha256": "adf99cc27c07a87499f58e66a25c4805d1777ca809e2eb52e367f3067eef5973"
    },
    {
      "id": "ero-gal/fall-alert.webp",
      "kind": "image",
      "src": "media/ero-gal/fall-alert.webp",
      "originalPath": "ero-gal/fall-alert.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Fall detection alert - critical emergency modal",
      "alt": "Fall detection alert - critical emergency modal",
      "gitBlob": "3ba387c58e6e86ac3d85aa57d62386bb1a1b99a3",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/fall-alert.webp",
      "sha256": "5a0943db027c2d33019586da7331b4c809590dd61bc7595e6fe9aa2e5e2281ef"
    },
    {
      "id": "ero-gal/patient.webp",
      "kind": "image",
      "src": "media/ero-gal/patient.webp",
      "originalPath": "ero-gal/patient.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Patient wait portal - queue position and ER status",
      "alt": "Patient wait portal - queue position and ER status",
      "gitBlob": "25a3b7a194eef3c8a79a7c1a9c647ea84a8acfb2",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/patient.webp",
      "sha256": "5fae3993fcaed23cd0f3a1d5a2ecb9c6c2edb06f5404751e5e30b907a8f54f4a"
    },
    {
      "id": "ero-gal/qr.webp",
      "kind": "image",
      "src": "media/ero-gal/qr.webp",
      "originalPath": "ero-gal/qr.webp",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Patient check-in flow",
      "alt": "Patient check-in flow",
      "gitBlob": "ecdb9ce67918c35fba56e4471005b3c73f694fc5",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/qr.webp",
      "sha256": "50b891aa56c0bb0f81e88478adf112f27ad912d6f8b5b129c99d0f5bee202619"
    },
    {
      "id": "ero-gal/awards/IMG_2647.WEBP",
      "kind": "image",
      "src": "media/ero-gal/awards/IMG_2647.WEBP",
      "originalPath": "ero-gal/awards/IMG_2647.WEBP",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Team on stage at QuackHacks 3",
      "alt": "Team on stage at QuackHacks 3",
      "gitBlob": "352a1358a68caec0a84ccc4182db9f1bc290f341",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/awards/IMG_2647.WEBP",
      "sha256": "555a970a3fc3dbbd6d47aa5e10806f43661d0d0eafc19188683590ac977d25bf"
    },
    {
      "id": "ero-gal/awards/IMG_2654.WEBP",
      "kind": "image",
      "src": "media/ero-gal/awards/IMG_2654.WEBP",
      "originalPath": "ero-gal/awards/IMG_2654.WEBP",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "QuackHacks 3 - judging",
      "alt": "QuackHacks 3 - judging",
      "gitBlob": "54ce954c29ddbf6bda71efdfc1fa8b93a171c21b",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/ero-gal/awards/IMG_2654.WEBP",
      "sha256": "d301ba6eb2d2b01098d0d27c4f1ef571ad230edaf1734571bf7dc2dd00535661"
    }
  ],
  "links": [
    {
      "id": "link-0",
      "label": "Live Site",
      "href": "https://eroverwatch.tech",
      "kind": "live",
      "verification": "resolved"
    },
    {
      "id": "link-1",
      "label": "GitHub",
      "href": "https://github.com/Jonjlim/Quack3-AJAE",
      "kind": "github",
      "verification": "resolved"
    },
    {
      "id": "link-2",
      "label": "QuackHacks 3",
      "href": "https://2026.quackhacks.org/projects/winners/er-overwatch",
      "kind": "live",
      "verification": "resolved"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "projects.html",
    "anchor": "ER Overwatch"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Original portfolio text retained verbatim; source claims are not independently revalidated."
    ]
  },
  "awards": [
    "🏆 1st Place Overall, QuackHacks 2026"
  ],
  "heroMediaId": "ero-gal/image-02.webp"
}

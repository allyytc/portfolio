// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.
import type { Project } from '../schema'
export const project: Project = {
  "id": "combocraft",
  "title": "ComboCraft",
  "category": "hackathons",
  "presentation": "software",
  "overview": "A gesture-based browser combat game where webcam hand motions cast elemental spells in real time against a multi-phase Demon Boss.",
  "technologies": [
    "JavaScript",
    "Python",
    "MediaPipe",
    "OpenCV",
    "Flask",
    "scikit-learn"
  ],
  "sections": [
    {
      "id": "description",
      "title": "Description",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "ComboCraft started as a late-night “what if we could fight on screen with our hands?” idea and grew into a full browser game set in the Inferno Realm. A fist casts a fireball, an open hand summons an ice shard, a pointed finger calls lightning, and chaining gestures builds combo attacks."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "Players face a Demon Boss whose behavior evolves across phases as its health drops. Three difficulty settings scale the encounter from easy to hard."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ComboCraft"
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
                "text": "How-to / instructions page",
                "emphasis": "strong"
              },
              " - built the in-game guide covering each gesture, spell stats, and battle tips"
            ],
            [
              {
                "text": "Computer vision overlay",
                "emphasis": "strong"
              },
              " - developed the player feed composited onto the game canvas; early prototypes used the raw webcam with the full background before moving to MediaPipe Selfie Segmentation to strip the background and isolate the player"
            ],
            [
              {
                "text": "Gesture classification",
                "emphasis": "strong"
              },
              " - helped train a custom sklearn model on hand-gesture samples to improve spell recognition alongside MediaPipe Hands"
            ],
            [
              {
                "text": "Game engine",
                "emphasis": "strong"
              },
              " - built core JavaScript canvas systems for boss phases, spell rendering, combo attacks, and UI effects"
            ]
          ],
          "ordered": false
        },
        {
          "kind": "paragraph",
          "content": [
            "Getting the overlay to feel natural meant iterating on segmentation quality and frame timing so the cut-out player read clearly against the boss fight without dragging down gameplay."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "Tuning gesture timing meant redesigning the classifier when early motions overlapped, and replacing 60 FPS backend polling with a smoother command pipeline so spells felt responsive in the browser."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ComboCraft"
      }
    },
    {
      "id": "tech-stack",
      "title": "Tech Stack",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "JavaScript, HTML/CSS, Python, Flask, OpenCV, MediaPipe Hands, MediaPipe Selfie Segmentation, scikit-learn"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ComboCraft"
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
                "text": "Gesture spellcasting",
                "emphasis": "strong"
              },
              " - real-time hand motions trigger fire, ice, and lightning spells with dual-hand casting"
            ],
            [
              {
                "text": "Combo system",
                "emphasis": "strong"
              },
              " - chain gestures into multi-step attacks for higher damage"
            ],
            [
              {
                "text": "Multi-phase Demon Boss",
                "emphasis": "strong"
              },
              " - evolving animations, attacks, and behavior as health drops"
            ],
            [
              {
                "text": "Mana & orb system",
                "emphasis": "strong"
              },
              " - collect boss energy fragments to restore mana mid-fight"
            ],
            [
              {
                "text": "Tutorial & UI",
                "emphasis": "strong"
              },
              " - how-to-play guide, difficulty select, and pixel-art menus"
            ]
          ],
          "ordered": false
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "ComboCraft"
      }
    },
    {
      "id": "combocraft-demo",
      "title": "Demo Video",
      "blocks": [
        {
          "kind": "media",
          "mediaId": "https://www.youtube.com/embed/xNuD9hViZFQ"
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "combocraft-demo"
      }
    },
    {
      "id": "combocraft-interface",
      "title": "Interface",
      "blocks": [
        {
          "kind": "gallery",
          "label": "combocraft-interface",
          "mediaIds": [
            "combo-game/gallery (6).jpg",
            "combo-game/gallery (5).jpg",
            "combo-game/gallery (1).jpg",
            "combo-game/gallery (4).jpg",
            "combo-game/gallery.jpg"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "combocraft-interface"
      }
    },
    {
      "id": "combocraft-gallery",
      "title": "Gallery",
      "blocks": [
        {
          "kind": "gallery",
          "label": "combocraft-gallery",
          "mediaIds": [
            "combocraft-event/DSC01945.JPG"
          ]
        },
        {
          "kind": "media",
          "mediaId": "combocraft-event/MAH01763.MP4"
        },
        {
          "kind": "gallery",
          "label": "combocraft-gallery",
          "mediaIds": [
            "combocraft-event/DSC01841.JPG",
            "combocraft-event/DSC01844.JPG",
            "combocraft-event/DSC01845.JPG",
            "combocraft-event/DSC01846.JPG",
            "combocraft-event/IMG_2987.JPG",
            "combocraft-event/IMG_2988.JPG",
            "combocraft-event/IMG_2986.JPG",
            "combocraft-event/IMG_2989.JPG",
            "combocraft-event/IMG_2990.JPG"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js",
        "anchor": "combocraft-gallery"
      }
    }
  ],
  "media": [
    {
      "id": "https://www.youtube.com/embed/xNuD9hViZFQ",
      "kind": "embed",
      "src": "https://www.youtube.com/embed/xNuD9hViZFQ",
      "originalPath": "https://www.youtube.com/embed/xNuD9hViZFQ",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "review-required",
      "caption": "ComboCraft demo - QuackHacks 2025",
      "title": "ComboCraft demo - QuackHacks 2025",
      "watchURL": "https://www.youtube.com/watch?v=xNuD9hViZFQ"
    },
    {
      "id": "combo-game/gallery (6).jpg",
      "kind": "image",
      "src": "media/combo-game/gallery (6).jpg",
      "originalPath": "combo-game/gallery (6).jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Main menu - Enter the Inferno",
      "alt": "Main menu - Enter the Inferno",
      "gitBlob": "eb047f548f47df5005fa7eb4ec20a510f2391194",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combo-game/gallery%20%286%29.jpg",
      "sha256": "e099e85400ed21eed711d5c199b12e089f78fef3de436d20356c2cff4e7dbb41"
    },
    {
      "id": "combo-game/gallery (5).jpg",
      "kind": "image",
      "src": "media/combo-game/gallery (5).jpg",
      "originalPath": "combo-game/gallery (5).jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "How to Play - gesture tutorial and battle tips",
      "alt": "How to Play - gesture tutorial and battle tips",
      "gitBlob": "cd7d4e10682ad803a18739a3101286811440b906",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combo-game/gallery%20%285%29.jpg",
      "sha256": "019ed2b2e88b08a015e75a92eef8d7dc279af81cf7a116e8bdbdd1fa25b561d7"
    },
    {
      "id": "combo-game/gallery (1).jpg",
      "kind": "image",
      "src": "media/combo-game/gallery (1).jpg",
      "originalPath": "combo-game/gallery (1).jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Boss fight - MediaPipe hand tracking and spell casting",
      "alt": "Boss fight - MediaPipe hand tracking and spell casting",
      "gitBlob": "8bcd07c0c296ac3241ba6ea9835830f04b2669cf",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combo-game/gallery%20%281%29.jpg",
      "sha256": "983bb7bb09cabd96d57769f0df2e119eeb5b66d66baab358463926829d9522d4"
    },
    {
      "id": "combo-game/gallery (4).jpg",
      "kind": "image",
      "src": "media/combo-game/gallery (4).jpg",
      "originalPath": "combo-game/gallery (4).jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Defeat Bosses - enemy selection screen",
      "alt": "Defeat Bosses - enemy selection screen",
      "gitBlob": "c895369f81c6333b6fc2e37e664a17631ebec2a0",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combo-game/gallery%20%284%29.jpg",
      "sha256": "aeeb58f861295afab013d67f680f43fea31178040a5a07a922cb01145c7a6450"
    },
    {
      "id": "combo-game/gallery.jpg",
      "kind": "image",
      "src": "media/combo-game/gallery.jpg",
      "originalPath": "combo-game/gallery.jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Victory screen - combo stats and final boss HP",
      "alt": "Victory screen - combo stats and final boss HP",
      "gitBlob": "e322c17e69381a1ca72b737c5d003c4ccb98f8b5",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combo-game/gallery.jpg",
      "sha256": "80bf5d0da8d67a395cb3169c5570afe9287a83f78968fd411b8ebd460157f9f3"
    },
    {
      "id": "combocraft-event/DSC01945.JPG",
      "kind": "image",
      "src": "media/combocraft-event/DSC01945.JPG",
      "originalPath": "combocraft-event/DSC01945.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "1st Place Overall - QuackHacks 2025",
      "alt": "1st Place Overall - QuackHacks 2025",
      "gitBlob": "75ec76dc3d8684909a131027c0edf2a64dea647d",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/DSC01945.JPG",
      "sha256": "dbf95d517d836f78b28f2811c0eda510fa8aa787730759f17a8c997b2e44ccf9"
    },
    {
      "id": "combocraft-event/MAH01763.MP4",
      "kind": "video",
      "src": "media/combocraft-event/MAH01763.MP4",
      "originalPath": "combocraft-event/MAH01763.MP4",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "ComboCraft at QuackHacks 2025 - event footage",
      "title": "ComboCraft at QuackHacks 2025 - event footage",
      "gitBlob": "0ac309adc489bf91494a0c7ab0c7e0baf9960ba2",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/MAH01763.MP4",
      "sha256": "7c7ce5eaa7dc0e1ee1f451e052c9b3103c6975343d07c9928276c0ad1a04ca8c",
      "mime": "video/mp4"
    },
    {
      "id": "combocraft-event/DSC01841.JPG",
      "kind": "image",
      "src": "media/combocraft-event/DSC01841.JPG",
      "originalPath": "combocraft-event/DSC01841.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Final judging stage - presentation and live demo",
      "alt": "Final judging stage - presentation and live demo",
      "gitBlob": "33ba59800c8280d2f7465c37c03be6955ea98bc2",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/DSC01841.JPG",
      "sha256": "73ecb81a604370dd95af733502994177f3b794b94f74c4c090e4377c72b30745"
    },
    {
      "id": "combocraft-event/DSC01844.JPG",
      "kind": "image",
      "src": "media/combocraft-event/DSC01844.JPG",
      "originalPath": "combocraft-event/DSC01844.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Final judging stage - presentation and live demo",
      "alt": "Final judging stage - presentation and live demo",
      "gitBlob": "2821f345353e05764ea63adb9c219115a8eb1795",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/DSC01844.JPG",
      "sha256": "708b5cf15b1d6459e60a91ac5324c372741ae4a349ead93ea99a7dda9623f086"
    },
    {
      "id": "combocraft-event/DSC01845.JPG",
      "kind": "image",
      "src": "media/combocraft-event/DSC01845.JPG",
      "originalPath": "combocraft-event/DSC01845.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Final judging stage - presentation and live demo",
      "alt": "Final judging stage - presentation and live demo",
      "gitBlob": "de8e1c403ab26c53617a80fbeb0b83eee2e85a4a",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/DSC01845.JPG",
      "sha256": "d602fcdfc3a256289d1faded490f961be2c574b644bb03016debcbf10f5cf868"
    },
    {
      "id": "combocraft-event/DSC01846.JPG",
      "kind": "image",
      "src": "media/combocraft-event/DSC01846.JPG",
      "originalPath": "combocraft-event/DSC01846.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Final judging stage - presentation and live demo",
      "alt": "Final judging stage - presentation and live demo",
      "gitBlob": "158aea33b51ab08e708b9672e4ee681584376cf6",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/DSC01846.JPG",
      "sha256": "1e0bc7773f38be9abb7d2867f0823abd1e34a32961ed9395fd14fc9a487a5803"
    },
    {
      "id": "combocraft-event/IMG_2987.JPG",
      "kind": "image",
      "src": "media/combocraft-event/IMG_2987.JPG",
      "originalPath": "combocraft-event/IMG_2987.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Judging stage - Pipeworks judges",
      "alt": "Judging stage - Pipeworks judges",
      "gitBlob": "5b8aebd5bc414cdf32bb8f1eb2385b3672775d7b",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/IMG_2987.JPG",
      "sha256": "07347c8eee96d7b527943e6db0266dc9200524b196b1440e37a59c2a2039404f"
    },
    {
      "id": "combocraft-event/IMG_2988.JPG",
      "kind": "image",
      "src": "media/combocraft-event/IMG_2988.JPG",
      "originalPath": "combocraft-event/IMG_2988.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Judging stage - Pipeworks judges",
      "alt": "Judging stage - Pipeworks judges",
      "gitBlob": "87c72eaaebdc69cc76f33a55524de0eb4b4f6720",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/IMG_2988.JPG",
      "sha256": "a0dc51fd38ba67d28b80ac88647216f567b535f50d450d911dbc94a7a1da1696"
    },
    {
      "id": "combocraft-event/IMG_2986.JPG",
      "kind": "image",
      "src": "media/combocraft-event/IMG_2986.JPG",
      "originalPath": "combocraft-event/IMG_2986.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Judging stage - Pipeworks judges",
      "alt": "Judging stage - Pipeworks judges",
      "gitBlob": "e25cc6da0679333913bf094edb6592958be1c61d",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/IMG_2986.JPG",
      "sha256": "3e09c3fa1632793024ca62b648103b0393135fc185053c453a00e9c99e811bd4"
    },
    {
      "id": "combocraft-event/IMG_2989.JPG",
      "kind": "image",
      "src": "media/combocraft-event/IMG_2989.JPG",
      "originalPath": "combocraft-event/IMG_2989.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Project fair - staff stopped by to play",
      "alt": "Project fair - staff stopped by to play",
      "gitBlob": "daff985de7afa8018c336eb2fbf8720b1380e795",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/IMG_2989.JPG",
      "sha256": "485ab81e8dc88975bb7cb26aa6fc8e0050d5b51b90987bf2b4c983a9a3d3e493"
    },
    {
      "id": "combocraft-event/IMG_2990.JPG",
      "kind": "image",
      "src": "media/combocraft-event/IMG_2990.JPG",
      "originalPath": "combocraft-event/IMG_2990.JPG",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.js"
      },
      "rights": "owner-local-rebuild",
      "caption": "Project fair - staff stopped by to play",
      "alt": "Project fair - staff stopped by to play",
      "gitBlob": "523b328016bfabc4e248509e48a987a099e0da90",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/combocraft-event/IMG_2990.JPG",
      "sha256": "6d4b6bfd9fe398610f8154976279f1c48463dec77e4ed7b8dabec539d886c452"
    }
  ],
  "links": [
    {
      "id": "link-0",
      "label": "GitHub",
      "href": "https://github.com/alwxngn/ComboCraft",
      "kind": "github",
      "verification": "resolved"
    },
    {
      "id": "link-1",
      "label": "Devpost",
      "href": "https://devpost.com/software/combocraft-azuynr",
      "kind": "devpost",
      "verification": "blocked"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "projects.html",
    "anchor": "ComboCraft"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Original portfolio text retained verbatim; source claims are not independently revalidated."
    ]
  },
  "awards": [
    "🏆 1st Place, QuackHacks 2025"
  ],
  "heroMediaId": "combo-game/gallery (6).jpg"
}

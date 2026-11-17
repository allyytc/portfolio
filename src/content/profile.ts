import type { Profile, MediaAsset } from './schema'
export const profile: Profile & { media: readonly MediaAsset[] } = {
  "name": "Ally Chen",
  "subtitle": "Developer · Designer · Product",
  "preferredRole": "Software Developer Intern @ Impact Studio",
  "about": [
    {
      "id": "about-original",
      "title": "About me",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "I'm a computer science major at Oregon State University, graduating June 2028, with a minor in Business Information Systems. I'm looking for ",
            { "text": "product management and APM roles", "emphasis": "strong" },
            " first, then design and UI, and selective software engineering or technical program roles."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "I'm a ",
            { "text": "Software Developer Intern at OSU Impact Studio", "emphasis": "strong" },
            ". I also build hackathon products, including computer-vision tools, real-time web apps, and 3D interfaces."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "I go from research and interface design through to the build. I co-founded ",
            { "text": "Startup Hub at OSU", "emphasis": "strong" },
            " and lead a ",
            { "text": "Design for America", "emphasis": "strong" },
            " team on a nonprofit website that serves 300+ people a day."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "about-original"
      }
    }
  ],
  "education": [
    {
      "degree": "B.S. Computer Science",
      "institution": "Oregon State University",
      "minor": "Business Information Systems",
      "graduation": "June 2028",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "about"
      }
    }
  ],
  "experience": [
    {
      "id": "impact-studio",
      "title": "Software Developer Intern",
      "organization": "Impact Studio · Oregon State University",
      "dates": "May 2026 - Present",
      "sections": [
        {
          "id": "role-responsibilities",
          "title": "Responsibilities",
          "blocks": [
            {
              "kind": "list",
              "items": [
                ["Leading the Impact Studio site redesign: navigation, homepage, and content structure, then shipping it in Drupal."],
                ["Setting up faculty initiative subdomains and keeping the studio site running."],
                ["Turning traffic into short performance reports that guide UX and content decisions."],
                ["Working with marketers, designers, and other contributors to get the team's direction onto the live site."]
              ]
            }
          ],
          "source": {
            "repository": "allyytc/allyytc.github.io",
            "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
            "path": "index.html",
            "anchor": "role-responsibilities"
          }
        }
      ],
      "links": [
        {
          "id": "11",
          "label": "Live site",
          "href": "https://impactstudio.oregonstate.edu/"
        }
      ],
      "projectIds": [
        "impact-studio"
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "experience"
      },
      "verification": {
        "status": "source-preserved"
      }
    },
    {
      "id": "dfa",
      "title": "Project Lead",
      "organization": "Design for America · Oregon State University",
      "dates": "Jan 2026 - Present",
      "sections": [{
        "id": "dfa-role",
        "title": "What I do",
        "blocks": [{ "kind": "list", "items": [
          ["Lead an 11-person team on the Corvallis Daytime Drop-In Center website, from discovery and wireframes through front-end development."],
          ["Still finishing the site with a few teammates after the DFA term ended."]
        ]}]
      }],
      "projectIds": ["cddc"],
      "source": { "repository": "allyytc/allyytc.github.io", "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10", "path": "involvement.html", "anchor": "dfa" },
      "verification": { "status": "source-preserved" }
    },
    {
      "id": "esc",
      "title": "Vice President of Outreach",
      "organization": "Engineering Student Council · Oregon State University",
      "dates": "June 2025 - Present",
      "sections": [{
        "id": "esc-role",
        "title": "What I do",
        "blocks": [{ "kind": "list", "items": [
          ["Represent engineering students in faculty and university discussions, including curriculum and tuition."],
          ["Run outreach across 50+ student organizations and help allocate $200K+ in funding with the VP of Finance."],
          ["Design ESC graphics, event materials, and merchandise, including Engineers' Week."]
        ]}]
      }],
      "source": { "repository": "allyytc/allyytc.github.io", "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10", "path": "involvement.html", "anchor": "esc" },
      "verification": { "status": "source-preserved" }
    },
    {
      "id": "startup-hub",
      "title": "Co-Founder",
      "organization": "Startup Hub · Oregon State University",
      "dates": "June 2025 - Present",
      "sections": [{
        "id": "startup-role",
        "title": "What I do",
        "blocks": [{ "kind": "list", "items": [
          ["Co-founded OSU's entrepreneurship community: the brand, the club structure, and connections to the College of Business, Oregon Startup Center, and AI Collective."],
          ["Organizing Innovation Jam '26."]
        ]}]
      }],
      "source": { "repository": "allyytc/allyytc.github.io", "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10", "path": "involvement.html", "anchor": "startup" },
      "verification": { "status": "source-preserved" }
    },
    {
      "id": "beaverhacks-org",
      "title": "Core & Marketing Team",
      "organization": "BeaverHacks · Oregon State University",
      "dates": "June 2025 - Present",
      "sections": [{
        "id": "bh-role",
        "title": "What I do",
        "blocks": [{ "kind": "list", "items": [
          ["Help run BeaverHacks, Oregon's largest collegiate hackathon at OSU, a 24-hour event with 500+ students."],
          ["Marketing, sticker and merch design, volunteers, and event-day logistics."]
        ]}]
      }],
      "source": { "repository": "allyytc/allyytc.github.io", "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10", "path": "involvement.html", "anchor": "beaverhacks" },
      "verification": { "status": "source-preserved" }
    },
    {
      "id": "ai-club-role",
      "title": "Project Officer",
      "organization": "Artificial Intelligence Club · Oregon State University",
      "dates": "June 2025 - Present",
      "sections": [{
        "id": "ai-role",
        "title": "What I do",
        "blocks": [{ "kind": "list", "items": [
          ["Support the weekly project workshop and wrote NumPy tutorials members used during the term."],
          ["Help with projects from image classification to poker agents and Kaggle competitions."],
          ["Stepping into Marketing Lead next year."]
        ]}]
      }],
      "source": { "repository": "allyytc/allyytc.github.io", "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10", "path": "involvement.html", "anchor": "ai-club" },
      "verification": { "status": "source-preserved" }
    }
  ],
  "skills": [
    {
      "id": "skills-0",
      "title": "Languages",
      "items": ["Python", "JavaScript", "TypeScript", "C++", "SQL", "HTML/CSS", "Dart"],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-1",
      "title": "Frameworks & Libraries",
      "items": ["React", "Next.js", "React Three Fiber", "Three.js", "Node.js", "Express", "Tailwind CSS", "Flutter", "React Native"],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-ai",
      "title": "AI & Data",
      "items": ["Fetch.ai", "MediaPipe", "PyTorch", "scikit-learn", "Pandas", "NumPy", "OpenCV"],
      "source": {
        "repository": "allyytc/portfolio",
        "ref": "content-refresh",
        "path": "src/content/profile.ts",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-2",
      "title": "Tools & Platforms",
      "items": ["Git", "Drupal", "WordPress", "Blender", "Godot", "MySQL", "MariaDB", "phpMyAdmin", "Jupyter", "Chrome Extensions API"],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-3",
      "title": "Design",
      "items": [
        "UI/UX Design",
        "Graphic Design",
        "UX Research",
        "Figma",
        "Canva"
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-4",
      "title": "Leadership & Soft Skills",
      "items": [
        "Project Management",
        "Team Management",
        "Public Speaking",
        "Marketing",
        "Leadership"
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-5",
      "title": "Other",
      "items": [
        "REST APIs",
        "Data Structures & Algorithms"
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    }
  ],
  "links": [
    {
      "id": "1",
      "label": "Resume",
      "href": "https://allyytc.github.io/allychen-resume2028-pm.pdf"
    },
    {
      "id": "2",
      "label": "allyten08@gmail.com",
      "href": "mailto:allyten08@gmail.com"
    },
    {
      "id": "3",
      "label": "linkedin.com/in/allyychen",
      "href": "https://linkedin.com/in/allyychen/"
    },
    {
      "id": "4",
      "label": "github.com/allyytc",
      "href": "https://github.com/allyytc"
    },
    {
      "id": "5",
      "label": "(503) 866-0073",
      "href": "tel:5038660073"
    }
  ],
  "media": [
    {
      "id": "about-photo.jpg",
      "kind": "image",
      "src": "media/about-photo.jpg",
      "originalPath": "about-photo.jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html"
      },
      "rights": "owner-local-rebuild",
      "gitBlob": "1637a95d8fc310357ecaf1baafe0c8d6d9d57127",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/about-photo.jpg",
      "caption": "Ally Chen",
      "alt": "Ally Chen",
      "sha256": "0f3e47988b82907ebba06732e794fd5e2d00288ed2bc48be3cd41fe722bf7db0"
    },
    {
      "id": "headshot.jpg",
      "kind": "image",
      "src": "media/headshot.jpg",
      "originalPath": "headshot.jpg",
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html"
      },
      "rights": "owner-local-rebuild",
      "gitBlob": "cb2630c438b5fea2c1792a43f6db70bdcf3c54cd",
      "sourceURL": "https://raw.githubusercontent.com/allyytc/allyytc.github.io/35ecfec2c43c535ea013e23720ffa6ad73108f10/headshot.jpg",
      "caption": "Ally Chen",
      "alt": "Ally Chen — original homepage portrait",
      "sha256": "fb106d0ee439d5e63695439682035f4f7e00f0185d70695f9aa633cbc965cb42"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "index.html"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Visible role is Software Developer Intern, including the Impact Studio job title. Campus roles below use the titles and dates already published in the community section."
    ]
  }
}

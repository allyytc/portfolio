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
            "I'm a Computer Science student at Oregon State University (graduating June 2028) with a focus in Business Information Systems. I'm looking for ",
            {
              "text": "internship and new-grad roles",
              "emphasis": "strong"
            },
            " in ",
            {
              "text": "software engineering",
              "emphasis": "strong"
            },
            ", ",
            {
              "text": "UX/UI",
              "emphasis": "strong"
            },
            ", ",
            {
              "text": "product",
              "emphasis": "strong"
            },
            ", and other tech paths where ",
            {
              "text": "business, design, and creative work",
              "emphasis": "strong"
            },
            " intersect - places I can ship real products, grow as a builder, and learn from working teams."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "I'm currently a ",
            {
              "text": "Web Developer Intern at OSU Impact Studio",
              "emphasis": "strong"
            },
            ", shipping website updates in Drupal and Figma. Recent builds include ",
            {
              "text": "award-winning hackathon projects",
              "emphasis": "strong"
            },
            " in computer vision and real-time web apps."
          ]
        },
        {
          "kind": "paragraph",
          "content": [
            "I work end-to-end - from wireframes and user research to React, Python, and API integration - and I'm as comfortable in Figma as I am in a codebase. I co-founded ",
            {
              "text": "Startup Hub at OSU",
              "emphasis": "strong"
            },
            " and lead a ",
            {
              "text": "Design for America",
              "emphasis": "strong"
            },
            " team shipping a nonprofit website for 300+ daily users."
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
      "title": "Web Developer Intern",
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
                [
                  "Leading a full redesign of the Impact Studio website - restructuring navigation, homepage hierarchy, and content layout so visitors understand the initiative at first glance."
                ],
                [
                  "Managed OSU Impact Studio's site and subdomains using Drupal, HTML, and CSS."
                ],
                [
                  "Configured and launched new faculty initiative subdomains end-to-end."
                ],
                [
                  "Analyzed website traffic and produced performance reports to guide UX and content strategy decisions."
                ]
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
          "label": "View Work →",
          "href": "https://allyytc.github.io/projects.html#project-impact-studio"
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
    }
  ],
  "skills": [
    {
      "id": "skills-0",
      "title": "Languages",
      "items": [
        "Python",
        "JavaScript",
        "TypeScript",
        "C++",
        "SQL",
        "MySQL",
        "MariaDB",
        "HTML/CSS",
        "Dart"
      ],
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
      "items": [
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "TailwindCSS",
        "Flutter",
        "React Native",
        "PyTorch",
        "scikit-learn",
        "Pandas",
        "NumPy",
        "OpenCV"
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "index.html",
        "anchor": "skills"
      }
    },
    {
      "id": "skills-2",
      "title": "Tools & Platforms",
      "items": [
        "Git",
        "Drupal",
        "WordPress",
        "phpMyAdmin",
        "Godot",
        "Jupyter",
        "Chrome Extensions API"
      ],
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
      "Preferred visible role is owner-approved; original Web Developer Intern title and biography wording remain intact.",
      "Only one professional role exists in the authoritative static source. No additional roles or personal interests are invented."
    ]
  }
}

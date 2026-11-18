// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.
import type { Project } from '../schema'
export const project: Project = {
  "id": "sallys-pos",
  "title": "Sally's Coffee Shop POS System",
  "category": "past-projects",
  "presentation": "technical",
  "overview": "A point-of-sale system for a coffee counter: customers, a live order queue, inventory, and loyalty points that update when a drink is completed. I designed the schema and built the back end.",
  "technologies": [
    "Node.js",
    "Express",
    "MySQL",
    "REST API"
  ],
  "sections": [
    {
      "id": "description",
      "title": "Problem",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "A counter needs one transaction to place an order, redeem points, and later award them. If those steps live in the page instead of the database, the totals drift."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "Sally's Coffee Shop POS System"
      }
    },
    {
      "id": "my-role",
      "title": "My Role",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "I designed the schema and built the back end, including the REST API and the stored procedures for the order workflow. OSU databases course, January–March 2026."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "Sally's Coffee Shop POS System"
      }
    },
    {
      "id": "highlights",
      "title": "Highlights",
      "blocks": [
        {
          "kind": "list",
          "items": [
            ["Designed five tables, customers, orders, products, line items, and inventory, with foreign keys that cascade when a parent row goes away."],
            ["Put the order workflow in stored procedures: place a queued order, complete it and award points, or cancel it."],
            ["Exposed the counter through 8+ REST endpoints for customers, the queue, inventory, and redemptions."]
          ]
        }
      ]
    },
    {
      "id": "tech-stack",
      "title": "Tech Stack",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "Node.js, Express, MySQL, REST API, phpMyAdmin"
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "Sally's Coffee Shop POS System"
      }
    }
  ],
  "media": [],
  "links": [
    {
      "id": "link-0",
      "label": "GitHub",
      "href": "https://github.com/allyytc/Sallys-POS",
      "kind": "github",
      "verification": "resolved"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "projects.html",
    "anchor": "Sally's Coffee Shop POS System"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Original portfolio text retained verbatim; source claims are not independently revalidated."
    ]
  }
}

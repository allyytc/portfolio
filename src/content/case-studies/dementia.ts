// Extracted from pinned source; regenerate with migrate_projects_phase6b.py.
import type { Project } from '../schema'
export const project: Project = {
  "id": "dementia",
  "title": "Dementia Risk Predictor",
  "category": "past-projects",
  "presentation": "technical",
  "overview": "Estimates dementia risk from OASIS clinical measurements and shows which features drive the call. The project README reports 82.6% accuracy for a random forest on held-out data.",
  "technologies": [
    "Python",
    "scikit-learn",
    "Pandas",
    "Jupyter"
  ],
  "sections": [
    {
      "id": "description",
      "title": "Problem",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "Early screening needs a signal from measurements a clinic already collects, and a way to see which of those measurements the model is actually using."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "Dementia Risk Predictor"
      }
    },
    {
      "id": "my-role",
      "title": "My Role",
      "blocks": [
        {
          "kind": "paragraph",
          "content": [
            "I cleaned the OASIS data, trained and compared classifiers, and analyzed feature importance. The README's model is a random forest on age, MMSE, education, socioeconomic status, and brain-volume measures."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "Dementia Risk Predictor"
      }
    },
    {
      "id": "highlights",
      "title": "Highlights",
      "blocks": [
        {
          "kind": "list",
          "items": [
            ["Trained a random forest on OASIS measurements: age, MMSE, years of education, socioeconomic status, and brain volume."],
            ["Compared classifiers and used feature importance to show which measurements the model was using."],
            ["Shipped a Streamlit app: set the measurements, get a risk result, and see the call in one screen."]
          ]
        },
        {
          "kind": "paragraph",
          "content": ["Educational use only. This is not a medical diagnosis."]
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
            "Python, scikit-learn, Pandas, NumPy, Jupyter, Streamlit."
          ]
        }
      ],
      "source": {
        "repository": "allyytc/allyytc.github.io",
        "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
        "path": "projects.html",
        "anchor": "Dementia Risk Predictor"
      }
    }
  ],
  "media": [],
  "links": [
    {
      "id": "link-0",
      "label": "GitHub",
      "href": "https://github.com/allyytc/dementia-detector",
      "kind": "github",
      "verification": "resolved"
    },
    {
      "id": "link-1",
      "label": "Live app",
      "href": "https://allyytc-dementia-detector.streamlit.app/",
      "kind": "live",
      "verification": "resolved"
    }
  ],
  "source": {
    "repository": "allyytc/allyytc.github.io",
    "ref": "35ecfec2c43c535ea013e23720ffa6ad73108f10",
    "path": "projects.html",
    "anchor": "Dementia Risk Predictor"
  },
  "verification": {
    "status": "source-preserved",
    "notes": [
      "Original portfolio text retained verbatim; source claims are not independently revalidated."
    ]
  }
}

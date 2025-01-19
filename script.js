const data = {
  Physics: {
    "Electrodynamics (23%)": [
      "Current Electricity",
      "Electrostatics",
      "Electromagnetic Field",
      "Electromagnetic Induction",
      "Alternating Current",
    ],
    "Mechanics (20%)": [
      "Newton's Laws of Motion",
      "Rigid Body Dynamics",
      "Gravitation",
      "Projectile Motion",
      "Elasticity & Viscosity",
    ],
    "Modern Physics (17%)": [
      "Photoelectric Effect",
      "Nuclear Physics",
      "Electromagnetic Waves",
    ],
    "Heat and Thermodynamics (7%)": [
      "Calorimetry & Thermal Expansion",
      "KTG & Thermodynamics",
    ],
    "Optics (3%)": ["Geometrical Optics & Physical Optics"],
    "SHM and Waves (7%)": ["Simple Harmonic Motion", "String Wave"],
  },
  Chemistry: {
    "Inorganic Chemistry-I (20%)": [
      "Chemical Bonding",
      "Periodic Table & Periodicity in Properties",
      "s-block and p-block (15-16 Groups)",
    ],
    "Inorganic Chemistry-II (17%)": [
      "Coordination Compounds",
      "d-block & f-block Elements",
      "Metallurgy and Qualitative Analysis",
    ],
    "Organic Chemistry-II (23%)": [
      "Organic Reaction Mechanism (Hydrocarbons, Alkyl Halides, Alcohols, and Ethers)",
      "Biomolecules (Carbohydrates, Amino Acids, DNA, RNA)",
    ],
    "Physical Chemistry-I (13%)": [
      "Thermodynamics",
      "Ionic Equilibrium",
      "Mole Concept",
    ],
    "Physical Chemistry-II (7%)": [
      "Chemical Kinetics",
      "Solutions & Colligative Properties",
    ],
  },
  Mathematics: {
    "Differential Calculus (13%)": [
      "Continuity & Differentiability",
      "Methods of Differentiation",
    ],
    "Integral Calculus (10%)": ["Definite Integration", "Area Under Curve"],
    "Coordinate Geometry (7%)": ["Ellipse and Parabola", "Circle"],
    "Vector and 3D Geometry (7%)": [
      "Three-Dimensional Geometry",
      "Vector Algebra",
    ],
    "Algebra (7%)": ["Binomial Theorem", "Permutation and Combination"],
    "Probability and Mathematical Reasoning (6%)": [
      "Bayes' Theorem",
      "Mathematical Reasoning",
    ],
    "Trigonometry (3%)": ["Inverse Trigonometric Functions"],
  },
};

function createChecklist() {
  const checklistDiv = document.getElementById("checklist");

  // Helper to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const path = window.location.pathname.split('/').slice(0, 2).join('/');
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
  }

  // Helper to get a cookie
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, val] = cookie.split("=");
      if (key === name) return val;
    }
    return null;
  }

  // Save checkbox state to cookies
  function saveState() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const state = {};
    checkboxes.forEach((checkbox) => {
      state[checkbox.id] = checkbox.checked;
    });
    setCookie("checklistState", JSON.stringify(state), 365); // Save for 1 year
  }

  // Load checkbox state from cookies
  function loadState() {
    const state = JSON.parse(getCookie("checklistState") || "{}");
    Object.entries(state).forEach(([id, checked]) => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = checked;
        const label = checkbox.nextElementSibling;
        if (label) label.classList.toggle("strikethrough", checked);
      }
    });
  }

  for (const [subject, topics] of Object.entries(data)) {
    // Create a subject header
    const subjectHeader = document.createElement("div");
    subjectHeader.textContent = subject;
    subjectHeader.classList.add("subject");
    subjectHeader.dataset.subject = subject;

    // Create a view button (except for Mathematics)
    if (subject !== "Mathematics") {
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Formulae Sheet";
      viewButton.classList.add("download-button");
      viewButton.addEventListener("click", () => {
        let fileName;
        switch (subject) {
          case "Physics":
            fileName = "pdf-viewer.html?file=pdfs/Chapter_1_ECaF.pdf";
            break;
          case "Chemistry":
            fileName = "pdf-viewer.html?file=pdfs/c1.pdf";
            break;
          default:
            alert("No formulae sheet available for this subject.");
            return;
        }
        window.location.href = fileName;
      });

      subjectHeader.appendChild(viewButton);
    }

    // Create a container for the topics (initially hidden)
    const topicContainer = document.createElement("div");
    topicContainer.classList.add("hidden");

    const topicList = document.createElement("ul");
    for (const [topic, subtopics] of Object.entries(topics)) {
      const topicItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${subject}-${topic}`; // Unique ID for each checkbox

      const label = document.createElement("label");
      label.textContent = topic;

      // Add event listener for strikethrough and save state
      checkbox.addEventListener("change", () => {
        label.classList.toggle("strikethrough", checkbox.checked);
        saveState();
      });

      // Add event listener to label to toggle checkbox
      label.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
        label.classList.toggle("strikethrough", checkbox.checked);
        saveState();
      });

      topicItem.appendChild(checkbox);
      topicItem.appendChild(label);
      topicList.appendChild(topicItem);

      const subtopicList = document.createElement("ul");
      subtopicList.classList.add("topic");

      subtopics.forEach((subtopic, index) => {
        const subtopicItem = document.createElement("li");
        const subCheckbox = document.createElement("input");
        subCheckbox.type = "checkbox";
        subCheckbox.id = `${subject}-${topic}-${index}`; // Unique ID for each sub-checkbox

        const subLabel = document.createElement("label");
        subLabel.textContent = subtopic;

        // Add event listener for strikethrough and save state
        subCheckbox.addEventListener("change", () => {
          subLabel.classList.toggle("strikethrough", subCheckbox.checked);
          saveState();
        });

        // Add event listener to subLabel to toggle subCheckbox
        subLabel.addEventListener("click", () => {
          subCheckbox.checked = !subCheckbox.checked;
          subLabel.classList.toggle("strikethrough", subCheckbox.checked);
          saveState();
        });

        subtopicItem.appendChild(subCheckbox);
        subtopicItem.appendChild(subLabel);
        subtopicList.appendChild(subtopicItem);
      });

      topicList.appendChild(subtopicList);
    }

    topicContainer.appendChild(topicList);
    checklistDiv.appendChild(subjectHeader);
    checklistDiv.appendChild(topicContainer);

    // Toggle visibility when subject header is clicked
    subjectHeader.addEventListener("click", () => {
      topicContainer.classList.toggle("hidden");
      topicContainer.classList.toggle("expanded");
    });
  }

  // Load the saved state on page load
  loadState();
}

document.addEventListener("DOMContentLoaded", createChecklist);

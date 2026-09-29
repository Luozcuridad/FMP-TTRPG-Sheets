// ---------- 1. Build the skill checkboxes from a list ----------
// Edit this list to add or rename skills. Order is left column, then right column.
const SKILLS = [
  "Leader", "Melee Fighter", "Heavy Gunner", "Sniper", "Pilot",
  "Engineer", "Hacker", "Medic", "Rescuer", "Escape Artist",
  "Analyst", "Spy", "Recon", "Charming", "Well-Prepared",
  "Cold-Blooded", "Scavenger", "Wealthy", "Magical", "Lucky",
];

const skillsBox = document.getElementById("skills");
SKILLS.forEach((label, i) => {
  const row = document.createElement("label");
  row.className = "skill";
  row.innerHTML = `<input type="checkbox" id="skill-${i}"><span>${label}</span>`;
  skillsBox.appendChild(row);
});

// ---------- 2. Portrait image ----------
const portraitBox = document.getElementById("portrait");
const portraitImg = document.getElementById("portrait-img");
const portraitFile = document.getElementById("portrait-file");
const portraitHint = portraitBox.querySelector(".hint");
let portraitData = ""; // the image stored as text (a data URL)

function setPortrait(dataUrl) {
  portraitData = dataUrl || "";
  portraitImg.hidden = !portraitData;
  portraitImg.src = portraitData;
  portraitHint.hidden = !!portraitData;
}

// Shrink big photos so saving stays small and fast
function loadPortrait(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1000;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setPortrait(canvas.toDataURL("image/jpeg", 0.85));
      autosave();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

portraitBox.addEventListener("click", () => portraitFile.click());
portraitBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); portraitFile.click(); }
});
portraitFile.addEventListener("change", () => {
  loadPortrait(portraitFile.files[0]);
  portraitFile.value = ""; // lets you pick the same file again later
});

// Drag and drop onto the portrait box
["dragenter", "dragover"].forEach((type) =>
  portraitBox.addEventListener(type, (e) => {
    e.preventDefault();
    portraitBox.classList.add("dragging");
  })
);
["dragleave", "drop"].forEach((type) =>
  portraitBox.addEventListener(type, (e) => {
    e.preventDefault();
    portraitBox.classList.remove("dragging");
  })
);
portraitBox.addEventListener("drop", (e) => loadPortrait(e.dataTransfer.files[0]));

// ---------- 3. Collect and apply the sheet data ----------
const fields = () => document.querySelectorAll(".sheet input, .sheet textarea");

function collect() {
  const data = { portrait: portraitData };
  fields().forEach((el) => {
    data[el.id] = el.type === "checkbox" ? el.checked : el.value;
  });
  return data;
}

function apply(data) {
  fields().forEach((el) => {
    const value = data[el.id];
    if (el.type === "checkbox") el.checked = !!value;
    else el.value = value ?? "";
  });
  setPortrait(data.portrait);
}

// ---------- 4. Autosave in this browser ----------
const KEY = "fmp-amazon-sheet";

function autosave() {
  try {
    localStorage.setItem(KEY, JSON.stringify(collect()));
  } catch (err) {
    console.warn("Autosave failed (storage full or blocked).", err);
  }
}

document.querySelector(".sheet").addEventListener("input", autosave);
document.querySelector(".sheet").addEventListener("change", autosave);

try {
  const saved = localStorage.getItem(KEY);
  if (saved) apply(JSON.parse(saved));
} catch (err) {
  console.warn("Could not read the saved character.", err);
}


// ---------- 5. Toolbar buttons ----------
document.getElementById("btn-print").addEventListener("click", () => window.print());

document.getElementById("btn-clear").addEventListener("click", () => {
  if (!confirm("Start a new character? Unsaved changes will be lost.")) return;
  apply({});
  try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
});


// ---------- 6. Save as PNG ----------
document.getElementById("btn-png").addEventListener("click", async () => {
  if (typeof html2canvas === "undefined") {
    alert("The PNG tool did not load. Check your internet connection.");
    return;
  }
  const sheet = document.querySelector(".sheet");
  if (document.activeElement) document.activeElement.blur();
  sheet.classList.add("exporting");
  try {
    const canvas = await html2canvas(sheet, {
      scale: 3,
      backgroundColor: "#ffffff",
      onclone: (doc) => {
        // Swap stat inputs and checkboxes for plain elements in the captured copy
        doc.querySelectorAll(".stat input").forEach((el) => {
          const box = doc.createElement("div");
          box.className = "num-box";
          box.textContent = document.getElementById(el.id).value;
          el.replaceWith(box);
        });
        doc.querySelectorAll(".skill input").forEach((el) => {
          const box = doc.createElement("span");
          box.className = "fake-check";
          if (document.getElementById(el.id).checked) box.innerHTML = "<i></i>";
          el.replaceWith(box);
        });
      },
    });

    canvas.toBlob((blob) => {
      const name = (document.getElementById("name").value || "character")
        .trim().replace(/[^\w\-]+/g, "_") || "character";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  } catch (err) {
    console.error(err);
    alert("Could not create the PNG.");
  } finally {
    sheet.classList.remove("exporting");
  }
});